import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { orders, orderItems, orderStatusHistory } from "@dec-walls/db/schema";
import { and, eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const number = searchParams.get("order")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!number || !email) {
    return NextResponse.json({ error: "order and email are required" }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [order] = await db
    .select({
      id: orders.id,
      number: orders.number,
      status: orders.status,
      createdAt: orders.createdAt,
      totalAmount: orders.totalAmount,
      currency: orders.currency,
      contactName: orders.contactName,
      estimatedDays: orders.estimatedDays,
    })
    .from(orders)
    .where(and(eq(orders.number, number), eq(orders.email, email)));

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const [items, history] = await Promise.all([
    db.select({ title: orderItems.title, variantTitle: orderItems.variantTitle, quantity: orderItems.quantity, unitPriceAmount: orderItems.unitPriceAmount, imageUrl: orderItems.imageUrl })
      .from(orderItems).where(eq(orderItems.orderId, order.id)),
    db.select({ toStatus: orderStatusHistory.toStatus, createdAt: orderStatusHistory.createdAt })
      .from(orderStatusHistory).where(eq(orderStatusHistory.orderId, order.id))
      .orderBy(desc(orderStatusHistory.createdAt)),
  ]);

  return NextResponse.json({
    order: {
      number: order.number,
      status: order.status,
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
      total: { amount: Number(order.totalAmount), currency: order.currency },
      contactName: order.contactName,
      estimatedDays: order.estimatedDays ?? 5,
      items: items.map((i) => ({
        title: i.title,
        variantTitle: i.variantTitle,
        quantity: i.quantity,
        unitPrice: Number(i.unitPriceAmount),
        imageUrl: i.imageUrl,
      })),
      history: history.map((h) => ({
        status: h.toStatus,
        at: h.createdAt instanceof Date ? h.createdAt.toISOString() : h.createdAt,
      })),
    },
  });
}
