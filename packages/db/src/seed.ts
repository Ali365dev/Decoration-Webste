/**
 * Idempotent seed: loads categories, collections, and products from the domain
 * seed data into the database. Run AFTER upload-images.ts so Cloudinary URLs
 * are used instead of local paths.
 *
 *   npm run upload-images --workspace=packages/db  # once
 *   npm run db:seed --workspace=packages/db
 *
 * Safe to run twice — uses upsert (on conflict do nothing).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { homeProducts } from "../../domain/src/seed/products";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { mainNav } from "../../domain/src/cms/navigation";
import { createDb } from "./client";
import {
  categories,
  collections,
  products,
  productImages,
  collectionProducts,
  categoryProducts,
  productVariants,
} from "./schema";

const db = createDb();

// Load Cloudinary URL map if it exists (produced by upload-images.ts)
const URL_MAP_PATH = path.join(__dirname, "cloudinary-url-map.json");
const urlMap: Record<string, string> = fs.existsSync(URL_MAP_PATH)
  ? JSON.parse(fs.readFileSync(URL_MAP_PATH, "utf-8"))
  : {};

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  return urlMap[url] ?? url;
}

// ── helpers ────────────────────────────────────────────────────────────────

function categoriesFromNav() {
  const result = new Map<string, { slug: string; name: string; parentId: string | null }>();
  const walk = (items: typeof mainNav, parentSlug: string | null) => {
    for (const item of items) {
      if (item.id === "home") continue;
      if (!result.has(item.id)) {
        result.set(item.id, { slug: item.id, name: item.label, parentId: parentSlug });
      }
      walk(item.children, item.id);
    }
  };
  walk(mainNav, null);
  return [...result.values()];
}

function collectionsFromNav() {
  const result = new Map<string, { slug: string; name: string; description: string }>();
  const walk = (items: typeof mainNav) => {
    for (const item of items) {
      const slug = item.href.match(/^\/collections\/([^/]+)$/)?.[1];
      if (slug && !result.has(slug)) {
        result.set(slug, {
          slug,
          name: item.label,
          description: `Shop ${item.label} at Dec Walls.`,
        });
      }
      walk(item.children);
    }
  };
  walk(mainNav);
  for (const [slug, name] of [["bath","Bath"],["dining","Dining"],["living","Living"],["coverlets","Coverlets"]]) {
    if (!result.has(slug)) result.set(slug, { slug, name, description: `Shop ${name} at Dec Walls.` });
  }
  return [...result.values()];
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  const mapSize = Object.keys(urlMap).length;
  console.log(`🌱 Seeding database… (Cloudinary URL map: ${mapSize} entries)`);
  if (mapSize === 0) console.log("  ⚠ No URL map found — run upload-images first for Cloudinary URLs");

  // 1. categories
  const catList = categoriesFromNav();
  const catSlugToId = new Map<string, string>();

  // insert without parentId first to avoid FK issues
  for (const cat of catList) {
    const [row] = await db
      .insert(categories)
      .values({ slug: cat.slug, name: cat.name })
      .onConflictDoNothing()
      .returning({ id: categories.id, slug: categories.slug });
    if (row) catSlugToId.set(row.slug, row.id);
  }
  // fill in ids for rows that already existed
  const existingCats = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  for (const r of existingCats) catSlugToId.set(r.slug, r.id);
  console.log(`  categories: ${catSlugToId.size}`);

  // 2. collections
  const colList = collectionsFromNav();
  const colSlugToId = new Map<string, string>();
  for (const col of colList) {
    const [row] = await db
      .insert(collections)
      .values({ slug: col.slug, name: col.name, description: col.description, status: "published" })
      .onConflictDoNothing()
      .returning({ id: collections.id, slug: collections.slug });
    if (row) colSlugToId.set(row.slug, row.id);
  }
  const existingCols = await db.select({ id: collections.id, slug: collections.slug }).from(collections);
  for (const r of existingCols) colSlugToId.set(r.slug, r.id);
  console.log(`  collections: ${colSlugToId.size}`);

  // 3. products
  let inserted = 0;
  let skipped = 0;

  for (const p of homeProducts) {
    const [row] = await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        description: p.description ?? null,
        status: p.status,
        priceAmount: String(p.price.amount),
        priceCurrency: p.price.currency,
        compareAtAmount: p.compareAtPrice ? String(p.compareAtPrice.amount) : null,
        label: p.label ?? null,
      })
      .onConflictDoNothing()
      .returning({ id: products.id, slug: products.slug });

    if (!row) { skipped++; continue; }
    inserted++;

    const productId = row.id;

    // images — use Cloudinary URLs when the map has them
    const imageRows = [];
    const primary = resolveImageUrl(p.primaryImageUrl ?? null);
    const hover = resolveImageUrl(p.hoverImageUrl ?? null);
    if (primary) {
      imageRows.push({ productId, url: primary, alt: p.name, sortOrder: 0, isPrimary: true, isHover: false });
    }
    if (hover) {
      imageRows.push({ productId, url: hover, alt: p.name, sortOrder: 1, isPrimary: false, isHover: true });
    }
    for (const [i, rawUrl] of (p.galleryImageUrls ?? []).entries()) {
      const url = resolveImageUrl(rawUrl);
      if (url) imageRows.push({ productId, url, alt: p.name, sortOrder: i + 2, isPrimary: false, isHover: false });
    }
    if (imageRows.length) await db.insert(productImages).values(imageRows).onConflictDoNothing();

    // default variant (sku = slug, stock = 0)
    await db
      .insert(productVariants)
      .values({
        productId,
        sku: `${p.slug}-default`,
        title: "Default",
        priceAmount: String(p.price.amount),
        priceCurrency: p.price.currency,
        inventoryQuantity: 0,
        isDefault: true,
      })
      .onConflictDoNothing();

    // collection links
    for (const colSlug of p.collectionSlugs ?? []) {
      const colId = colSlugToId.get(colSlug);
      if (colId) {
        await db
          .insert(collectionProducts)
          .values({ collectionId: colId, productId, sortOrder: 0 })
          .onConflictDoNothing();
      }
    }

    // category link
    if (p.categorySlug) {
      const catId = catSlugToId.get(p.categorySlug);
      if (catId) {
        await db
          .insert(categoryProducts)
          .values({ categoryId: catId, productId, sortOrder: 0 })
          .onConflictDoNothing();
      }
    }
  }

  console.log(`  products: ${inserted} inserted, ${skipped} already existed`);
  console.log("✅ Done.");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
