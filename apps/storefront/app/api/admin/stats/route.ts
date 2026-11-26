import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { orders, customers, products } from "@dec-walls/db/schema";
import { sql, gte, eq } from "drizzle-orm";
import { guardAdmin } from "../_guard";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  // Today's date in PKT (UTC+5)
  const pktOffsetMs = 5 * 60 * 60 * 1000;
  const nowPKT = new Date(Date.now() + pktOffsetMs);
  const todayPKT = new Date(Date.UTC(nowPKT.getUTCFullYear(), nowPKT.getUTCMonth(), nowPKT.getUTCDate()));

  const [todaySummary] = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
      revenue: sql<number>`coalesce(sum(total_amount::numeric), 0)`.mapWith(Number),
    })
    .from(orders)
    .where(gte(orders.createdAt, todayPKT));

  const [pending] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(orders)
    .where(eq(orders.status, "pending"));

  const [processing] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(orders)
    .where(eq(orders.status, "processing"));

  const [totalOrders] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(orders);

  const [totalCustomers] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(customers);

  const [totalProducts] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(products);

  return NextResponse.json({
    today: {
      count: todaySummary?.count ?? 0,
      revenue: todaySummary?.revenue ?? 0,
      pendingCount: pending?.count ?? 0,
      processingCount: processing?.count ?? 0,
    },
    totals: {
      orders: totalOrders?.count ?? 0,
      customers: totalCustomers?.count ?? 0,
      products: totalProducts?.count ?? 0,
    },
  });
}
