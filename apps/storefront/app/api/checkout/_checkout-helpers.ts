export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  size?: string;
}

export interface CheckoutInput {
  contact: { email: string; phone: string; whatsapp: string };
  shipping: { fullName: string; province: string; city: string; area: string; address: string; instructions: string; phone: string };
  paymentMethod: "cod" | "bank" | "jazzcash" | "easypaisa";
  items: CheckoutItem[];
  couponCode: string;
  discount: number;
}

const SHIPPING_FEE = 200;
const FREE_SHIPPING_THRESHOLD = 5000;

export function buildOrderNumber(): string {
  return `DW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export function calcOrderTotals(subtotal: number, discount: number): { subtotal: number; discount: number; shipping: number; total: number } {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, discount, shipping, total: subtotal + shipping - discount };
}

export function mapCheckoutToOrder(input: CheckoutInput) {
  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const { shipping, total } = calcOrderTotals(subtotal, input.discount);

  return {
    email: input.contact.email,
    contactName: input.shipping.fullName,
    contactPhone: input.contact.phone,
    whatsapp: input.contact.whatsapp || null,
    status: "pending" as const,
    currency: "PKR",
    subtotalAmount: subtotal,
    shippingAmount: shipping,
    discountAmount: input.discount,
    totalAmount: total,
    couponCode: input.couponCode || null,
    shippingZoneName: "Standard",
    estimatedDays: 5,
    idempotencyKey: `${input.contact.email}:${Date.now()}`,
  };
}
