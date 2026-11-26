import { describe, expect, it } from "vitest";
import {
  listProducts,
  getProductBySlug,
  listCategories,
  listCollections,
  getCollectionProducts,
} from "../../packages/domain/src/catalog";

// ── Products ────────────────────────────────────────────────────────────────

describe("products", () => {
  it("lists published products with pagination defaults", async () => {
    const result = await listProducts({ page: 1, pageSize: 10 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(10);
    expect(result.items.every((p) => p.status === "published")).toBe(true);
  });

  it("respects pageSize", async () => {
    const result = await listProducts({ page: 1, pageSize: 5 });
    expect(result.items.length).toBeLessThanOrEqual(5);
  });

  it("paginates — page 2 is different from page 1", async () => {
    const page1 = await listProducts({ page: 1, pageSize: 5 });
    const page2 = await listProducts({ page: 2, pageSize: 5 });
    const ids1 = page1.items.map((p) => p.id);
    const ids2 = page2.items.map((p) => p.id);
    expect(ids1).not.toEqual(ids2);
  });

  it("each product has required fields", async () => {
    const result = await listProducts({ page: 1, pageSize: 10 });
    for (const p of result.items) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.status).toBe("published");
      expect(typeof p.price.amount).toBe("number");
      expect(p.price.amount).toBeGreaterThan(0);
    }
  });

  it("loads a product by slug", async () => {
    const all = await listProducts({ page: 1, pageSize: 1 });
    const slug = all.items[0].slug;
    const product = await getProductBySlug(slug);
    expect(product).not.toBeNull();
    expect(product?.slug).toBe(slug);
  });

  it("returns null for unknown slug", async () => {
    const product = await getProductBySlug("this-slug-does-not-exist-xyz123");
    expect(product).toBeNull();
  });

  it("search query narrows results", async () => {
    const all = await listProducts({ page: 1, pageSize: 100 });
    const firstWord = all.items[0].name.split(" ")[0];
    const filtered = await listProducts({ page: 1, pageSize: 100, q: firstWord });
    expect(filtered.total).toBeLessThanOrEqual(all.total);
  });
});

// ── Categories ──────────────────────────────────────────────────────────────

describe("categories", () => {
  it("lists at least one category", async () => {
    const cats = await listCategories();
    expect(cats.length).toBeGreaterThan(0);
  });

  it("each category has id, slug, and name", async () => {
    const cats = await listCategories();
    for (const c of cats) {
      expect(c.id).toBeTruthy();
      expect(c.slug).toBeTruthy();
      expect(c.name).toBeTruthy();
    }
  });

  it("category slugs are unique", async () => {
    const cats = await listCategories();
    const slugs = cats.map((c) => c.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });
});

// ── Collections ─────────────────────────────────────────────────────────────

describe("collections", () => {
  it("lists at least one collection", async () => {
    const cols = await listCollections();
    expect(cols.length).toBeGreaterThan(0);
  });

  it("each collection has id, slug, and name", async () => {
    const cols = await listCollections();
    for (const c of cols) {
      expect(c.id).toBeTruthy();
      expect(c.slug).toBeTruthy();
      expect(c.name).toBeTruthy();
    }
  });

  it("getCollectionProducts returns products for first collection", async () => {
    const cols = await listCollections();
    const products = await getCollectionProducts(cols[0].slug);
    expect(Array.isArray(products)).toBe(true);
  });

  it("getCollectionProducts returns an array for unknown slug", async () => {
    const products = await getCollectionProducts("unknown-slug-xyz999");
    expect(Array.isArray(products)).toBe(true);
  });
});
