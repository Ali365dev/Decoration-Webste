import { afterAll, describe, expect, it } from "vitest";
import { customer, insert, order, orderValues, product, variant } from "./factory";
import { connect, failureOf, rolledBack, type Tx } from "./helpers";

const sql = connect();
afterAll(() => sql.end());

const adjust = (tx: Tx, id: string, delta: number, type = "adjustment", orderId: string | null = null) =>
  tx`select public.adjust_stock(${id}, ${delta}, ${type}, 'test', ${orderId}) as quantity`;
const movements = (tx: Tx, id: string) => tx`select delta, resulting_quantity from inventory_movements where variant_id = ${id}`;
const stockOf = async (tx: Tx, id: string) => (await tx`select inventory_quantity as q from product_variants where id = ${id}`)[0]!.q;

async function stocked(tx: Tx, quantity: number) {
  const p = await product(tx);
  return variant(tx, p.id, { inventory_quantity: quantity });
}

describe("adjust_stock", () => {
  it("changes stock and records one movement", async () => {
    await rolledBack(sql, async (tx) => {
      const v = await stocked(tx, 0);
      expect((await adjust(tx, v.id, 5, "restock"))[0]!.quantity).toBe(5);
      expect(await movements(tx, v.id)).toEqual([{ delta: 5, resulting_quantity: 5 }]);
    });
  });

  it("refuses to go below zero and records nothing", async () => {
    await rolledBack(sql, async (tx) => {
      const v = await stocked(tx, 0);
      expect(await failureOf(tx, (s) => adjust(s, v.id, -1, "sale"))).toContain("insufficient_stock");
      expect(await movements(tx, v.id)).toHaveLength(0);
      expect(await stockOf(tx, v.id)).toBe(0);
    });
  });

  it("names a missing variant", async () => {
    await rolledBack(sql, async (tx) => {
      expect(await failureOf(tx, (s) => adjust(s, "00000000-0000-4000-8000-000000000000", 1))).toContain("variant_not_found");
    });
  });

  it("returns an order's stock only once", async () => {
    await rolledBack(sql, async (tx) => {
      const v = await stocked(tx, 0);
      const o = await order(tx, (await customer(tx)).id);
      await adjust(tx, v.id, 1, "return", o.id);
      expect(await failureOf(tx, (s) => adjust(s, v.id, 1, "return", o.id))).toContain("inventory_movements_order_uq");
      expect(await stockOf(tx, v.id)).toBe(1);
    });
  });

  it("sells the last unit to only one of two simultaneous buyers", async () => {
    const pool = connect(undefined, 2);
    const created = await sql.begin((tx) => stocked(tx, 1));
    try {
      const buy = () => pool.begin(async (tx) => {
        await adjust(tx, created.id, -1, "sale");
        await tx`select pg_sleep(0.3)`;
      });
      const results = await Promise.allSettled([buy(), buy()]);
      expect(results.map((r) => r.status).sort()).toEqual(["fulfilled", "rejected"]);
      const failed = results.find((r) => r.status === "rejected") as PromiseRejectedResult;
      expect(String(failed.reason.message)).toContain("insufficient_stock");
      const [row] = await sql`select inventory_quantity as q from product_variants where id = ${created.id}`;
      expect(row!.q).toBe(0);
    } finally {
      // local test data only
      await sql`delete from inventory_movements where variant_id = ${created.id}`;
      await sql`delete from products where id = ${created.product_id}`;
      await pool.end();
    }
  });

  it("cannot be run by public API roles", async () => {
    for (const role of ["anon", "authenticated"]) {
      const [row] = await sql`select has_function_privilege(${role}, 'public.adjust_stock(uuid,integer,text,text,uuid,uuid)', 'EXECUTE') as ok`;
      expect(row!.ok, role).toBe(false);
    }
  });
});

describe("order numbers", () => {
  it("start at 10001 and count up", async () => {
    const [seq] = await sql`select start_value::int as start from pg_sequences where schemaname = 'public' and sequencename = 'order_number_seq'`;
    expect(seq!.start).toBe(10001);
    await rolledBack(sql, async (tx) => {
      const make = async () => {
        const { number: _ignored, ...values } = orderValues(null);
        return (await insert(tx, "orders", values)).number as string;
      };
      const [a, b] = [await make(), await make()];
      expect(a).toMatch(/^DW-\d{5,}$/);
      expect(Number(b.slice(3))).toBe(Number(a.slice(3)) + 1);
    });
  });
});

describe("product price copy", () => {
  const priceOf = async (tx: Tx, id: string) => (await tx`select price_amount as price, compare_at_amount as compare from products where id = ${id}`)[0];

  it("follows the lowest-priced active variant", async () => {
    await rolledBack(sql, async (tx) => {
      const p = await product(tx, { price_amount: 999 });
      const dear = await variant(tx, p.id, { price_amount: 500, compare_at_amount: 600 });
      expect(await priceOf(tx, p.id)).toEqual({ price: "500.00", compare: "600.00" });
      const cheap = await variant(tx, p.id, { price_amount: 300 });
      expect(await priceOf(tx, p.id)).toEqual({ price: "300.00", compare: null });
      await tx`update product_variants set is_active = false where id = ${cheap.id}`;
      expect(await priceOf(tx, p.id)).toEqual({ price: "500.00", compare: "600.00" });
      await tx`update product_variants set is_active = false where id = ${dear.id}`;
      expect(await priceOf(tx, p.id)).toEqual({ price: "500.00", compare: "600.00" });
    });
  });
});

describe("updated_at", () => {
  it("advances when a row changes", async () => {
    await rolledBack(sql, async (tx) => {
      const p = await product(tx, { updated_at: "2000-01-01T00:00:00Z" });
      await tx`update products set name = 'Renamed' where id = ${p.id}`;
      const [row] = await tx`select updated_at > '2001-01-01' as moved from products where id = ${p.id}`;
      expect(row!.moved).toBe(true);
    });
  });
});

describe("current_customer_id", () => {
  it("is a locked-down definer function that only signed-in users may call", async () => {
    const [fn] = await sql`select prosecdef, provolatile, proconfig from pg_proc where oid = to_regprocedure('public.current_customer_id()')`;
    expect(fn).toEqual({ prosecdef: true, provolatile: "s", proconfig: ['search_path=""'] });
    const [row] = await sql`select has_function_privilege('anon', 'public.current_customer_id()', 'EXECUTE') as anon,
      has_function_privilege('authenticated', 'public.current_customer_id()', 'EXECUTE') as authed`;
    expect(row).toEqual({ anon: false, authed: true });
  });
});
