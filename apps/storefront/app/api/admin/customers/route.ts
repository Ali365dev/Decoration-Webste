import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { customers, orders } from "@dec-walls/db/schema";
import { desc, eq, ilike, sql } from "drizzle-orm";
import { guardAdmin } from "../_guard";
import { mapCustomerRow } from "../_mappers";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const rows = await db
    .select({
      id: customers.id,
      email: customers.email,
      fullName: customers.fullName,
      phone: customers.phone,
      city: sql<string>`null`,
      createdAt: customers.createdAt,
      orderCount: sql<number>`count(${orders.id})`.mapWith(Number),
      totalSpent:
        sql<number>`coalesce(sum(${orders.totalAmount}::numeric), 0)`.mapWith(Number),
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .where(q ? ilike(customers.email, `%${q}%`) : undefined)
    .groupBy(customers.id)
    .orderBy(desc(customers.createdAt))
    .limit(200);

  return NextResponse.json({
    data: rows.map(mapCustomerRow),
    total: rows.length,
  });
}
