import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { orders, customers } from "@dec-walls/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { guardAdmin } from "../_guard";
import { mapOrderRow } from "../_mappers";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const status = searchParams.get("status");

  const rows = await db
    .select({
      id: orders.id,
      number: orders.number,
      status: orders.status,
      total: orders.totalAmount,
      createdAt: orders.createdAt,
      customerEmail: orders.email,
      customerName: customers.fullName,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(
      q
        ? or(
            ilike(orders.number, `%${q}%`),
            ilike(orders.email, `%${q}%`),
          )
        : status
          ? eq(orders.status, status as never)
          : undefined,
    )
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return NextResponse.json({
    data: rows.map(mapOrderRow),
    total: rows.length,
  });
}
