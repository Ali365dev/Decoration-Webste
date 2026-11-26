import { homeProducts } from "../seed/products";
import type {
  CategoryDto,
  CollectionDto,
  Paginated,
  ProductDto,
} from "@dec-walls/types";
import type { PaginationInput } from "@dec-walls/validation";
import { mainNav } from "../cms/navigation";
import { getDb } from "@dec-walls/db/client";
import { eq, inArray, and } from "drizzle-orm";
import {
  products as productsTable,
  productImages,
  collectionProducts as collectionProductsTable,
  collections as collectionsTable,
  categoryProducts as categoryProductsTable,
  categories as categoriesTable,
} from "@dec-walls/db/schema";

// ── seed fallbacks ────────────────────────────────────────────────────────────

function categoriesFromNav(): CategoryDto[] {
  const map = new Map<string, CategoryDto>();
  const walk = (items: typeof mainNav, parentId: string | null) => {
    for (const item of items) {
      if (item.id === "home") continue;
      if (!map.has(item.id)) {
        map.set(item.id, {
          id: `c-${item.id}`,
          slug: item.id,
          name: item.label,
          parentId: parentId ? `c-${parentId}` : null,
        });
      }
      walk(item.children, item.id);
    }
  };
  walk(mainNav, null);
  return [...map.values()];
}

const seedCategories = categoriesFromNav();

function titleCase(label: string) {
  return label.toLowerCase().replace(/\b[a-z]/g, (l) => l.toUpperCase());
}

function collectionsFromNav(): CollectionDto[] {
  const map = new Map<string, CollectionDto>();
  const walk = (items: typeof mainNav) => {
    for (const item of items) {
      const slug = item.href.match(/^\/collections\/([^/]+)$/)?.[1];
      if (slug && !map.has(slug)) {
        const name = titleCase(item.label);
        map.set(slug, {
          id: `col-${slug}`,
          slug,
          name,
          description:
            slug === "new-in"
              ? "Shop the latest arrivals in bedding, home decor, and more."
              : slug === "sale"
                ? "Shop marked down home textiles and decor at Dec Walls."
                : `Shop ${name} online at Dec Walls. Explore home textiles and decor with delivery across Pakistan.`,
        });
      }
      walk(item.children);
    }
  };
  walk(mainNav);
  for (const [slug, name] of [
    ["bath", "Bath"],
    ["dining", "Dining"],
    ["living", "Living"],
    ["coverlets", "Coverlets"],
  ]) {
    if (!map.has(slug)) {
      map.set(slug, {
        id: `col-${slug}`,
        slug,
        name,
        description: `Shop ${name.toLowerCase()} online at Dec Walls.`,
      });
    }
  }
  return [...map.values()];
}

const seedCollections = collectionsFromNav();

// ── DB → DTO helpers ──────────────────────────────────────────────────────────

type DbProduct = typeof productsTable.$inferSelect;
type DbImage = typeof productImages.$inferSelect;

function mapProduct(
  row: DbProduct,
  images: DbImage[],
  collectionSlugs: string[],
  categorySlug: string | undefined,
): ProductDto {
  const primary = images.find((i) => i.isPrimary);
  const hover = images.find((i) => i.isHover);
  const gallery = images
    .filter((i) => !i.isPrimary && !i.isHover)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((i) => i.url);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    status: row.status as ProductDto["status"],
    price: { amount: parseFloat(row.priceAmount), currency: row.priceCurrency },
    compareAtPrice: row.compareAtAmount
      ? { amount: parseFloat(row.compareAtAmount), currency: row.priceCurrency }
      : null,
    primaryImageUrl: primary?.url ?? null,
    hoverImageUrl: hover?.url ?? null,
    galleryImageUrls: gallery.length ? gallery : undefined,
    label: row.label ?? null,
    categorySlug,
    collectionSlugs,
  };
}

// ── public API ────────────────────────────────────────────────────────────────

export async function listProducts(
  input: PaginationInput = { page: 1, pageSize: 24 },
): Promise<Paginated<ProductDto>> {
  const db = getDb();
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 24;

  if (!db) {
    let items = homeProducts.filter((p) => p.status === "published");
    if (input.q) {
      const q = input.q.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q));
    }
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length };
  }

  let rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.status, "published"));

  if (input.q) {
    const q = input.q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(q));
  }

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);
  const ids = pageRows.map((r) => r.id);

  const [allImages, colLinks, catLinks] = await Promise.all([
    ids.length ? db.select().from(productImages).where(inArray(productImages.productId, ids)) : [],
    ids.length
      ? db
          .select({ productId: collectionProductsTable.productId, slug: collectionsTable.slug })
          .from(collectionProductsTable)
          .innerJoin(collectionsTable, eq(collectionsTable.id, collectionProductsTable.collectionId))
          .where(inArray(collectionProductsTable.productId, ids))
      : [],
    ids.length
      ? db
          .select({ productId: categoryProductsTable.productId, slug: categoriesTable.slug })
          .from(categoryProductsTable)
          .innerJoin(categoriesTable, eq(categoriesTable.id, categoryProductsTable.categoryId))
          .where(inArray(categoryProductsTable.productId, ids))
      : [],
  ]);

  const imgMap = new Map<string, DbImage[]>();
  for (const img of allImages) {
    if (!imgMap.has(img.productId)) imgMap.set(img.productId, []);
    imgMap.get(img.productId)!.push(img);
  }
  const colMap = new Map<string, string[]>();
  for (const c of colLinks) {
    if (!colMap.has(c.productId)) colMap.set(c.productId, []);
    colMap.get(c.productId)!.push(c.slug);
  }
  const catMap = new Map<string, string>();
  for (const c of catLinks) catMap.set(c.productId, c.slug);

  const items = pageRows.map((r) =>
    mapProduct(r, imgMap.get(r.id) ?? [], colMap.get(r.id) ?? [], catMap.get(r.id)),
  );

  return { items, page, pageSize, total };
}

export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
  const db = getDb();

  if (!db) return homeProducts.find((p) => p.slug === slug) ?? null;

  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug));

  if (!row) return null;

  const [images, colLinks, catLinks] = await Promise.all([
    db.select().from(productImages).where(eq(productImages.productId, row.id)),
    db
      .select({ slug: collectionsTable.slug })
      .from(collectionProductsTable)
      .innerJoin(collectionsTable, eq(collectionsTable.id, collectionProductsTable.collectionId))
      .where(eq(collectionProductsTable.productId, row.id)),
    db
      .select({ slug: categoriesTable.slug })
      .from(categoryProductsTable)
      .innerJoin(categoriesTable, eq(categoriesTable.id, categoryProductsTable.categoryId))
      .where(eq(categoryProductsTable.productId, row.id)),
  ]);

  return mapProduct(
    row,
    images,
    colLinks.map((c) => c.slug),
    catLinks[0]?.slug,
  );
}

export async function listCategories(): Promise<CategoryDto[]> {
  const db = getDb();
  if (!db) return seedCategories;

  const rows = await db.select().from(categoriesTable);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    parentId: r.parentId,
  }));
}

export async function listCollections(): Promise<CollectionDto[]> {
  const db = getDb();
  if (!db) return seedCollections;

  const rows = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.status, "published"));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? null,
  }));
}

export async function getCollectionProducts(slug: string): Promise<ProductDto[]> {
  const db = getDb();

  if (!db) {
    if (slug === "sale") return homeProducts.filter((p) => p.compareAtPrice);
    if (slug === "new-in") return homeProducts.filter((p) => p.label === "NEW IN");
    const direct = homeProducts.filter(
      (p) => p.categorySlug === slug || p.collectionSlugs?.includes(slug),
    );
    if (direct.length > 0) return direct;
    const terms = slug
      .split("-")
      .filter((t) => t.length > 3 && !["premium", "custom"].includes(t));
    const matches = homeProducts.filter((p) =>
      terms.some((t) => p.name.toLowerCase().includes(t)),
    );
    return matches.length > 0 ? matches : homeProducts.filter((p) => p.status === "published");
  }

  if (slug === "sale") {
    const rows = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.status, "published")));
    const saleRows = rows.filter((r) => r.compareAtAmount !== null);
    const ids = saleRows.map((r) => r.id);
    if (!ids.length) return [];
    const [images, colLinks, catLinks] = await Promise.all([
      db.select().from(productImages).where(inArray(productImages.productId, ids)),
      db
        .select({ productId: collectionProductsTable.productId, slug: collectionsTable.slug })
        .from(collectionProductsTable)
        .innerJoin(collectionsTable, eq(collectionsTable.id, collectionProductsTable.collectionId))
        .where(inArray(collectionProductsTable.productId, ids)),
      db
        .select({ productId: categoryProductsTable.productId, slug: categoriesTable.slug })
        .from(categoryProductsTable)
        .innerJoin(categoriesTable, eq(categoriesTable.id, categoryProductsTable.categoryId))
        .where(inArray(categoryProductsTable.productId, ids)),
    ]);
    return buildDtos(saleRows, images, colLinks, catLinks);
  }

  if (slug === "new-in") {
    const rows = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.status, "published")));
    const newIn = rows.filter((r) => r.label === "NEW IN");
    const ids = newIn.map((r) => r.id);
    if (!ids.length) return [];
    const [images, colLinks, catLinks] = await batchRelations(db, ids);
    return buildDtos(newIn, images, colLinks, catLinks);
  }

  // find the collection by slug
  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.slug, slug));

  if (!collection) return [];

  const links = await db
    .select({ productId: collectionProductsTable.productId })
    .from(collectionProductsTable)
    .where(eq(collectionProductsTable.collectionId, collection.id));

  const ids = links.map((l) => l.productId);
  if (!ids.length) return [];

  const rows = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.status, "published"), inArray(productsTable.id, ids)));

  const [images, colLinks, catLinks] = await batchRelations(db, rows.map((r) => r.id));
  return buildDtos(rows, images, colLinks, catLinks);
}

export async function listAllProductsAdmin(): Promise<ProductDto[]> {
  const db = getDb();
  if (!db) return homeProducts;
  const rows = await db.select().from(productsTable);
  const ids = rows.map((r) => r.id);
  if (!ids.length) return [];
  const [images, colLinks, catLinks] = await batchRelations(db, ids);
  return buildDtos(rows, images, colLinks, catLinks);
}

// ── private helpers ───────────────────────────────────────────────────────────

type DB = NonNullable<ReturnType<typeof getDb>>;

async function batchRelations(db: DB, ids: string[]) {
  return Promise.all([
    db.select().from(productImages).where(inArray(productImages.productId, ids)),
    db
      .select({ productId: collectionProductsTable.productId, slug: collectionsTable.slug })
      .from(collectionProductsTable)
      .innerJoin(collectionsTable, eq(collectionsTable.id, collectionProductsTable.collectionId))
      .where(inArray(collectionProductsTable.productId, ids)),
    db
      .select({ productId: categoryProductsTable.productId, slug: categoriesTable.slug })
      .from(categoryProductsTable)
      .innerJoin(categoriesTable, eq(categoriesTable.id, categoryProductsTable.categoryId))
      .where(inArray(categoryProductsTable.productId, ids)),
  ]);
}

function buildDtos(
  rows: DbProduct[],
  images: DbImage[],
  colLinks: { productId: string; slug: string }[],
  catLinks: { productId: string; slug: string }[],
): ProductDto[] {
  const imgMap = new Map<string, DbImage[]>();
  for (const img of images) {
    if (!imgMap.has(img.productId)) imgMap.set(img.productId, []);
    imgMap.get(img.productId)!.push(img);
  }
  const colMap = new Map<string, string[]>();
  for (const c of colLinks) {
    if (!colMap.has(c.productId)) colMap.set(c.productId, []);
    colMap.get(c.productId)!.push(c.slug);
  }
  const catMap = new Map<string, string>();
  for (const c of catLinks) catMap.set(c.productId, c.slug);

  return rows.map((r) =>
    mapProduct(r, imgMap.get(r.id) ?? [], colMap.get(r.id) ?? [], catMap.get(r.id)),
  );
}
