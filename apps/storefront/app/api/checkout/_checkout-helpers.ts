import { z } from "zod/v4";

export const checkoutSchema = z.object({
  contact: z.object({ email: z.string().email(), phone: z.string().min(1), whatsapp: z.string() }),
  shipping: z.object({
    fullName: z.string().min(1),
    province: z.string().min(1),
    city: z.string().min(1),
    area: z.string(),
    address: z.string().min(1),
    instructions: z.string(),
    phone: z.string(),
  }),
  paymentMethod: z.enum(["cod", "bank", "jazzcash", "easypaisa"]),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().min(1).max(100),
    imageUrl: z.string().nullable(),
    size: z.string().optional(),
  })).min(1).max(50),
  couponCode: z.string(),
  discount: z.number().min(0),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutItem = CheckoutInput["items"][number];

const SHIPPING_FEE = 200;
const FREE_SHIPPING_THRESHOLD = 5000;

export function buildOrderNumber(): string {
  return `DW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export function calcOrderTotals(subtotal: number, rawDiscount: number): { subtotal: number; discount: number; shipping: number; total: number } {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = Math.min(rawDiscount, subtotal);
  return { subtotal, discount, shipping, total: subtotal + shipping - discount };
}

export function mapCheckoutToOrder(input: CheckoutInput) {
  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const { shipping, total, discount } = calcOrderTotals(subtotal, input.discount);

  return {
    email: input.contact.email,
    contactName: input.shipping.fullName,
    contactPhone: input.contact.phone,
    whatsapp: input.contact.whatsapp || null,
    status: "pending" as const,
    currency: "PKR",
    subtotalAmount: subtotal,
    shippingAmount: shipping,
    discountAmount: discount,
    totalAmount: total,
    couponCode: input.couponCode || null,
    shippingZoneName: "Standard",
    estimatedDays: 5,
    idempotencyKey: `${input.contact.email}:${Date.now()}`,
  };
}
