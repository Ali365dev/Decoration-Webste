// Read-only checks. Safe to point at any database: everything runs in a READ ONLY transaction
// and only counts and hashes are returned, never row contents.
import { createRequire } from "node:module";

const postgres = createRequire(new URL("../../packages/db/package.json", import.meta.url))("postgres");

export async function readOnly(url, work) {
  const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 20, onnotice: () => {} });
  try {
    return await sql.begin("read only", work);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

/** The connection string comes only from DB_URL, so no env file can pick the target by accident. */
export function targetUrl() {
  const url = process.env.DB_URL;
  if (!url) {
    console.error("Set DB_URL to the database you want to check.");
    process.exit(2);
  }
  console.error(`Checking database on host: ${new URL(url).hostname}`);
  return url;
}

const duplicates = (table, expression, where = "true") =>
  `select count(*) from (select 1 from public.${table} where ${where} group by ${expression} having count(*) > 1) d`;
const rows = (table, where = "true") => `select count(*) from public.${table} where ${where}`;
const SLUG = "'^[a-z0-9]+(-[a-z0-9]+)*$'";

// Every rule in migrations 000300 and 000500 that existing data could break.
const RULES = [
  ...["orders", "order_items", "payments", "inventory_movements", "banners"].map((t) => [`${t} must be empty`, rows(t)]),
  ["product prices not negative", rows("products", "price_amount < 0")],
  ["no product is 'scheduled'", rows("products", "status::text = 'scheduled'")],
  ["product slugs well formed", rows("products", `slug !~ ${SLUG}`)],
  ["category slugs well formed", rows("categories", `slug !~ ${SLUG}`)],
  ["collection slugs well formed", rows("collections", `slug !~ ${SLUG}`)],
  ["collections draft or published", rows("collections", "status::text not in ('draft','published')")],
  ["category parents exist", rows("categories c", "c.parent_id is not null and not exists (select 1 from public.categories x where x.id = c.parent_id)")],
  ["no category cycles", `with recursive up(start, id, depth) as (
      select id, parent_id, 1 from public.categories where parent_id is not null
      union all select up.start, c.parent_id, up.depth + 1 from up join public.categories c on c.id = up.id where c.parent_id is not null and up.depth < 50)
    select count(distinct start) from up where id = start`],
  ["variant prices above zero", rows("product_variants", "price_amount <= 0")],
  ["stock not negative", rows("product_variants", "inventory_quantity < 0")],
  ["SKUs unique ignoring case", duplicates("product_variants", "lower(sku)")],
  ["one default variant per product", duplicates("product_variants", "product_id", "is_default")],
  ["one primary image per product", duplicates("product_images", "product_id", "is_primary")],
  ["one hover image per product", duplicates("product_images", "product_id", "is_hover")],
  ["customer emails lowercase", rows("customers", "email <> lower(btrim(email))")],
  ["staff emails lowercase", rows("staff_users", "email <> lower(btrim(email))")],
  ["customer sign-ins exist", rows("customers c", "c.auth_user_id is not null and not exists (select 1 from auth.users u where u.id = c.auth_user_id)")],
  ["one default address per customer", duplicates("addresses", "customer_id", "is_default")],
  ["one wishlist per customer", duplicates("wishlists", "customer_id")],
  ["cart quantities above zero", rows("cart_items", "quantity <= 0")],
  ["one address per order", duplicates("order_addresses", "order_id")],
  ["refunds above zero", rows("refunds", "amount <= 0")],
  ["coupons valid", rows("discounts", "type not in ('percentage','fixed') or value <= 0 or (type = 'percentage' and value > 100) or is_active not in (0,1)")],
  ["coupon codes unique ignoring case", duplicates("discounts", "lower(code)")],
];

export async function runPreflight(tx) {
  const results = [];
  for (const [rule, query] of RULES) {
    const [row] = await tx.unsafe(query);
    results.push({ rule, violations: Number(row.count) });
  }
  return results;
}

export async function takeSnapshot(tx) {
  const tables = await tx`select tablename from pg_tables where schemaname = 'public' order by 1`;
  const counts = {};
  for (const { tablename } of tables) {
    const [row] = await tx.unsafe(`select count(*) from public."${tablename}"`);
    counts[tablename] = Number(row.count);
  }
  const [slugs] = await tx`select md5(coalesce(string_agg(slug, ',' order by slug collate "C"), '')) as h from products`;
  const [urls] = await tx`select md5(coalesce(string_agg(url, ',' order by url collate "C"), '')) as h from product_images`;
  return { counts, productSlugs: slugs.h, imageUrls: urls.h };
}
