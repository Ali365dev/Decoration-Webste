import { describe, it, expect } from "vitest";
import { validateCoupon, calcCouponDiscount, type CouponRow } from "../../apps/storefront/app/api/coupons/_coupon-helpers";

const now = new Date("2026-11-26T12:00:00Z");

const baseCoupon: CouponRow = {
  id: "c-1",
  code: "TEST10",
  type: "percentage",
  value: 10,
  isActive: 1,
  startsAt: null,
  endsAt: null,
  minOrderAmount: 0,
  usageLimit: null,
  totalUsages: 0,
};

describe("validateCoupon", () => {
  it("accepts a valid percentage coupon with no restrictions", () => {
    const result = validateCoupon(baseCoupon, 5000, now);
    expect(result.valid).toBe(true);
    expect(result.message).toBeNull();
  });

  it("rejects an inactive coupon", () => {
    const result = validateCoupon({ ...baseCoupon, isActive: 0 }, 5000, now);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/invalid/i);
  });

  it("rejects a coupon that has not started yet", () => {
    const future = new Date("2026-12-01T00:00:00Z");
    const result = validateCoupon({ ...baseCoupon, startsAt: future }, 5000, now);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/not yet active/i);
  });

  it("rejects a coupon that has expired", () => {
    const past = new Date("2026-11-01T00:00:00Z");
    const result = validateCoupon({ ...baseCoupon, endsAt: past }, 5000, now);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/expired/i);
  });

  it("rejects when subtotal is below minimum order amount", () => {
    const result = validateCoupon({ ...baseCoupon, minOrderAmount: 3000 }, 2000, now);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/minimum/i);
  });

  it("rejects when usage limit is exhausted", () => {
    const result = validateCoupon({ ...baseCoupon, usageLimit: 10, totalUsages: 10 }, 5000, now);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/expired/i);
  });

  it("accepts when usage count is below the limit", () => {
    const result = validateCoupon({ ...baseCoupon, usageLimit: 10, totalUsages: 9 }, 5000, now);
    expect(result.valid).toBe(true);
  });
});

describe("calcCouponDiscount", () => {
  it("calculates percentage discount correctly", () => {
    expect(calcCouponDiscount({ ...baseCoupon, type: "percentage", value: 10 }, 5000)).toBe(500);
  });

  it("rounds percentage discount to nearest integer", () => {
    expect(calcCouponDiscount({ ...baseCoupon, type: "percentage", value: 10 }, 1555)).toBe(156);
  });

  it("returns fixed discount amount as-is", () => {
    expect(calcCouponDiscount({ ...baseCoupon, type: "fixed", value: 500 }, 5000)).toBe(500);
  });

  it("caps fixed discount at subtotal", () => {
    expect(calcCouponDiscount({ ...baseCoupon, type: "fixed", value: 9999 }, 2000)).toBe(2000);
  });
});
