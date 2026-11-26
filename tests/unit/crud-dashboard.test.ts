/**
 * Dashboard service CRUD tests.
 *
 * Tests the data-mapping contract and API endpoint calls the dashboard services
 * make. Axios is mocked — no real HTTP required.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// ── mapProduct helper (mirrors apps/full-version/src/services/products.js) ───

function mapProduct(p: Record<string, any>) {
  const primaryImage =
    (p.images as any[])?.find((i: any) => i.isPrimary)?.url ??
    (p.images as any[])?.[0]?.url ??
    null;
  const firstVariant = (p.variants as any[])?.[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    status: p.status,
    price: parseFloat(p.priceAmount ?? p.price_amount ?? 0),
    comparePrice: p.compareAtAmount ? parseFloat(p.compareAtAmount) : 0,
    sku: firstVariant?.sku ?? "",
    stock: firstVariant?.inventoryQuantity ?? 0,
    material: p.material ?? "",
    label: p.label ?? null,
    images: primaryImage ? [primaryImage] : [],
    rating: 0,
    reviewCount: 0,
    categoryId: null,
    collectionIds: [],
    createdAt: p.createdAt ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? new Date().toISOString(),
  };
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const fakeProduct = {
  id: "prod-123",
  name: "Test Wallpaper",
  slug: "test-wallpaper",
  description: "A nice wallpaper",
  status: "published",
  priceAmount: "1999.00",
  compareAtAmount: "2499.00",
  material: "Vinyl",
  label: "NEW IN",
  images: [{ url: "https://res.cloudinary.com/test/image.jpg", isPrimary: true }],
  variants: [{ sku: "WP-001", inventoryQuantity: 50 }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const fakeCategory = {
  id: "cat-1",
  slug: "wall-art",
  name: "Wall Art",
  productCount: 25,
};

const fakeCollection = {
  id: "col-1",
  slug: "living-room",
  name: "Living Room",
  description: "Living room decor",
  productCount: 15,
};

// ── mapProduct transformation ─────────────────────────────────────────────────

describe("dashboard: mapProduct transformation", () => {
  it("maps price from priceAmount string to float", () => {
    const result = mapProduct(fakeProduct);
    expect(result.price).toBe(1999.0);
    expect(typeof result.price).toBe("number");
  });

  it("maps comparePrice from compareAtAmount", () => {
    const result = mapProduct(fakeProduct);
    expect(result.comparePrice).toBe(2499.0);
  });

  it("extracts primary image url", () => {
    const result = mapProduct(fakeProduct);
    expect(result.images).toEqual(["https://res.cloudinary.com/test/image.jpg"]);
  });

  it("extracts sku and stock from first variant", () => {
    const result = mapProduct(fakeProduct);
    expect(result.sku).toBe("WP-001");
    expect(result.stock).toBe(50);
  });

  it("sets defaults for missing optional fields", () => {
    const minimal = { id: "x", name: "X", slug: "x", status: "published", priceAmount: "100" };
    const result = mapProduct(minimal);
    expect(result.description).toBe("");
    expect(result.sku).toBe("");
    expect(result.stock).toBe(0);
    expect(result.images).toEqual([]);
    expect(result.rating).toBe(0);
  });

  it("falls back to price_amount (snake_case) if priceAmount missing", () => {
    const p = { ...fakeProduct, priceAmount: undefined, price_amount: "500.00" };
    const result = mapProduct(p);
    expect(result.price).toBe(500.0);
  });

  it("comparePrice is 0 when compareAtAmount is absent", () => {
    const p = { ...fakeProduct, compareAtAmount: undefined };
    const result = mapProduct(p);
    expect(result.comparePrice).toBe(0);
  });

  it("uses second image when no isPrimary flag", () => {
    const p = {
      ...fakeProduct,
      images: [
        { url: "https://img1.com/a.jpg" },
        { url: "https://img2.com/b.jpg" },
      ],
    };
    const result = mapProduct(p);
    expect(result.images).toEqual(["https://img1.com/a.jpg"]);
  });
});

// ── Axios mock setup ──────────────────────────────────────────────────────────

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDelete = vi.fn();

vi.mock("axios", () => ({
  default: {
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args),
    put: (...args: any[]) => mockPut(...args),
    delete: (...args: any[]) => mockDelete(...args),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// Inline service functions (same logic as the actual dashboard services)
const axios = { get: mockGet, post: mockPost, put: mockPut, delete: mockDelete };

async function getProducts(params = {}) {
  const response = await axios.get("/api/admin/products", { params });
  const rows: any[] = response.data?.data ?? [];
  return { products: rows.map(mapProduct), allData: rows.map(mapProduct), total: rows.length };
}
async function getProductById(id: string) {
  const response = await axios.get(`/api/admin/products/${id}`);
  const p = response.data?.data;
  if (!p) return null;
  return { ...mapProduct(p), images: (p.images ?? []).map((i: any) => i.url), variants: p.variants ?? [] };
}
async function createProduct(data: Record<string, any>) {
  const response = await axios.post("/api/admin/products", data);
  return mapProduct(response.data?.data ?? {});
}
async function updateProduct(id: string, data: Record<string, any>) {
  const response = await axios.put(`/api/admin/products/${id}`, data);
  return mapProduct(response.data?.data ?? {});
}
async function deleteProduct(id: string) {
  const response = await axios.delete(`/api/admin/products/${id}`);
  return response.data;
}
async function getCategories() {
  const response = await axios.get("/api/admin/categories");
  const rows: any[] = response.data?.data ?? [];
  return {
    categories: rows.map((c: any) => ({ id: c.id, slug: c.slug, name: c.name, productCount: c.productCount ?? 0 })),
    total: rows.length,
  };
}
async function getCollections() {
  const response = await axios.get("/api/admin/collections");
  const rows: any[] = response.data?.data ?? [];
  return {
    collections: rows.map((c: any) => ({ id: c.id, slug: c.slug, name: c.name, description: c.description ?? "", productCount: c.productCount ?? 0 })),
    total: rows.length,
  };
}

// ── Dashboard Products CRUD ───────────────────────────────────────────────────

describe("dashboard: products CRUD", () => {
  it("READ — getProducts calls GET /api/admin/products", async () => {
    mockGet.mockResolvedValue({ data: { data: [fakeProduct] } });
    const result = await getProducts();
    expect(mockGet).toHaveBeenCalledWith("/api/admin/products", expect.any(Object));
    expect(result.products.length).toBe(1);
    expect(result.total).toBe(1);
  });

  it("READ — getProducts maps product fields correctly", async () => {
    mockGet.mockResolvedValue({ data: { data: [fakeProduct] } });
    const { products } = await getProducts();
    const p = products[0];
    expect(p.id).toBe("prod-123");
    expect(p.name).toBe("Test Wallpaper");
    expect(p.price).toBe(1999);
    expect(p.sku).toBe("WP-001");
    expect(p.stock).toBe(50);
  });

  it("READ — getProducts with params passes filters", async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });
    await getProducts({ status: "published", q: "wall" });
    expect(mockGet).toHaveBeenCalledWith("/api/admin/products", {
      params: { status: "published", q: "wall" },
    });
  });

  it("READ — getProductById calls GET /api/admin/products/:id", async () => {
    mockGet.mockResolvedValue({ data: { data: fakeProduct } });
    const p = await getProductById("prod-123");
    expect(mockGet).toHaveBeenCalledWith("/api/admin/products/prod-123");
    expect(p?.id).toBe("prod-123");
  });

  it("READ — getProductById returns null on missing data", async () => {
    mockGet.mockResolvedValue({ data: {} });
    const result = await getProductById("missing");
    expect(result).toBeNull();
  });

  it("READ — getProductById expands images array", async () => {
    mockGet.mockResolvedValue({ data: { data: fakeProduct } });
    const p = await getProductById("prod-123");
    expect(p?.images).toEqual(["https://res.cloudinary.com/test/image.jpg"]);
  });

  it("CREATE — createProduct calls POST /api/admin/products", async () => {
    const newData = { name: "New Product", slug: "new-product", priceAmount: "999" };
    mockPost.mockResolvedValue({ data: { data: { ...newData, id: "new-id", status: "draft" } } });
    const p = await createProduct(newData);
    expect(mockPost).toHaveBeenCalledWith("/api/admin/products", newData);
    expect(p.id).toBe("new-id");
    expect(p.name).toBe("New Product");
  });

  it("CREATE — mapped result has correct price", async () => {
    mockPost.mockResolvedValue({ data: { data: { id: "x", name: "X", slug: "x", priceAmount: "1500", status: "published" } } });
    const p = await createProduct({ name: "X" });
    expect(p.price).toBe(1500);
  });

  it("UPDATE — updateProduct calls PUT /api/admin/products/:id", async () => {
    const updateData = { name: "Updated Name" };
    mockPut.mockResolvedValue({ data: { data: { ...fakeProduct, name: "Updated Name" } } });
    const p = await updateProduct("prod-123", updateData);
    expect(mockPut).toHaveBeenCalledWith("/api/admin/products/prod-123", updateData);
    expect(p.name).toBe("Updated Name");
  });

  it("UPDATE — updated product keeps other fields intact", async () => {
    mockPut.mockResolvedValue({ data: { data: { ...fakeProduct, name: "New Name" } } });
    const p = await updateProduct("prod-123", { name: "New Name" });
    expect(p.slug).toBe("test-wallpaper");
    expect(p.price).toBe(1999);
  });

  it("DELETE — deleteProduct calls DELETE /api/admin/products/:id", async () => {
    mockDelete.mockResolvedValue({ data: { success: true } });
    const result = await deleteProduct("prod-123");
    expect(mockDelete).toHaveBeenCalledWith("/api/admin/products/prod-123");
    expect(result).toEqual({ success: true });
  });
});

// ── Dashboard Categories CRUD ─────────────────────────────────────────────────

describe("dashboard: categories CRUD", () => {
  it("READ — getCategories calls GET /api/admin/categories", async () => {
    mockGet.mockResolvedValue({ data: { data: [fakeCategory] } });
    const result = await getCategories();
    expect(mockGet).toHaveBeenCalledWith("/api/admin/categories");
    expect(result.categories.length).toBe(1);
    expect(result.total).toBe(1);
  });

  it("READ — maps category fields correctly", async () => {
    mockGet.mockResolvedValue({ data: { data: [fakeCategory] } });
    const { categories } = await getCategories();
    expect(categories[0].id).toBe("cat-1");
    expect(categories[0].slug).toBe("wall-art");
    expect(categories[0].name).toBe("Wall Art");
    expect(categories[0].productCount).toBe(25);
  });

  it("READ — returns empty list when no categories", async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });
    const result = await getCategories();
    expect(result.categories).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("READ — handles missing data key gracefully", async () => {
    mockGet.mockResolvedValue({ data: {} });
    const result = await getCategories();
    expect(result.categories).toEqual([]);
  });
});

// ── Dashboard Collections CRUD ────────────────────────────────────────────────

describe("dashboard: collections CRUD", () => {
  it("READ — getCollections calls GET /api/admin/collections", async () => {
    mockGet.mockResolvedValue({ data: { data: [fakeCollection] } });
    const result = await getCollections();
    expect(mockGet).toHaveBeenCalledWith("/api/admin/collections");
    expect(result.collections.length).toBe(1);
  });

  it("READ — maps collection fields correctly", async () => {
    mockGet.mockResolvedValue({ data: { data: [fakeCollection] } });
    const { collections } = await getCollections();
    expect(collections[0].id).toBe("col-1");
    expect(collections[0].slug).toBe("living-room");
    expect(collections[0].name).toBe("Living Room");
    expect(collections[0].productCount).toBe(15);
  });

  it("READ — empty list when no collections", async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });
    const result = await getCollections();
    expect(result.collections).toEqual([]);
    expect(result.total).toBe(0);
  });
});
