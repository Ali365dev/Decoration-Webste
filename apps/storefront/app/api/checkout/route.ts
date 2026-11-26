import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import {
  orders,
  orderItems,
  orderAddresses,
  payments,
  customers,
} from "@dec-walls/db/schema";
import { eq } from "drizzle-orm";
import { buildOrderNumber, calcOrderTotals, checkoutSchema, type CheckoutInput } from "./_checkout-helpers";

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let input: CheckoutInput;
  try {
    input = checkoutSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const subtotal = input.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const { shipping, total, discount } = calcOrderTotals(subtotal, input.discount);

  // find or create customer by email
  let customerId: string | null = null;
  const [existing] = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, input.contact.email));
  if (existing) {
    customerId = existing.id;
  } else {
    const [created] = await db.insert(customers).values({
      email: input.contact.email,
      fullName: input.shipping.fullName,
      phone: input.contact.phone,
    }).returning({ id: customers.id });
    customerId = created?.id ?? null;
  }

  const number = buildOrderNumber();
  const idempotencyKey = `${input.contact.email}:${number}`;

  let order: { id: string; number: string } | undefined;
  try {
    const [inserted] = await db.insert(orders).values({
      number,
      customerId,
      email: input.contact.email,
      status: "pending",
      currency: "PKR",
      subtotalAmount: String(subtotal),
      shippingAmount: String(shipping),
      totalAmount: String(total),
      contactName: input.shipping.fullName,
      contactPhone: input.contact.phone,
      whatsapp: input.contact.whatsapp || null,
      discountAmount: String(discount),
      couponCode: input.couponCode || null,
      shippingZoneName: "Standard",
      estimatedDays: 5,
      idempotencyKey,
    }).returning({ id: orders.id, number: orders.number });
    order = inserted;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("orders_idempotency_uq") || msg.includes("unique")) {
      const [existing] = await db
        .select({ id: orders.id, number: orders.number })
        .from(orders)
        .where(eq(orders.idempotencyKey, idempotencyKey));
      if (existing) return NextResponse.json({ orderNumber: existing.number, orderId: existing.id });
    }
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  if (!order) return NextResponse.json({ error: "Failed to create order" }, { status: 500 });

  await Promise.all([
    db.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: order.id,
        variantId: item.id.length === 36 ? item.id : null,
        title: item.name,
        variantTitle: item.size ?? item.name,
        sku: item.id,
        quantity: item.quantity,
        unitPriceAmount: String(item.price),
        imageUrl: item.imageUrl,
      }))
    ),
    db.insert(orderAddresses).values({
      orderId: order.id,
      type: "shipping",
      fullName: input.shipping.fullName,
      line1: input.shipping.address,
      city: input.shipping.city,
      region: input.shipping.province,
      country: "PK",
      phone: input.shipping.phone || input.contact.phone,
      area: input.shipping.area || null,
      instructions: input.shipping.instructions || null,
    }),
    db.insert(payments).values({
      orderId: order.id,
      provider: "manual",
      status: "pending",
      method: input.paymentMethod,
      amount: String(total),
      currency: "PKR",
    }),
  ]);

  return NextResponse.json({ orderNumber: order.number, orderId: order.id });
}
