import { describe, it, expect } from "vitest";
import { checkoutSchema, calcOrderTotals, buildOrderNumber } from "../../apps/storefront/app/api/checkout/_checkout-helpers";

const validInput = {
  contact: { email: "buyer@example.com", phone: "03001234567", whatsapp: "" },
  shipping: {
    fullName: "Ali Raza",
    province: "Punjab",
    city: "Lahore",
    area: "Gulberg",
    address: "12 Main Blvd",
    instructions: "",
    phone: "",
  },
  paymentMethod: "cod" as const,
  items: [
    { id: "v-001", name: "Duvet Cover", price: 3500, quantity: 1, imageUrl: null },
    { id: "v-002", name: "Pillow Case", price: 800, quantity: 2, imageUrl: null },
  ],
  couponCode: "",
  discount: 0,
};

describe("checkoutSchema validation", () => {
  it("accepts a valid checkout payload", () => {
    expect(() => checkoutSchema.parse(validInput)).not.toThrow();
  });

  it("rejects an empty items array", () => {
    expect(() => checkoutSchema.parse({ ...validInput, items: [] })).toThrow();
  });

  it("rejects more than 50 items", () => {
    const items = Array.from({ length: 51 }, (_, i) => ({
      id: `v-${i}`, name: "Item", price: 100, quantity: 1, imageUrl: null,
    }));
    expect(() => checkoutSchema.parse({ ...validInput, items })).toThrow();
  });

  it("rejects quantity over 100", () => {
    const items = [{ id: "v-001", name: "Item", price: 100, quantity: 101, imageUrl: null }];
    expect(() => checkoutSchema.parse({ ...validInput, items })).toThrow();
  });

  it("rejects an invalid email", () => {
    const bad = { ...validInput, contact: { ...validInput.contact, email: "not-an-email" } };
    expect(() => checkoutSchema.parse(bad)).toThrow();
  });

  it("rejects an unknown payment method", () => {
    expect(() => checkoutSchema.parse({ ...validInput, paymentMethod: "crypto" })).toThrow();
  });

  it("accepts all supported payment methods", () => {
    for (const method of ["cod", "bank", "jazzcash", "easypaisa"] as const) {
      expect(() => checkoutSchema.parse({ ...validInput, paymentMethod: method })).not.toThrow();
    }
  });
});

describe("checkout pipeline — validation + totals", () => {
  it("produces correct subtotal and free shipping above 5000", () => {
    const parsed = checkoutSchema.parse(validInput);
    const subtotal = parsed.items.reduce((s, i) => s + i.price * i.quantity, 0);
    expect(subtotal).toBe(3500 + 800 * 2); // 5100

    const { shipping, total } = calcOrderTotals(subtotal, parsed.discount);
    expect(shipping).toBe(0); // >= 5000, free
    expect(total).toBe(5100);
  });

  it("adds 200 shipping when subtotal is under 5000", () => {
    const small = { ...validInput, items: [{ id: "v-001", name: "Item", price: 1000, quantity: 1, imageUrl: null }] };
    const parsed = checkoutSchema.parse(small);
    const subtotal = parsed.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const { shipping } = calcOrderTotals(subtotal, 0);
    expect(shipping).toBe(200);
  });

  it("caps discount at subtotal (no negative totals)", () => {
    const withDiscount = checkoutSchema.parse({ ...validInput, discount: 99999 });
    const subtotal = withDiscount.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const { total } = calcOrderTotals(subtotal, withDiscount.discount);
    expect(total).toBeGreaterThanOrEqual(0);
  });

  it("generates a unique order number per checkout", () => {
    const a = buildOrderNumber();
    const b = buildOrderNumber();
    expect(a).toMatch(/^DW-/);
    expect(a).not.toBe(b);
  });
});
