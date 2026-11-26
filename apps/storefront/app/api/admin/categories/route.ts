import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { categories, categoryProducts } from "@dec-walls/db/schema";
import { eq, sql } from "drizzle-orm";
import { guardAdmin } from "../_guard";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      parentId: categories.parentId,
      sortOrder: categories.sortOrder,
      productCount: sql<number>`count(${categoryProducts.productId})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(categoryProducts, eq(categoryProducts.categoryId, categories.id))
    .groupBy(categories.id);

  return NextResponse.json({ data: rows });
}
