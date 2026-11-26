import { afterAll, describe, expect, it } from "vitest";
import { connect, rolledBack } from "./helpers";

const sql = connect();
afterAll(() => sql.end());

const ROLES = ["anon", "authenticated"] as const;
const PRIVILEGES = ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "TRIGGER", "REFERENCES"];

describe("lock down", () => {
  it("has row level security on every public table", async () => {
    const open = await sql`select relname from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' and not relrowsecurity`;
    expect(open.map((r) => r.relname)).toEqual([]);
  });

  it("never lets a public API role truncate, add triggers or add references", async () => {
    const found = await sql`
      select r.role || ' ' || p.priv || ' ' || t.relname as grant
      from pg_class t, unnest(${[...ROLES]}::text[]) r(role), unnest(array['TRUNCATE','TRIGGER','REFERENCES']) p(priv)
      where t.relnamespace = 'public'::regnamespace and t.relkind = 'r' and has_table_privilege(r.role, t.oid, p.priv)`;
    expect(found.map((f) => f.grant)).toEqual([]);
  });

  it("grants exactly what DATABASE_ARCHITECTURE.md 10.2 allows", async () => {
    // "*" means every column; a list means only those columns.
    const columns = await sql`select table_name, column_name from information_schema.columns where table_schema = 'public' order by table_name, column_name collate "C"`;
    const all: Record<string, string[]> = {};
    for (const c of columns) (all[c.table_name] ??= []).push(c.column_name);
    const except = (table: string, ...hidden: string[]) => all[table]!.filter((c) => !hidden.includes(c));

    const catalog: Record<string, Record<string, string[]>> = {};
    for (const t of ["products", "product_images", "category_products", "collection_products", "categories", "collections", "banners"]) {
      catalog[t] = { SELECT: all[t]! };
    }
    catalog.product_variants = { SELECT: except("product_variants", "inventory_quantity", "reorder_level") };
    const owned = (t: string) => ({ SELECT: all[t]!, INSERT: all[t]!, UPDATE: all[t]!, DELETE: ["*"] });
    const expected = {
      anon: catalog,
      authenticated: {
        ...catalog,
        customers: { SELECT: all.customers!, UPDATE: ["full_name", "phone"] },
        addresses: owned("addresses"), wishlists: owned("wishlists"), wishlist_items: owned("wishlist_items"),
        orders: { SELECT: except("orders", "idempotency_key") },
        order_items: { SELECT: all.order_items! },
        order_addresses: { SELECT: all.order_addresses! },
        payments: { SELECT: ["amount", "created_at", "currency", "id", "method", "order_id", "status"] },
        order_status_history: { SELECT: ["created_at", "from_status", "id", "kind", "order_id", "to_status"] },
      },
    };

    for (const role of ROLES) {
      const actual: Record<string, Record<string, string[]>> = {};
      const held = await sql`
        select t.relname as table_name, p.priv, a.attname as column_name
        from pg_class t join pg_attribute a on a.attrelid = t.oid and a.attnum > 0 and not a.attisdropped,
          unnest(array['SELECT','INSERT','UPDATE']) p(priv)
        where t.relnamespace = 'public'::regnamespace and t.relkind = 'r' and has_column_privilege(${role}, t.oid, a.attnum, p.priv)
        order by t.relname, p.priv, a.attname::text collate "C"`;
      for (const h of held) ((actual[h.table_name] ??= {})[h.priv] ??= []).push(h.column_name);
      const deletable = await sql`select relname as tablename from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' and has_table_privilege(${role}, oid, 'DELETE')`;
      for (const d of deletable) (actual[d.tablename] ??= {}).DELETE = ["*"];
      const sorted = (m: Record<string, Record<string, string[]>>) =>
        Object.fromEntries(Object.entries(m).map(([t, privs]) => [t, Object.fromEntries(Object.entries(privs).map(([k, v]) => [k, [...v].sort()]))]));
      expect(sorted(actual), role).toEqual(sorted(expected[role]));
    }
  });

  it("starts new tables, sequences and functions closed", async () => {
    await rolledBack(sql, async (tx) => {
      await tx.unsafe(`create table public.zz_probe (id int); create sequence public.zz_seq;
        create function public.zz_fn() returns int language sql as 'select 1'`);
      for (const role of ROLES) {
        for (const priv of PRIVILEGES) {
          const [row] = await tx`select has_table_privilege(${role}, 'public.zz_probe', ${priv}) as ok`;
          expect(row?.ok, `${role} ${priv}`).toBe(false);
        }
        const [s] = await tx`select has_sequence_privilege(${role}, 'public.zz_seq', 'USAGE') as ok`;
        const [f] = await tx`select has_function_privilege(${role}, 'public.zz_fn()', 'EXECUTE') as ok`;
        expect(s?.ok, `${role} sequence`).toBe(false);
        expect(f?.ok, `${role} function`).toBe(false);
      }
    });
  });

  it("has the new enum values", async () => {
    const [row] = await sql`select enum_range(null::publish_status)::text[] as p, enum_range(null::order_status)::text[] as o`;
    expect(row?.p).toContain("archived");
    expect(row?.o).toEqual(expect.arrayContaining(["processing", "shipped", "delivered", "returned"]));
  });
});
