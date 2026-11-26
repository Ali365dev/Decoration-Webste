import { describe, expect, it, beforeEach } from "vitest";
import { listOrders, getOrderById, createCheckoutOrder } from "../../packages/domain/src/checkout";
import { getOrCreateCart, addToCart } from "../../packages/domain/src/cart";
import { listProducts } from "../../packages/domain/src/catalog";

// ── Orders (domain layer — storefront + dashboard both read this) ────────────

describe("orders", () => {
  it("listOrders returns an array", async () => {
    const orders = await listOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  it("getOrderById returns null for unknown id", async () => {
    const order = await getOrderById("non-existent-id");
    expect(order).toBeNull();
  });

  it("creates an order from a cart with items", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const product = products.items[0];
    const variantId = product.variants?.[0]?.id ?? `${product.id}-default`;

    const cart = await getOrCreateCart();
    await addToCart(cart.id, { variantId, quantity: 1 });

    const { order } = await createCheckoutOrder({
      cartId: cart.id,
      email: "test@example.com",
      shippingAddress: {
        fullName: "Test User",
        line1: "123 Test St",
        city: "Lahore",
        country: "PK",
      },
    });

    expect(order.id).toBeTruthy();
    expect(order.number).toMatch(/^DW-/);
    expect(order.status).toBe("paid");
    expect(order.total.amount).toBeGreaterThan(0);
    expect(order.total.currency).toBe("PKR");
  });

  it("created order is retrievable by id", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const variantId = products.items[0].variants?.[0]?.id ?? `${products.items[0].id}-default`;

    const cart = await getOrCreateCart();
    await addToCart(cart.id, { variantId, quantity: 1 });

    const { order } = await createCheckoutOrder({
      cartId: cart.id,
      email: "lookup@example.com",
      shippingAddress: { fullName: "Lookup Test", line1: "1 Lookup Rd", city: "Karachi", country: "PK" },
    });

    const found = await getOrderById(order.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(order.id);
    expect(found?.number).toBe(order.number);
  });

  it("throws when cart is empty", async () => {
    const cart = await getOrCreateCart();
    await expect(
      createCheckoutOrder({
        cartId: cart.id,
        email: "empty@example.com",
        shippingAddress: { fullName: "Empty", line1: "0 Empty St", city: "Islamabad", country: "PK" },
      })
    ).rejects.toThrow("Cart is empty");
  });

  it("order number increments across orders", async () => {
    const products = await listProducts({ page: 1, pageSize: 1 });
    const variantId = products.items[0].variants?.[0]?.id ?? `${products.items[0].id}-default`;

    const cart1 = await getOrCreateCart();
    await addToCart(cart1.id, { variantId, quantity: 1 });
    const { order: o1 } = await createCheckoutOrder({
      cartId: cart1.id, email: "a@a.com",
      shippingAddress: { fullName: "A", line1: "1 A", city: "Lahore", country: "PK" },
    });

    const cart2 = await getOrCreateCart();
    await addToCart(cart2.id, { variantId, quantity: 1 });
    const { order: o2 } = await createCheckoutOrder({
      cartId: cart2.id, email: "b@b.com",
      shippingAddress: { fullName: "B", line1: "1 B", city: "Lahore", country: "PK" },
    });

    const n1 = parseInt(o1.number.replace("DW-", ""));
    const n2 = parseInt(o2.number.replace("DW-", ""));
    expect(n2).toBeGreaterThan(n1);
  });
});
