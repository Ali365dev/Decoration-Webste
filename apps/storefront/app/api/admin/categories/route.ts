import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { categories, categoryProducts } from "@dec-walls/db/schema";
import { eq, sql } from "drizzle-orm";
import { guardAdmin } from "../_guard";
import { errorResponse } from "../_respond";
import { categoryInputSchema } from "./_category-input";
import { categoryColumns, categoryValues, rethrowSlugConflict } from "./_category-save";

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
      status: categories.status,
      imageUrl: categories.imageUrl,
      imageStoragePath: categories.imageStoragePath,
      productCount: sql<number>`count(${categoryProducts.productId})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(categoryProducts, eq(categoryProducts.categoryId, categories.id))
    .groupBy(categories.id);

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const values = categoryValues(categoryInputSchema.parse(await req.json()));
    const [created] = await db
      .insert(categories)
      .values(values)
      .returning(categoryColumns)
      .catch(rethrowSlugConflict);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
