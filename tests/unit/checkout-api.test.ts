import { describe, it, expect } from "vitest";
import { buildOrderNumber, calcOrderTotals, mapCheckoutToOrder } from "../../apps/storefront/app/api/checkout/_checkout-helpers";

describe("buildOrderNumber", () => {
  it("starts with DW-", () => {
    expect(buildOrderNumber()).toMatch(/^DW-/);
  });

  it("produces unique values", () => {
    const a = buildOrderNumber();
    const b = buildOrderNumber();
    expect(a).not.toBe(b);
  });
});

describe("calcOrderTotals", () => {
  it("shipping is 0 when subtotal >= 5000", () => {
    const { shipping } = calcOrderTotals(5000, 0);
    expect(shipping).toBe(0);
  });

  it("shipping is 200 when subtotal < 5000", () => {
    const { shipping } = calcOrderTotals(4999, 0);
    expect(shipping).toBe(200);
  });

  it("total = subtotal + shipping - discount", () => {
    const { total } = calcOrderTotals(3000, 500);
    expect(total).toBe(3000 + 200 - 500);
  });

  it("caps discount at subtotal so total is never negative", () => {
    const { total, discount } = calcOrderTotals(1000, 9999);
    expect(discount).toBe(1000);
    expect(total).toBeGreaterThanOrEqual(0);
  });

  it("caps discount at subtotal even after shipping is added", () => {
    // subtotal 500, shipping 200, raw discount 9999 → discount capped at 500 → total = 500 + 200 - 500 = 200
    const { total } = calcOrderTotals(500, 9999);
    expect(total).toBe(200);
  });
});

describe("mapCheckoutToOrder", () => {
  const base = {
    contact: { email: "buyer@example.com", phone: "03001234567", whatsapp: "" },
    shipping: { fullName: "Ali Raza", province: "punjab", city: "Lahore", area: "Gulberg", address: "12 Main Blvd", instructions: "", phone: "" },
    paymentMethod: "cod" as const,
    items: [{ id: "v1", name: "Duvet Cover", price: 2000, quantity: 2, imageUrl: null, size: "King" }],
    couponCode: "",
    discount: 0,
  };

  it("sets email from contact", () => {
    const { email } = mapCheckoutToOrder(base);
    expect(email).toBe("buyer@example.com");
  });

  it("sets contactName and contactPhone", () => {
    const order = mapCheckoutToOrder(base);
    expect(order.contactName).toBe("Ali Raza");
    expect(order.contactPhone).toBe("03001234567");
  });

  it("sets status to pending", () => {
    expect(mapCheckoutToOrder(base).status).toBe("pending");
  });

  it("computes subtotal from items", () => {
    expect(mapCheckoutToOrder(base).subtotalAmount).toBe(4000);
  });
});
