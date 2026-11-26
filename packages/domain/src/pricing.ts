export interface CartLine {
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingZone {
  id: string;
  name: string;
  rate: number;
  freeThreshold?: number;
}

export interface CouponDiscount {
  type: "percent" | "fixed";
  value: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export function applyPercentDiscount(subtotal: number, percent: number): number {
  return Math.max(0, Math.floor(subtotal * (1 - percent / 100)));
}

export function applyFixedDiscount(subtotal: number, amount: number): number {
  return Math.max(0, subtotal - amount);
}

export function calcShipping(subtotal: number, zone: ShippingZone): number {
  if (zone.freeThreshold !== undefined && subtotal >= zone.freeThreshold) return 0;
  return zone.rate;
}

export function calcOrderTotals(
  lines: CartLine[],
  zone: ShippingZone,
  coupon?: CouponDiscount,
): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  let discountedSubtotal = subtotal;
  let discount = 0;
  if (coupon) {
    if (coupon.type === "percent") {
      discountedSubtotal = applyPercentDiscount(subtotal, coupon.value);
    } else {
      discountedSubtotal = applyFixedDiscount(subtotal, coupon.value);
    }
    discount = subtotal - discountedSubtotal;
  }

  const shipping = calcShipping(discountedSubtotal, zone);
  return {
    subtotal,
    discount,
    shipping,
    total: discountedSubtotal + shipping,
  };
}
