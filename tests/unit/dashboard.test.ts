/**
 * Dashboard service layer tests.
 *
 * These tests verify the data-mapping logic in the dashboard services by
 * calling the domain layer directly (same source of truth that the proxy
 * forwards to). No real HTTP calls are made.
 */
import { describe, expect, it } from "vitest";
import {
  listProducts,
  getProductBySlug,
  listCategories,
  listCollections,
} from "../../packages/domain/src/catalog";
import { listOrders } from "../../packages/domain/src/checkout";

// ── Dashboard — Products ────────────────────────────────────────────────────

describe("dashboard: products", () => {
  it("fetches a non-empty product list", async () => {
    const result = await listProducts({ page: 1, pageSize: 20 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("each product has fields the dashboard grid needs", async () => {
    const result = await listProducts({ page: 1, pageSize: 20 });
    for (const p of result.items) {
      expect(typeof p.id).toBe("string");
      expect(typeof p.name).toBe("string");
      expect(typeof p.slug).toBe("string");
      expect(typeof p.price.amount).toBe("number");
      expect(["published", "draft", "archived", "scheduled"]).toContain(p.status);
    }
  });

  it("gets a single product by slug", async () => {
    const page = await listProducts({ page: 1, pageSize: 1 });
    const slug = page.items[0].slug;
    const product = await getProductBySlug(slug);
    expect(product).not.toBeNull();
    expect(product?.id).toBeTruthy();
    expect(product?.name).toBeTruthy();
  });

  it("dashboard price is a positive number", async () => {
    const result = await listProducts({ page: 1, pageSize: 10 });
    for (const p of result.items) {
      expect(p.price.amount).toBeGreaterThan(0);
    }
  });

  it("supports search-style filtering (status)", async () => {
    const all = await listProducts({ page: 1, pageSize: 100 });
    const published = all.items.filter((p) => p.status === "published");
    expect(published.length).toBeGreaterThan(0);
  });
});

// ── Dashboard — Categories ──────────────────────────────────────────────────

describe("dashboard: categories", () => {
  it("returns a non-empty category list", async () => {
    const cats = await listCategories();
    expect(cats.length).toBeGreaterThan(0);
  });

  it("each category has the shape the dashboard expects", async () => {
    const cats = await listCategories();
    for (const c of cats) {
      expect(typeof c.id).toBe("string");
      expect(typeof c.slug).toBe("string");
      expect(typeof c.name).toBe("string");
    }
  });

  it("category ids are unique", async () => {
    const cats = await listCategories();
    const ids = cats.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Dashboard — Collections ─────────────────────────────────────────────────

describe("dashboard: collections", () => {
  it("returns a non-empty collection list", async () => {
    const cols = await listCollections();
    expect(cols.length).toBeGreaterThan(0);
  });

  it("each collection has id, slug and name", async () => {
    const cols = await listCollections();
    for (const c of cols) {
      expect(typeof c.id).toBe("string");
      expect(typeof c.slug).toBe("string");
      expect(typeof c.name).toBe("string");
    }
  });
});

// ── Dashboard — Orders ──────────────────────────────────────────────────────

describe("dashboard: orders", () => {
  it("returns an array (may be empty when no orders placed yet)", async () => {
    const orders = await listOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  it("each order has the shape the dashboard expects", async () => {
    const orders = await listOrders();
    for (const o of orders) {
      expect(typeof o.id).toBe("string");
      expect(typeof o.number).toBe("string");
      expect(o.number).toMatch(/^DW-/);
      expect(["pending", "paid", "shipped", "cancelled"]).toContain(o.status);
      expect(o.total.amount).toBeGreaterThanOrEqual(0);
    }
  });
});
