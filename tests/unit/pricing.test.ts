import { describe, expect, it } from "vitest";
import {
  applyPercentDiscount,
  applyFixedDiscount,
  calcShipping,
  calcOrderTotals,
  type CartLine,
  type ShippingZone,
} from "../../packages/domain/src/pricing";

const zone: ShippingZone = {
  id: "zone-1",
  name: "Standard",
  rate: 200,
  freeThreshold: 5000,
};

describe("applyPercentDiscount", () => {
  it("reduces subtotal by the given percentage", () => {
    expect(applyPercentDiscount(1000, 10)).toBe(900);
  });

  it("floors at zero (discount cannot exceed subtotal)", () => {
    expect(applyPercentDiscount(500, 150)).toBe(0);
  });

  it("rounds down to nearest rupee", () => {
    expect(applyPercentDiscount(999, 10)).toBe(899); // 999 * 0.9 = 899.1 → 899
  });
});

describe("applyFixedDiscount", () => {
  it("subtracts a flat amount", () => {
    expect(applyFixedDiscount(1000, 200)).toBe(800);
  });

  it("floors at zero", () => {
    expect(applyFixedDiscount(100, 300)).toBe(0);
  });
});

describe("calcShipping", () => {
  it("charges the zone rate when subtotal is below threshold", () => {
    expect(calcShipping(4999, zone)).toBe(200);
  });

  it("gives free shipping at or above the threshold", () => {
    expect(calcShipping(5000, zone)).toBe(0);
    expect(calcShipping(10000, zone)).toBe(0);
  });

  it("charges zone rate when there is no threshold", () => {
    const noThreshold: ShippingZone = { id: "z2", name: "Express", rate: 400 };
    expect(calcShipping(99999, noThreshold)).toBe(400);
  });
});

describe("calcOrderTotals", () => {
  const lines: CartLine[] = [
    { variantId: "v1", quantity: 2, unitPrice: 1500 },
    { variantId: "v2", quantity: 1, unitPrice: 800 },
  ];

  it("computes subtotal as sum of quantity × unit price", () => {
    const { subtotal } = calcOrderTotals(lines, zone);
    expect(subtotal).toBe(3800); // 2*1500 + 1*800
  });

  it("applies percent coupon before shipping", () => {
    const { discount, total } = calcOrderTotals(lines, zone, {
      type: "percent",
      value: 10,
    });
    expect(discount).toBe(380); // 10% of 3800
    // subtotal 3800 - 380 = 3420 < 5000 threshold → shipping 200
    expect(total).toBe(3620);
  });

  it("applies fixed coupon before shipping", () => {
    const { discount, total } = calcOrderTotals(lines, zone, {
      type: "fixed",
      value: 500,
    });
    expect(discount).toBe(500);
    // 3800 - 500 = 3300 < 5000 → shipping 200
    expect(total).toBe(3500);
  });

  it("gives free shipping when discounted subtotal meets threshold", () => {
    const bigLines: CartLine[] = [{ variantId: "v3", quantity: 1, unitPrice: 5000 }];
    const { shipping } = calcOrderTotals(bigLines, zone);
    expect(shipping).toBe(0);
  });
});
