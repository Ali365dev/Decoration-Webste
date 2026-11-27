export interface CouponRow {
  id: string;
  code: string;
  type: string;
  value: number;
  isActive: number;
  startsAt: Date | null;
  endsAt: Date | null;
  minOrderAmount: number;
  usageLimit: number | null;
  totalUsages: number;
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  message: string | null;
}

export function validateCoupon(coupon: CouponRow, subtotal: number, now = new Date()): CouponValidationResult {
  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, message: "Invalid or inactive coupon" };
  }
  if (coupon.startsAt && coupon.startsAt > now) {
    return { valid: false, discountAmount: 0, message: "Coupon not yet active" };
  }
  if (coupon.endsAt && coupon.endsAt < now) {
    return { valid: false, discountAmount: 0, message: "Coupon has expired" };
  }
  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order of PKR ${coupon.minOrderAmount.toLocaleString()} required`,
    };
  }
  if (coupon.usageLimit !== null && coupon.totalUsages >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, message: "Coupon has expired" };
  }
  return { valid: true, discountAmount: calcCouponDiscount(coupon, subtotal), message: null };
}

export function calcCouponDiscount(coupon: Pick<CouponRow, "type" | "value">, subtotal: number): number {
  if (coupon.type === "percentage") {
    return Math.round(subtotal * coupon.value / 100);
  }
  return Math.min(coupon.value, subtotal);
}
