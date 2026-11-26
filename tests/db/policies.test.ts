import { afterAll, describe, expect, it } from "vitest";
import { insert, product, short, variant } from "./factory";
import { becomeRole, connect, failureOf, rolledBack, type Tx } from "./helpers";
import { person } from "./people";

const sql = connect();
afterAll(() => sql.end());

type People = { a: Awaited<ReturnType<typeof person>>; b: Awaited<ReturnType<typeof person>> };

const asA = (work: (tx: Tx, p: People) => Promise<void>) =>
  rolledBack(sql, async (tx) => {
    const people = { a: await person(tx), b: await person(tx) };
    await becomeRole(tx, "authenticated", people.a.authUserId);
    await work(tx, people);
  });

const DENIED = "42501"; // permission denied, or a row-level security refusal

describe("a signed-in customer", () => {
  it.each([
    ["customers", "customer"], ["addresses", "address"], ["wishlists", "wishlist"], ["orders", "order"],
    ["order_items", "item"], ["order_addresses", "orderAddress"], ["payments", "payment"], ["order_status_history", "history"],
  ] as const)("sees only their own %s", async (table, key) => {
    await asA(async (tx, { a }) => {
      const rows = await tx`select id from ${tx(`public.${table}`)}`;
      expect(rows.map((r) => r.id)).toEqual([a[key].id]);
    });
  });

  it("can update their name and phone only", async () => {
    await asA(async (tx, { a, b }) => {
      expect((await tx`update customers set full_name = 'New', phone = '1' where id = ${a.customer.id}`).count).toBe(1);
      expect((await tx`update customers set full_name = 'Hacked' where id = ${b.customer.id}`).count).toBe(0);
      for (const column of ["email", "auth_user_id"]) {
        expect(await failureOf(tx, (s) => s.unsafe(`update customers set ${column} = ${column}`)), column).toContain(DENIED);
      }
    });
  });

  it("manages only their own addresses", async () => {
    await asA(async (tx, { a, b }) => {
      const mine = { customer_id: a.customer.id, full_name: "A", line1: "2", city: "Karachi" };
      await insert(tx, "addresses", mine);
      expect(await failureOf(tx, (s) => insert(s, "addresses", { ...mine, customer_id: b.customer.id }))).toContain(DENIED);
      expect((await tx`update addresses set city = 'X' where id = ${b.address.id}`).count).toBe(0);
      expect((await tx`delete from addresses where id = ${b.address.id}`).count).toBe(0);
      expect(await failureOf(tx, (s) => s`update addresses set customer_id = ${b.customer.id} where id = ${a.address.id}`)).toContain(DENIED);
    });
  });

  it("manages only their own wishlist items", async () => {
    await rolledBack(sql, async (tx) => {
      const [a, b] = [await person(tx), await person(tx)];
      const p = await product(tx);
      const theirs = await insert(tx, "wishlist_items", { wishlist_id: b.wishlist.id, product_id: p.id });
      await becomeRole(tx, "authenticated", a.authUserId);
      await insert(tx, "wishlist_items", { wishlist_id: a.wishlist.id, product_id: p.id });
      expect(await tx`select wishlist_id from wishlist_items`).toEqual([{ wishlist_id: a.wishlist.id }]);
      expect((await tx`delete from wishlist_items where id = ${theirs.id}`).count).toBe(0);
      expect(await failureOf(tx, (s) => insert(s, "wishlist_items", { wishlist_id: b.wishlist.id, product_id: p.id }))).toContain(DENIED);
    });
  });

  it.each([
    "update orders set status = 'delivered'", "update orders set total_amount = 0",
    "update payments set status = 'verified'", "delete from orders",
    "insert into order_status_history (order_id, kind, to_status) select id, 'order', 'delivered' from orders",
    "update order_items set unit_price_amount = 0",
    "select idempotency_key from orders", "select receipt_path from payments", "select verified_by from payments",
    "select note from order_status_history", "select staff_id from order_status_history",
    "select inventory_quantity from product_variants", "select reorder_level from product_variants",
  ])("may not run: %s", async (statement) => {
    await asA(async (tx) => {
      expect(await failureOf(tx, (s) => s.unsafe(statement))).toContain(DENIED);
    });
  });
});

describe("the public catalog", () => {
  it.each(["anon", "authenticated"] as const)("hides unpublished products and everything linked to them from %s", async (role) => {
    await rolledBack(sql, async (tx) => {
      const category = await insert(tx, "categories", { slug: `pc-${short()}`, name: "C" });
      const collection = await insert(tx, "collections", { slug: `pl-${short()}`, name: "L", status: "published" });
      const ids: Record<string, string> = {};
      for (const status of ["published", "draft", "archived"]) {
        const p = await product(tx, { status });
        ids[p.id] = status;
        await variant(tx, p.id);
        await insert(tx, "product_images", { product_id: p.id, url: "/x.jpg" });
        await insert(tx, "category_products", { category_id: category.id, product_id: p.id });
        await insert(tx, "collection_products", { collection_id: collection.id, product_id: p.id });
      }
      const live = Object.keys(ids).find((id) => ids[id] === "published");
      const inactive = await variant(tx, live!, { is_active: false });
      await becomeRole(tx, role, role === "anon" ? null : "00000000-0000-4000-8000-000000000000");
      const all = Object.keys(ids);
      expect((await tx`select id from products where id = any(${all}::uuid[])`).map((r) => r.id)).toEqual([live]);
      for (const table of ["product_variants", "product_images", "category_products", "collection_products"]) {
        const rows = await tx`select distinct product_id from ${tx(table)} where product_id = any(${all}::uuid[])`;
        expect(rows.map((r) => r.product_id), table).toEqual([live]);
      }
      expect(await tx`select id from product_variants where id = ${inactive.id}`).toHaveLength(0);
    });
  });

  it("hides unpublished categories, collections and banners, and banners outside their dates", async () => {
    await rolledBack(sql, async (tx) => {
      const draftCategory = await insert(tx, "categories", { slug: `d-${short()}`, name: "D", status: "draft" });
      const draftCollection = await insert(tx, "collections", { slug: `d-${short()}`, name: "D" });
      const banner = (over: object) => insert(tx, "banners", { key: `b-${short()}`, placement: "hero", status: "published", ...over });
      const hidden = [await banner({ status: "draft" }), await banner({ starts_at: "2999-01-01" }), await banner({ ends_at: "2000-01-01" })];
      const shown = await banner({ starts_at: "2000-01-01", ends_at: "2999-01-01" });
      await becomeRole(tx, "anon", null);
      expect(await tx`select 1 from categories where id = ${draftCategory.id}`).toHaveLength(0);
      expect(await tx`select 1 from collections where id = ${draftCollection.id}`).toHaveLength(0);
      const ids = [...hidden, shown].map((b) => b.id);
      expect((await tx`select id from banners where id = any(${ids}::uuid[])`).map((r) => r.id)).toEqual([shown.id]);
    });
  });
});

describe("private tables", () => {
  const tables = ["settings", "staff_users", "roles", "discounts", "coupon_usages", "payment_accounts", "shipping_zones",
    "contact_messages", "newsletter_subscribers", "inventory_movements", "carts", "refunds"];
  it.each(["anon", "authenticated"] as const)("are closed to %s", async (role) => {
    await rolledBack(sql, async (tx) => {
      await becomeRole(tx, role, null);
      for (const table of tables) {
        expect(await failureOf(tx, (s) => s.unsafe(`select 1 from public.${table}`)), table).toContain(DENIED);
      }
    });
  });

  it("keep customer data closed to anonymous visitors", async () => {
    await rolledBack(sql, async (tx) => {
      await becomeRole(tx, "anon", null);
      for (const table of ["customers", "addresses", "wishlists", "wishlist_items", "orders", "order_items", "order_addresses", "payments", "order_status_history"]) {
        expect(await failureOf(tx, (s) => s.unsafe(`select 1 from public.${table}`)), table).toContain(DENIED);
      }
    });
  });
});
