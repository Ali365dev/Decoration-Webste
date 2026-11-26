/**
 * Storefront CRUD tests — domain layer
 * Covers: Cart, Products (admin read), Orders, Categories, Collections, Wishlist
 */
import { describe, expect, it, beforeEach } from "vitest";
import {
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItemQuantity,
  clearCart,
} from "../../packages/domain/src/cart";
import {
  listProducts,
  getProductBySlug,
  listCategories,
  listCollections,
  getCollectionProducts,
  listAllProductsAdmin,
} from "../../packages/domain/src/catalog";
import {
  createCheckoutOrder,
  listOrders,
  getOrderById,
} from "../../packages/domain/src/checkout";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
  clearWishlist,
} from "../../packages/domain/src/wishlist";

// ── Cart CRUD ────────────────────────────────────────────────────────────────

describe("storefront: cart CRUD", () => {
  it("CREATE — creates a new cart", async () => {
    const cart = await getOrCreateCart();
    expect(cart.id).toBeTruthy();
    expect(cart.items).toEqual([]);
    expect(cart.subtotal.amount).toBe(0);
  });

  it("READ — gets an existing cart by id", async () => {
    const cart = await getOrCreateCart();
    const fetched = await getCart(cart.id);
    expect(fetched?.id).toBe(cart.id);
  });

  it("READ — returns null for unknown cart id", async () => {
    const fetched = await getCart("non-existent-cart-id");
    expect(fetched).toBeNull();
  });

  it("UPDATE — adds an item to cart", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const variantId = products.items[0].id;
    const cart = await getOrCreateCart();
    const updated = await addToCart(cart.id, { variantId, quantity: 2 });
    expect(updated.items.length).toBe(1);
    expect(updated.items[0].quantity).toBe(2);
    expect(updated.subtotal.amount).toBeGreaterThan(0);
  });

  it("UPDATE — adding same item twice increases quantity", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const variantId = products.items[0].id;
    const cart = await getOrCreateCart();
    await addToCart(cart.id, { variantId, quantity: 1 });
    const updated = await addToCart(cart.id, { variantId, quantity: 3 });
    expect(updated.items.length).toBe(1);
    expect(updated.items[0].quantity).toBe(4);
  });

  it("UPDATE — updates item quantity via updateCartItemQuantity", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const variantId = products.items[0].id;
    const cart = await getOrCreateCart();
    const withItem = await addToCart(cart.id, { variantId, quantity: 2 });
    const itemId = withItem.items[0].id;
    const updated = await updateCartItemQuantity(cart.id, itemId, 5);
    expect(updated.items[0].quantity).toBe(5);
  });

  it("DELETE — removing item by setting quantity to 0 empties cart", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const variantId = products.items[0].id;
    const cart = await getOrCreateCart();
    const withItem = await addToCart(cart.id, { variantId, quantity: 1 });
    const itemId = withItem.items[0].id;
    const updated = await updateCartItemQuantity(cart.id, itemId, 0);
    expect(updated.items).toEqual([]);
    expect(updated.subtotal.amount).toBe(0);
  });

  it("DELETE — clearCart empties all items", async () => {
    const products = await listProducts({ page: 1, pageSize: 2 });
    const cart = await getOrCreateCart();
    for (const p of products.items) {
      await addToCart(cart.id, { variantId: p.id, quantity: 1 });
    }
    const cleared = await clearCart(cart.id);
    expect(cleared.items).toEqual([]);
    expect(cleared.subtotal.amount).toBe(0);
  });

  it("subtotal recalculates correctly after quantity change", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const p = products.items[0];
    const cart = await getOrCreateCart();
    const withItem = await addToCart(cart.id, { variantId: p.id, quantity: 1 });
    const qty1 = withItem.subtotal.amount;
    const itemId = withItem.items[0].id;
    const withTwo = await updateCartItemQuantity(cart.id, itemId, 2);
    expect(withTwo.subtotal.amount).toBeCloseTo(qty1 * 2, 0);
  });
});

// ── Product CRUD (storefront read + admin read) ──────────────────────────────

describe("storefront: product CRUD", () => {
  it("READ — list published products", async () => {
    const result = await listProducts({ page: 1, pageSize: 10 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("READ — get product by slug", async () => {
    const all = await listProducts({ page: 1, pageSize: 1 });
    const slug = all.items[0].slug;
    const p = await getProductBySlug(slug);
    expect(p).not.toBeNull();
    expect(p?.slug).toBe(slug);
    expect(p?.name).toBeTruthy();
    expect(p?.price.amount).toBeGreaterThan(0);
  });

  it("READ — returns null for nonexistent slug", async () => {
    expect(await getProductBySlug("does-not-exist-xyz")).toBeNull();
  });

  it("READ — admin list includes all products (not just published)", async () => {
    const admin = await listAllProductsAdmin();
    const store = await listProducts({ page: 1, pageSize: 1 });
    expect(admin.length).toBeGreaterThanOrEqual(store.total);
  });

  it("READ — product has all required fields for storefront display", async () => {
    const all = await listProducts({ page: 1, pageSize: 5 });
    for (const p of all.items) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.price.amount).toBeGreaterThan(0);
      expect(p.price.currency).toBe("PKR");
    }
  });

  it("READ — search narrows the product list", async () => {
    const all = await listProducts({ page: 1, pageSize: 100 });
    const q = all.items[0].name.split(" ")[0];
    const filtered = await listProducts({ page: 1, pageSize: 100, q });
    expect(filtered.total).toBeLessThanOrEqual(all.total);
  });
});

// ── Category CRUD ────────────────────────────────────────────────────────────

describe("storefront: category CRUD", () => {
  it("READ — lists all categories", async () => {
    const cats = await listCategories();
    expect(cats.length).toBeGreaterThan(0);
  });

  it("READ — each category has id, slug, name", async () => {
    const cats = await listCategories();
    for (const c of cats) {
      expect(c.id).toBeTruthy();
      expect(c.slug).toBeTruthy();
      expect(c.name).toBeTruthy();
    }
  });

  it("READ — no duplicate category ids", async () => {
    const cats = await listCategories();
    const ids = cats.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Collection CRUD ──────────────────────────────────────────────────────────

describe("storefront: collection CRUD", () => {
  it("READ — lists all collections", async () => {
    const cols = await listCollections();
    expect(cols.length).toBeGreaterThan(0);
  });

  it("READ — gets products for a collection", async () => {
    const cols = await listCollections();
    const products = await getCollectionProducts(cols[0].slug);
    expect(Array.isArray(products)).toBe(true);
  });

  it("READ — no duplicate collection ids", async () => {
    const cols = await listCollections();
    const ids = cols.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Order CRUD ───────────────────────────────────────────────────────────────

describe("storefront: order CRUD", () => {
  async function placeTestOrder(email = "test@dec-walls.com") {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const p = products.items[0];
    const cart = await getOrCreateCart();
    await addToCart(cart.id, { variantId: p.id, quantity: 1 });
    return createCheckoutOrder({
      cartId: cart.id,
      email,
      shippingAddress: { fullName: "Test User", line1: "1 Test Rd", city: "Lahore", country: "PK" },
    });
  }

  it("CREATE — places an order and returns it", async () => {
    const { order } = await placeTestOrder();
    expect(order.id).toBeTruthy();
    expect(order.number).toMatch(/^DW-/);
    expect(order.status).toBe("paid");
    expect(order.total.amount).toBeGreaterThan(0);
  });

  it("READ — order appears in listOrders", async () => {
    const { order } = await placeTestOrder("list@test.com");
    const all = await listOrders();
    expect(all.some((o) => o.id === order.id)).toBe(true);
  });

  it("READ — getOrderById returns the correct order", async () => {
    const { order } = await placeTestOrder("byid@test.com");
    const found = await getOrderById(order.id);
    expect(found?.id).toBe(order.id);
    expect(found?.number).toBe(order.number);
    expect(found?.total.amount).toBe(order.total.amount);
  });

  it("READ — getOrderById returns null for unknown id", async () => {
    expect(await getOrderById("unknown-id-xyz")).toBeNull();
  });

  it("CREATE — clears cart after checkout", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const cart = await getOrCreateCart();
    await addToCart(cart.id, { variantId: products.items[0].id, quantity: 1 });
    await createCheckoutOrder({
      cartId: cart.id,
      email: "clear@test.com",
      shippingAddress: { fullName: "Clear Test", line1: "1 Clear St", city: "Karachi", country: "PK" },
    });
    const clearedCart = await getCart(cart.id);
    expect(clearedCart?.items ?? []).toEqual([]);
  });

  it("CREATE — rejects empty cart", async () => {
    const cart = await getOrCreateCart();
    await expect(
      createCheckoutOrder({
        cartId: cart.id,
        email: "empty@test.com",
        shippingAddress: { fullName: "Empty", line1: "1 Empty", city: "Islamabad", country: "PK" },
      })
    ).rejects.toThrow();
  });
});

// ── Wishlist CRUD ────────────────────────────────────────────────────────────

describe("storefront: wishlist CRUD", () => {
  const uid = `crud-user-${Math.random().toString(36).slice(2)}`;
  let slug: string;

  beforeEach(async () => {
    await clearWishlist(uid);
    const products = await listProducts({ page: 1, pageSize: 1 });
    slug = products.items[0].slug;
  });

  it("CREATE — adds a product", async () => {
    await addToWishlist(uid, slug);
    expect(await isInWishlist(uid, slug)).toBe(true);
  });

  it("READ — getWishlist returns added product", async () => {
    await addToWishlist(uid, slug);
    const list = await getWishlist(uid);
    expect(list.length).toBe(1);
    expect(list[0].slug).toBe(slug);
  });

  it("DELETE — removes a product", async () => {
    await addToWishlist(uid, slug);
    await removeFromWishlist(uid, slug);
    expect(await isInWishlist(uid, slug)).toBe(false);
    expect(await getWishlist(uid)).toEqual([]);
  });

  it("DELETE — clearWishlist removes all", async () => {
    const products = await listProducts({ page: 1, pageSize: 3 });
    for (const p of products.items) await addToWishlist(uid, p.slug);
    await clearWishlist(uid);
    expect(await getWishlist(uid)).toEqual([]);
  });
});
