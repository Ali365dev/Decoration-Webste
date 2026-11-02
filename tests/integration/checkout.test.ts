import { describe, expect, it } from "vitest";
import { addToCart, getOrCreateCart } from "../../packages/domain/src/cart";
import { createCheckoutOrder } from "../../packages/domain/src/checkout";

describe("cart and checkout", () => {
  it("adds an item and checks out", async () => {
    const cart = await getOrCreateCart();
    const withItem = await addToCart(cart.id, {
      variantId: "p-bs-433a",
      quantity: 2,
    });
    expect(withItem.items.length).toBe(1);
    expect(withItem.subtotal.amount).toBeGreaterThan(0);

    const { order } = await createCheckoutOrder({
      cartId: cart.id,
      email: "buyer@example.com",
      shippingAddress: {
        fullName: "Test Buyer",
        line1: "1 Main St",
        city: "Lahore",
        country: "PK",
      },
    });

    expect(order.status).toBe("paid");
    expect(order.number).toMatch(/^DW-/);
  });
});
