import { afterAll, describe, expect, it } from "vitest";
import { customer, insert, order, orderValues, product, short, variant } from "./factory";
import { connect, failureOf, rolledBack, type Tx } from "./helpers";

const sql = connect();
afterAll(() => sql.end());

// Each case builds valid rows, then returns the one statement the database must refuse.
// `names` is the constraint (or message) expected in the refusal.
type Case = [string, string, (tx: Tx) => Promise<(sp: Tx) => Promise<unknown>>];

const withProduct = async (tx: Tx) => product(tx);
const withOrder = async (tx: Tx) => order(tx, (await customer(tx)).id);
const payment = (orderId: string, over = {}) => ({ order_id: orderId, method: "cod", amount: 300, ...over });
const address = (customerId: string) => ({ customer_id: customerId, full_name: "A", line1: "1", city: "Lahore", is_default: true });
const coupon = (over = {}) => ({ code: `C-${short()}`, type: "fixed", value: 10, ...over });

const CASES: Case[] = [
  ["a zero variant price", "product_variants_price_check", async (tx) => { const p = await withProduct(tx); return (s) => variant(s, p.id, { price_amount: 0 }); }],
  ["negative stock", "product_variants_stock_check", async (tx) => { const p = await withProduct(tx); return (s) => variant(s, p.id, { inventory_quantity: -1 }); }],
  ["a compare-at price below the price", "product_variants_compare_check", async (tx) => { const p = await withProduct(tx); return (s) => variant(s, p.id, { compare_at_amount: 100 }); }],
  ["product status scheduled", "products_status_check", async () => (s) => product(s, { status: "scheduled" })],
  ["collection status archived", "collections_status_check", async () => (s) => insert(s, "collections", { slug: `c-${short()}`, name: "C", status: "archived" })],
  ["a malformed slug", "products_slug_check", async () => (s) => product(s, { slug: "Bad Slug" })],
  ["a SKU differing only by case", "product_variants_sku_lower_uq", async (tx) => { const p = await withProduct(tx); await variant(tx, p.id, { sku: "ABC-1x" }); return (s) => variant(s, p.id, { sku: "abc-1X" }); }],
  ["a second default variant", "product_variants_one_default_uq", async (tx) => { const p = await withProduct(tx); await variant(tx, p.id, { is_default: true }); return (s) => variant(s, p.id, { is_default: true }); }],
  ["a second primary image", "product_images_one_primary_uq", async (tx) => { const p = await withProduct(tx); const row = { product_id: p.id, url: "/a.jpg", is_primary: true }; await insert(tx, "product_images", row); return (s) => insert(s, "product_images", row); }],
  ["a second hover image", "product_images_one_hover_uq", async (tx) => { const p = await withProduct(tx); const row = { product_id: p.id, url: "/a.jpg", is_hover: true }; await insert(tx, "product_images", row); return (s) => insert(s, "product_images", row); }],
  ["a category that is its own parent", "category_cycle", async (tx) => { const c = await insert(tx, "categories", { slug: `a-${short()}`, name: "A" }); return (s) => s`update categories set parent_id = ${c.id} where id = ${c.id}`; }],
  ["a two-level category cycle", "category_cycle", async (tx) => { const a = await insert(tx, "categories", { slug: `a-${short()}`, name: "A" }); const b = await insert(tx, "categories", { slug: `b-${short()}`, name: "B", parent_id: a.id }); return (s) => s`update categories set parent_id = ${b.id} where id = ${a.id}`; }],
  ["order status paid", "orders_status_check", async () => (s) => order(s, null, { status: "paid" })],
  ["a total that does not add up", "orders_total_check", async () => (s) => order(s, null, { total_amount: 301 })],
  ["an uppercase email", "orders_email_check", async () => (s) => order(s, null, { email: "Buyer@Example.test" })],
  ["a second payment", "payments_order_uq", async (tx) => { const o = await withOrder(tx); await insert(tx, "payments", payment(o.id)); return (s) => insert(s, "payments", payment(o.id)); }],
  ["a second address", "order_addresses_order_uq", async (tx) => { const o = await withOrder(tx); const row = { order_id: o.id, full_name: "A", line1: "1", city: "Lahore", country: "PK" }; await insert(tx, "order_addresses", row); return (s) => insert(s, "order_addresses", row); }],
  ["a repeated idempotency key", "orders_idempotency_uq", async (tx) => { const first = orderValues(null); await insert(tx, "orders", first); return (s) => insert(s, "orders", orderValues(null, { idempotency_key: first.idempotency_key })); }],
  ["payment method sadapay", "payments_method_check", async (tx) => { const o = await withOrder(tx); return (s) => insert(s, "payments", payment(o.id, { method: "sadapay" })); }],
  ["a zero quantity", "order_items_quantity_check", async (tx) => { const o = await withOrder(tx); return (s) => insert(s, "order_items", { order_id: o.id, title: "T", variant_title: "V", sku: "S", quantity: 0, unit_price_amount: 1 }); }],
  ["a 101 percent coupon", "discounts_percentage_check", async () => (s) => insert(s, "discounts", coupon({ type: "percentage", value: 101 }))],
  ["a coupon code differing only by case", "discounts_code_lower_uq", async (tx) => { await insert(tx, "discounts", coupon({ code: "Save10" })); return (s) => insert(s, "discounts", coupon({ code: "SAVE10" })); }],
  ["a second default address", "addresses_one_default_uq", async (tx) => { const c = await customer(tx); await insert(tx, "addresses", address(c.id)); return (s) => insert(s, "addresses", address(c.id)); }],
  ["a second wishlist", "wishlists_customer_uq", async (tx) => { const c = await customer(tx); await insert(tx, "wishlists", { customer_id: c.id }); return (s) => insert(s, "wishlists", { customer_id: c.id }); }],
  ["a zero stock movement", "inventory_movements_delta_check", async (tx) => { const p = await withProduct(tx); const v = await variant(tx, p.id); return (s) => insert(s, "inventory_movements", { variant_id: v.id, delta: 0, type: "adjustment", reason: "r", resulting_quantity: 5 }); }],
  ["returning the same order stock twice", "inventory_movements_order_uq", async (tx) => { const p = await withProduct(tx); const v = await variant(tx, p.id); const o = await withOrder(tx); const row = { variant_id: v.id, order_id: o.id, delta: 1, type: "return", reason: "r", resulting_quantity: 6 }; await insert(tx, "inventory_movements", row); return (s) => insert(s, "inventory_movements", row); }],
];

describe("database rules", () => {
  it.each(CASES)("refuses %s", async (_label, names, setup) => {
    await rolledBack(sql, async (tx) => {
      const refused = await setup(tx);
      expect(await failureOf(tx, refused)).toContain(names);
    });
  });

  it("indexes every foreign key", async () => {
    const missing = await sql`
      select c.conrelid::regclass::text || '.' || a.attname as fk
      from pg_constraint c join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
      where c.contype = 'f' and c.connamespace = 'public'::regnamespace
        and not exists (select 1 from pg_index i where i.indrelid = c.conrelid and i.indkey[0] = c.conkey[1] and i.indpred is null)
      order by 1`;
    expect(missing.map((m) => m.fk)).toEqual([]);
  });

  it("has the new foreign keys", async () => {
    const rows = await sql`select conname from pg_constraint where contype = 'f' and connamespace = 'public'::regnamespace`;
    expect(rows.map((r) => r.conname)).toEqual(expect.arrayContaining([
      "categories_parent_fk", "customers_auth_user_fk", "inventory_movements_order_fk", "orders_coupon_fk",
      "order_items_product_fk", "payments_verified_by_fk", "order_status_history_order_fk", "coupon_usages_order_fk",
    ]));
  });
});
