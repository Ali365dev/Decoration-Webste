import { describe, expect, it } from "vitest";
import { fromApiProduct, toApiPayload } from "../../apps/dashboard/src/services/productMapping.js";

const apiProduct = {
  id: "p1",
  name: "Ocean",
  slug: "ocean",
  description: null,
  status: "published",
  priceAmount: "1999.00",
  compareAtAmount: null,
  material: "Canvas",
  label: "NEW IN",
  categoryId: "c1",
  collectionIds: ["k1"],
  images: [
    { url: "https://res.cloudinary.com/a.jpg", storagePath: "a", isPrimary: false, sortOrder: 0 },
    { url: "/bareeze/image-17.jpg", storagePath: null, isPrimary: true, sortOrder: 1 },
  ],
  variants: [
    { id: "v1", sku: "WP-a4", title: "A4", priceAmount: "2500.00", inventoryQuantity: 3, isDefault: true },
    { id: "v2", sku: "WP-a3", title: "A3", priceAmount: "3000.00", inventoryQuantity: 1, isDefault: false },
  ],
};

describe("fromApiProduct", () => {
  it("maps sizes and keeps category and collections", () => {
    const p = fromApiProduct(apiProduct);
    expect(p).toMatchObject({ price: 1999, categoryId: "c1", collectionIds: ["k1"], sku: "WP-a4", stock: 3 });
    expect(p.variants).toEqual([
      { id: "v1", sku: "WP-a4", size: "A4", price: 2500, stock: 3 },
      { id: "v2", sku: "WP-a3", size: "A3", price: 3000, stock: 1 },
    ]);
  });

  it("puts the primary image first and reads publicId from storagePath", () => {
    expect(fromApiProduct(apiProduct).images).toEqual([
      { url: "/bareeze/image-17.jpg", publicId: null },
      { url: "https://res.cloudinary.com/a.jpg", publicId: "a" },
    ]);
  });

  it("a product with only the default variant has no sizes", () => {
    const p = fromApiProduct({ ...apiProduct, variants: [{ id: "v", sku: "WP", title: "Default", priceAmount: "1", inventoryQuantity: 9, isDefault: true }] });
    expect(p.variants).toEqual([]);
    expect(p).toMatchObject({ sku: "WP", stock: 9 });
  });
});

describe("toApiPayload", () => {
  const form = { name: "Ocean", sku: "WP", material: "", categoryId: "c1", price: "1999", comparePrice: "0", stock: "4", status: "draft", description: "" };

  it("renames form fields to API fields", () => {
    const body = toApiPayload(form, {
      collectionIds: ["k1"],
      variants: [{ id: "v1", sku: "WP-a4", size: "A4", price: "2500", stock: "3" }],
      images: [],
    });
    expect(body).toMatchObject({
      name: "Ocean",
      priceAmount: 1999,
      compareAtAmount: 0,
      stock: 4,
      sku: "WP",
      categoryId: "c1",
      collectionIds: ["k1"],
      variants: [{ title: "A4", priceAmount: 2500, inventoryQuantity: 3, sku: "WP-a4" }],
    });
  });

  it("drops sizes with no name", () => {
    expect(toApiPayload(form, { collectionIds: [], variants: [{ size: "", price: "1", stock: 0 }], images: [] }).variants).toEqual([]);
  });

  it("passes existing image paths through untouched and marks the first as primary", () => {
    const images = [{ url: "/bareeze/image-17.jpg", publicId: null }, { url: "https://res.cloudinary.com/b.jpg", publicId: "b" }];
    expect(toApiPayload(form, { collectionIds: [], variants: [], images }).images).toEqual([
      { url: "/bareeze/image-17.jpg", publicId: null, isPrimary: true },
      { url: "https://res.cloudinary.com/b.jpg", publicId: "b", isPrimary: false },
    ]);
  });
});
