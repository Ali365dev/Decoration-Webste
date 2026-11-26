import { afterAll, describe, expect, it } from "vitest";
import { connect } from "./helpers";

const sql = connect();
afterAll(() => sql.end());

// column: [type, nullable, has default]  (DATABASE_ARCHITECTURE.md sections 4 to 9)
type Spec = [string, boolean, boolean];
const req = (t: string): Spec => [t, false, false];
const opt = (t: string): Spec => [t, true, false];
const def = (t: string): Spec => [t, false, true];
const stamps = { created_at: def("timestamptz"), updated_at: def("timestamptz") };

const EXPECTED: Record<string, Record<string, Spec>> = {
  products: { material: opt("text"), color: opt("text"), ...stamps },
  product_variants: { compare_at_amount: opt("numeric"), reorder_level: def("int4"), is_active: def("bool"), sort_order: def("int4"), ...stamps },
  product_images: { storage_path: opt("text"), ...stamps },
  categories: { status: def("publish_status"), image_url: opt("text"), image_storage_path: opt("text"), ...stamps },
  collections: { ...stamps },
  category_products: { ...stamps },
  collection_products: { ...stamps },
  inventory_movements: { location_id: opt("uuid"), type: req("text"), resulting_quantity: req("int4"), order_id: opt("uuid"), staff_id: opt("uuid"), ...stamps },
  customers: { ...stamps },
  addresses: { area: opt("text"), ...stamps },
  wishlists: { ...stamps },
  wishlist_items: { ...stamps },
  staff_users: { ...stamps },
  roles: { ...stamps },
  orders: { contact_name: req("text"), contact_phone: req("text"), whatsapp: opt("text"), discount_amount: def("numeric"), coupon_id: opt("uuid"), coupon_code: opt("text"), shipping_zone_name: opt("text"), estimated_days: opt("int4"), idempotency_key: req("text"), ...stamps },
  order_items: { product_id: opt("uuid"), variant_title: req("text"), sku: req("text"), image_url: opt("text"), ...stamps },
  order_addresses: { type: def("text"), area: opt("text"), instructions: opt("text"), ...stamps },
  payments: { provider: def("text"), status: def("text"), method: req("text"), receipt_path: opt("text"), account_snapshot: opt("jsonb"), verified_by: opt("uuid"), verified_at: opt("timestamptz"), ...stamps },
  refunds: { staff_id: opt("uuid"), ...stamps },
  discounts: { min_order_amount: def("numeric"), usage_limit: opt("int4"), per_customer_limit: opt("int4"), ...stamps },
  banners: { placement: req("text"), eyebrow: opt("text"), cta_label: opt("text"), badge: opt("text"), sort_order: def("int4"), image_storage_path: opt("text"), ...stamps },
  settings: { ...stamps },
  order_status_history: { id: def("uuid"), order_id: req("uuid"), kind: req("text"), from_status: opt("text"), to_status: req("text"), staff_id: opt("uuid"), note: opt("text"), ...stamps },
  coupon_usages: { id: def("uuid"), coupon_id: req("uuid"), order_id: req("uuid"), customer_id: req("uuid"), discount_amount: req("numeric"), released_at: opt("timestamptz"), ...stamps },
  shipping_zones: { id: def("uuid"), name: req("text"), delivery_charge: req("numeric"), estimated_days: req("int4"), is_active: def("bool"), ...stamps },
  payment_accounts: { id: def("uuid"), kind: req("text"), provider: req("text"), account_title: req("text"), account_number: req("text"), iban: opt("text"), is_active: def("bool"), ...stamps },
  contact_messages: { id: def("uuid"), name: req("text"), email: req("text"), subject: opt("text"), message: req("text"), status: def("text"), ...stamps },
  newsletter_subscribers: { id: def("uuid"), email: req("text"), source: req("text"), ...stamps },
};

describe("columns and tables", () => {
  it.each(Object.keys(EXPECTED))("%s has the specified columns", async (table) => {
    const rows = await sql`select column_name, udt_name, is_nullable, column_default from information_schema.columns where table_schema = 'public' and table_name = ${table}`;
    const actual = Object.fromEntries(rows.map((r) => [r.column_name, [r.udt_name, r.is_nullable === "YES", r.column_default !== null]]));
    for (const [column, spec] of Object.entries(EXPECTED[table]!)) {
      expect(actual[column], `${table}.${column}`).toEqual(spec);
    }
  });

  it("has 46 tables and no brands table", async () => {
    const rows = await sql`select tablename from pg_tables where schemaname = 'public'`;
    expect(rows).toHaveLength(46);
    expect(rows.map((r) => r.tablename)).not.toContain("brands");
  });
});
