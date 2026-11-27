import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import {
  orders,
  orderItems,
  orderAddresses,
  payments,
  discounts,
  couponUsages,
} from "@dec-walls/db/schema";
import { eq, sql } from "drizzle-orm";
import { buildOrderNumber, calcOrderTotals, checkoutSchema, type CheckoutInput } from "./_checkout-helpers";
import { getSignedInUser, resolveCustomerId } from "./_checkout-customer";
import { validateCoupon, calcCouponDiscount } from "../coupons/_coupon-helpers";

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

  // signed-in customers order under their own account; guests are matched by email
  const user = await getSignedInUser().catch(() => null);
  const customerId = await resolveCustomerId(db, user, {
    email: input.contact.email,
    fullName: input.shipping.fullName,
    phone: input.contact.phone,
  });

  // server-side coupon validation — ignore client-sent discount
  let validatedDiscount = 0;
  let couponId: string | null = null;
  if (input.couponCode) {
    const code = input.couponCode.trim().toUpperCase();
    const [couponRow] = await db
      .select({
        id: discounts.id,
        code: discounts.code,
        type: discounts.type,
        value: discounts.value,
        isActive: discounts.isActive,
        startsAt: discounts.startsAt,
        endsAt: discounts.endsAt,
        minOrderAmount: discounts.minOrderAmount,
        usageLimit: discounts.usageLimit,
        totalUsages: sql<number>`(select count(*) from coupon_usages where coupon_id = ${discounts.id})`,
      })
      .from(discounts)
      .where(eq(discounts.code, code));

    if (!couponRow) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 });
    }

    const coupon = {
      ...couponRow,
      value: Number(couponRow.value),
      minOrderAmount: Number(couponRow.minOrderAmount),
      totalUsages: Number(couponRow.totalUsages),
    };

    const result = validateCoupon(coupon, subtotal);
    if (!result.valid) {
      return NextResponse.json({ error: result.message ?? "Invalid coupon" }, { status: 400 });
    }

    validatedDiscount = result.discountAmount;
    couponId = couponRow.id;
  }

  const { shipping, total, discount } = calcOrderTotals(subtotal, validatedDiscount);

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

  const insertPromises: Promise<unknown>[] = [
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
  ];

  if (couponId && customerId && discount > 0) {
    insertPromises.push(
      db.insert(couponUsages).values({
        couponId,
        orderId: order.id,
        customerId,
        discountAmount: String(discount),
      })
    );
  }

  await Promise.all(insertPromises);

  return NextResponse.json({ orderNumber: order.number, orderId: order.id });
}
