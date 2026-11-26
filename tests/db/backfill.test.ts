import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { categoryTiles } from "../../packages/domain/src/cms";
import { connect, rolledBack } from "./helpers";

const sql = connect();
afterAll(() => sql.end());

const variantsOf = (slug: string) => sql`
  select v.title, v.sku, v.price_amount, v.compare_at_amount, v.inventory_quantity, v.is_active
  from product_variants v join products p on p.id = v.product_id
  where p.slug = ${slug} order by v.is_active, v.sort_order`;

const size = (title: string, sku: string, price: string, compare: string | null = null) =>
  ({ title, sku, price_amount: price, compare_at_amount: compare, inventory_quantity: 0, is_active: true });

describe("starting data", () => {
  it("copies each compare-at price onto the product's original variant", async () => {
    const rows = await sql`
      select p.slug, p.compare_at_amount as product, v.compare_at_amount as variant, v.price_amount
      from products p join product_variants v on v.product_id = p.id and v.sku = p.slug || '-default'
      where p.compare_at_amount is not null`;
    expect(rows).toHaveLength(2);
    for (const r of rows) {
      expect(r.variant, r.slug).toBe(Number(r.product) > Number(r.price_amount) ? r.product : null);
    }
  });

  it("turns the hardcoded Khaise sizes into variants", async () => {
    const [product] = await sql`select price_amount from products where slug = 'khaise'`;
    const rows = await variantsOf("khaise");
    expect(rows.filter((r) => r.is_active)).toEqual([
      size("SINGLE (60X90 IN.)", "FKH-137-KHAISE-SINGLE (60X90 IN.)", product!.price_amount),
      size("DOUBLE (90X95 IN.)", "FKH-137-KHAISE-DOUBLE (90X95 IN.)", "18000.00"),
    ]);
    expect(rows.filter((r) => !r.is_active).map((r) => r.title)).toEqual(["Default"]);
  });

  it.each([
    ["silk-plain-bed-sheet-set", "KING (100X100 IN.)", "FPBS-199-SILK PLAIN BED SHEET SET-KING (100X100 IN.)"],
    ["capp-169-qf-rp", "King", "CAPP-169-QF-RP-Bed In a Bag-King"],
  ])("gives %s its one hardcoded size", async (slug, title, sku) => {
    const [product] = await sql`select price_amount from products where slug = ${slug}`;
    const active = (await variantsOf(slug)).filter((r) => r.is_active);
    expect(active).toEqual([size(title, sku, product!.price_amount)]);
  });

  it("adds exactly four variants", async () => {
    const [row] = await sql`select count(*)::int as n from product_variants`;
    expect(row!.n).toBe(113);
  });

  it("copies the three hardcoded colours", async () => {
    const rows = await sql`select slug, color from products where color is not null order by slug`;
    expect(rows).toEqual([
      { slug: "capp-169-qf-rp", color: "GREY" },
      { slug: "khaise", color: "O-WHITE" },
      { slug: "silk-plain-bed-sheet-set", color: "PEACH" },
    ]);
  });

  it("imports the three hero slides as the code has them", async () => {
    const rows = await sql`select image_url, eyebrow, title, href, cta_label, status::text from banners where placement = 'hero' order by sort_order`;
    const code = readFileSync("apps/storefront/components/cms/cms-block-renderer.tsx", "utf8");
    expect(rows.map((r) => r.title)).toEqual(["Wall Art", "Bedding", "Home Decor"]);
    for (const r of rows) {
      for (const value of [r.image_url, r.eyebrow, r.title, r.href, r.cta_label]) expect(code).toContain(`"${value}"`);
      expect(r.status).toBe("published");
    }
  });

  it("imports the six category tiles as the code has them", async () => {
    const rows = await sql`select title, href, image_url, badge, cta_label, status::text from banners where placement = 'category_tile' order by sort_order`;
    // The canvas tile takes its product's stored image, which the import moved to Cloudinary.
    const [canvas] = await sql`
      select i.url from product_images i join products p on p.id = i.product_id
      where p.slug = 'makkah-madinah-scenic-frame-set' and i.is_primary`;
    expect(rows).toEqual(categoryTiles.map((t) => ({
      title: t.label, href: t.href,
      image_url: t.label === "Canvas & Wall Art" ? (canvas?.url ?? "/home/cat-4.jpg") : t.image,
      badge: t.badge ?? null, cta_label: t.ctaLabel ?? null, status: "published",
    })));
  });

  it("creates the delivery zone, settings and the single admin role", async () => {
    const zones = await sql`select id, name, delivery_charge, estimated_days from shipping_zones`;
    expect(zones).toEqual([{ id: expect.any(String), name: "Standard delivery", delivery_charge: "200.00", estimated_days: 5 }]);
    const settings = Object.fromEntries((await sql`select key, value from settings`).map((r) => [r.key, r.value]));
    expect(settings).toEqual({
      shipping: { defaultZoneId: zones[0]!.id, freeDeliveryThreshold: 5000 },
      payments: { codEnabled: true },
    });
    expect((await sql`select key::text from roles`).map((r) => r.key)).toEqual(["super_admin"]);
  });

  it("creates no payment accounts", async () => {
    expect(await sql`select 1 from payment_accounts`).toHaveLength(0);
  });

  it("changes no row count when run twice", async () => {
    const file = readFileSync("supabase/migrations/20261127000400_backfill.sql", "utf8");
    await rolledBack(sql, async (tx) => {
      const count = () => tx`select (select count(*) from product_variants) v, (select count(*) from banners) b,
        (select count(*) from shipping_zones) z, (select count(*) from settings) s, (select count(*) from roles) r`;
      const before = await count();
      await tx.unsafe(file);
      expect(await count()).toEqual(before);
    });
  });
});
