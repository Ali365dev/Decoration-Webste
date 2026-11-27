// Product create/update against the local database. Each test uses unique names and cleans up.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createDb } from "../../packages/db/src/client";
import { assertLocalUrl, connect, LOCAL_DATABASE_URL } from "./helpers";
import { short } from "./factory";
import { productInputSchema, ConflictError } from "../../apps/storefront/app/api/admin/products/_product-input";
import { createProduct, updateProduct, loadProduct } from "../../apps/storefront/app/api/admin/products/_product-save";

const url = assertLocalUrl(process.env.TEST_DATABASE_URL ?? LOCAL_DATABASE_URL);
const db = createDb(url);
const sql = connect(url);
const tag = `ps-${short()}`;
let categoryId: string;
let collectionId: string;

const input = (over: Record<string, unknown> = {}) =>
  productInputSchema.parse({
    name: `${tag} Ocean`,
    description: "Blue",
    priceAmount: 1999,
    sku: `${tag}-SKU`,
    stock: 4,
    categoryId,
    collectionIds: [collectionId],
    images: [
      { url: `https://res.cloudinary.com/demo/${tag}-1.jpg`, publicId: `${tag}-1`, isPrimary: false },
      { url: `https://res.cloudinary.com/demo/${tag}-2.jpg`, publicId: `${tag}-2`, isPrimary: true },
    ],
    ...over,
  });

beforeAll(async () => {
  [{ id: categoryId }] = await sql`insert into categories (slug, name) values (${tag + "-cat"}, ${tag}) returning id`;
  [{ id: collectionId }] = await sql`insert into collections (slug, name) values (${tag + "-col"}, ${tag}) returning id`;
});

afterAll(async () => {
  // local test data only
  await sql`delete from products where name like ${tag + "%"}`;
  await sql`delete from product_variants where sku like ${tag + "%"}`;
  await sql`delete from categories where id = ${categoryId}`;
  await sql`delete from collections where id = ${collectionId}`;
  await sql.end();
  await db.$client.end();
});

describe("createProduct", () => {
  it("creates product, two sizes, category link, collection link and images in one call", async () => {
    const { id } = await createProduct(
      db,
      input({ variants: [{ title: "A4", priceAmount: 2500, inventoryQuantity: 3 }, { title: "A3", priceAmount: 3000, inventoryQuantity: 1 }] }),
    );
    const p = await loadProduct(db, id);
    expect(p?.variants.map((v) => v.sku)).toEqual([`${tag}-SKU-a4`, `${tag}-SKU-a3`]);
    expect(p?.categoryId).toBe(categoryId);
    expect(p?.collectionIds).toEqual([collectionId]);
    expect(p?.images.map((i) => [i.storagePath, i.isPrimary])).toEqual([[`${tag}-1`, false], [`${tag}-2`, true]]);
  });

  it("duplicate SKU aborts the whole create", async () => {
    const [{ id: other }] = await sql`insert into products (slug, name, price_amount) values (${tag + "-other"}, ${tag + " other"}, 1) returning id`;
    await sql`insert into product_variants (product_id, sku, title, price_amount) values (${other}, ${tag + "-DUP"}, 'x', 1)`;
    const name = `${tag} Dup`;
    await expect(createProduct(db, input({ name, sku: `${tag}-DUP` }))).rejects.toBeInstanceOf(ConflictError);
    const [{ n }] = await sql`select count(*)::int as n from products where name = ${name}`;
    expect(n).toBe(0);
  });

  it("same name twice gets slug-2", async () => {
    const a = await createProduct(db, input({ name: `${tag} Twin`, sku: `${tag}-T1` }));
    const b = await createProduct(db, input({ name: `${tag} Twin`, sku: `${tag}-T2` }));
    expect(b.slug).toBe(`${a.slug}-2`);
  });
});

describe("updateProduct", () => {
  it("keeps slug, label and hover image", async () => {
    const { id, slug } = await createProduct(db, input({ name: `${tag} Keep`, sku: `${tag}-K` }));
    await sql`update products set label = 'NEW IN' where id = ${id}`;
    await sql`update product_images set is_hover = true where product_id = ${id} and storage_path = ${tag + "-1"}`;
    await updateProduct(db, id, input({ name: `${tag} Kept renamed`, sku: `${tag}-K` }));
    const [row] = await sql`select slug, label, name from products where id = ${id}`;
    expect(row).toEqual({ slug, label: "NEW IN", name: `${tag} Kept renamed` });
    const [img] = await sql`select is_hover from product_images where product_id = ${id} and storage_path = ${tag + "-1"}`;
    expect(img.is_hover).toBe(true);
  });

  it("removing a size deactivates it, not deletes it", async () => {
    const sizes = [{ title: "A4", priceAmount: 1, inventoryQuantity: 0 }, { title: "A3", priceAmount: 1, inventoryQuantity: 0 }];
    const { id } = await createProduct(db, input({ name: `${tag} Sizes`, sku: `${tag}-S`, variants: sizes }));
    await updateProduct(db, id, input({ name: `${tag} Sizes`, sku: `${tag}-S`, variants: [sizes[0]] }));
    const [gone] = await sql`select is_active from product_variants where sku = ${tag + "-S-a3"}`;
    expect(gone.is_active).toBe(false);
    expect((await loadProduct(db, id))?.variants.map((v) => v.sku)).toEqual([`${tag}-S-a4`]);
  });

  it("returns null for an unknown id", async () => {
    expect(await updateProduct(db, "00000000-0000-0000-0000-000000000000", input({ sku: `${tag}-none` }))).toBeNull();
  });
});

describe("DELETE /api/admin/products/:id", () => {
  it("archives the product", async () => {
    vi.stubEnv("ADMIN_API_KEY", "k");
    vi.stubEnv("DATABASE_URL", url);
    const { DELETE } = await import("../../apps/storefront/app/api/admin/products/[id]/route");
    const { id } = await createProduct(db, input({ name: `${tag} Archive`, sku: `${tag}-AR` }));
    const res = await DELETE(new NextRequest(`http://x/api/admin/products/${id}`, { method: "DELETE", headers: { "x-admin-key": "k" } }), {
      params: Promise.resolve({ id }),
    });
    expect(res.status).toBe(200);
    const [row] = await sql`select status from products where id = ${id}`;
    expect(row.status).toBe("archived");
    vi.unstubAllEnvs();
  });
});
