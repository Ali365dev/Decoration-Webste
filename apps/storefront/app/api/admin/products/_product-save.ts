import type { Database } from "@dec-walls/db/client";
import {
  products,
  productImages,
  productVariants,
  categoryProducts,
  collectionProducts,
} from "@dec-walls/db/schema";
import { and, asc, eq, inArray, like, notInArray, or } from "drizzle-orm";
import {
  ConflictError,
  buildVariantRows,
  nextFreeSlug,
  planVariantChanges,
  slugify,
  type ProductInput,
} from "./_product-input";

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

/** Turns a unique-SKU violation (possibly wrapped by Drizzle) into a ConflictError. */
function rethrowSkuConflict(err: unknown, skus: string[]): never {
  const e = err as { code?: string; constraint_name?: string; cause?: { code?: string; constraint_name?: string; detail?: string } };
  const pg = e?.code ? e : e?.cause;
  if (pg?.code === "23505" && pg.constraint_name === "product_variants_sku_uq") {
    const sku = /\(sku\)=\(([^)]+)\)/.exec((pg as { detail?: string }).detail ?? "")?.[1] ?? skus.join(", ");
    throw new ConflictError(`SKU already in use: ${sku}`);
  }
  throw err;
}

async function writeLinks(tx: Tx, productId: string, input: ProductInput) {
  await tx.delete(categoryProducts).where(eq(categoryProducts.productId, productId));
  if (input.categoryId) await tx.insert(categoryProducts).values({ categoryId: input.categoryId, productId });
  await tx.delete(collectionProducts).where(eq(collectionProducts.productId, productId));
  if (input.collectionIds.length) {
    await tx.insert(collectionProducts).values(input.collectionIds.map((collectionId) => ({ collectionId, productId })));
  }
}

async function writeImages(tx: Tx, productId: string, input: ProductInput) {
  const urls = input.images.map((i) => i.url);
  // Remove images no longer listed; kept ones keep their alt text and hover flag.
  await tx
    .delete(productImages)
    .where(urls.length ? and(eq(productImages.productId, productId), notInArray(productImages.url, urls)) : eq(productImages.productId, productId));
  const existing = await tx.select({ id: productImages.id, url: productImages.url }).from(productImages).where(eq(productImages.productId, productId));
  const byUrl = new Map(existing.map((e) => [e.url, e.id]));
  for (const [sortOrder, img] of input.images.entries()) {
    const id = byUrl.get(img.url);
    if (id) {
      await tx.update(productImages).set({ sortOrder, isPrimary: img.isPrimary }).where(eq(productImages.id, id));
    } else {
      await tx.insert(productImages).values({ productId, url: img.url, storagePath: img.publicId, isPrimary: img.isPrimary, sortOrder });
    }
  }
}

const productFields = (input: ProductInput) => ({
  name: input.name,
  description: input.description,
  status: input.status,
  priceAmount: String(input.priceAmount),
  compareAtAmount: input.compareAtAmount === null ? null : String(input.compareAtAmount),
  material: input.material,
});

export async function createProduct(db: Database, input: ProductInput): Promise<{ id: string; slug: string }> {
  const variants = buildVariantRows(input);
  try {
    return await db.transaction(async (tx) => {
      const base = input.slug ? slugify(input.slug) : slugify(input.name);
      const taken = await tx
        .select({ slug: products.slug })
        .from(products)
        .where(or(eq(products.slug, base), like(products.slug, `${base}-%`)));
      const slug = nextFreeSlug(base, taken.map((t) => t.slug));

      const [created] = await tx.insert(products).values({ slug, ...productFields(input) }).returning({ id: products.id, slug: products.slug });
      await tx.insert(productVariants).values(variants.map((v) => ({ ...v, productId: created.id })));
      await writeLinks(tx, created.id, input);
      await writeImages(tx, created.id, input);
      return created;
    });
  } catch (err) {
    rethrowSkuConflict(err, variants.map((v) => v.sku));
  }
}

export async function updateProduct(db: Database, id: string, input: ProductInput): Promise<{ id: string } | null> {
  const variants = buildVariantRows(input);
  try {
    return await db.transaction(async (tx) => {
      // Slug and label are never changed here.
      const [updated] = await tx
        .update(products)
        .set({ ...productFields(input), updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning({ id: products.id });
      if (!updated) return null;

      const existing = await tx.select({ id: productVariants.id, sku: productVariants.sku }).from(productVariants).where(eq(productVariants.productId, id));
      const plan = planVariantChanges(existing, variants);
      if (plan.deactivate.length) {
        await tx.update(productVariants).set({ isActive: false, isDefault: false }).where(inArray(productVariants.id, plan.deactivate));
      }
      for (const { id: variantId, row } of plan.update) {
        await tx.update(productVariants).set(row).where(eq(productVariants.id, variantId));
      }
      if (plan.insert.length) {
        await tx.insert(productVariants).values(plan.insert.map((v) => ({ ...v, productId: id })));
      }
      await writeLinks(tx, id, input);
      await writeImages(tx, id, input);
      return updated;
    });
  } catch (err) {
    rethrowSkuConflict(err, variants.map((v) => v.sku));
  }
}

export async function loadProduct(db: Database, id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return null;
  const [images, variants, cats, cols] = await Promise.all([
    db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder)),
    db
      .select()
      .from(productVariants)
      .where(and(eq(productVariants.productId, id), eq(productVariants.isActive, true)))
      .orderBy(asc(productVariants.sortOrder)),
    db.select({ categoryId: categoryProducts.categoryId }).from(categoryProducts).where(eq(categoryProducts.productId, id)),
    db.select({ collectionId: collectionProducts.collectionId }).from(collectionProducts).where(eq(collectionProducts.productId, id)),
  ]);
  return {
    ...product,
    images,
    variants,
    categoryId: cats[0]?.categoryId ?? null,
    collectionIds: cols.map((c) => c.collectionId),
  };
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof loadProduct>>>;
