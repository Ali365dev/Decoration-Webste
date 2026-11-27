import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { collections, collectionProducts } from "@dec-walls/db/schema";
import { eq, sql } from "drizzle-orm";
import { guardAdmin } from "../_guard";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const rows = await db
    .select({
      id: collections.id,
      slug: collections.slug,
      name: collections.name,
      description: collections.description,
      status: collections.status,
      productCount: sql<number>`count(${collectionProducts.productId})`.mapWith(Number),
      thumbnailUrl: sql<string | null>`(
        SELECT pi.url FROM product_images pi
        INNER JOIN collection_products cp ON cp.product_id = pi.product_id
        WHERE cp.collection_id = ${collections.id}
        ORDER BY pi.is_primary DESC, pi.sort_order ASC
        LIMIT 1
      )`,
    })
    .from(collections)
    .leftJoin(collectionProducts, eq(collectionProducts.collectionId, collections.id))
    .groupBy(collections.id);

  return NextResponse.json({ data: rows });
}
