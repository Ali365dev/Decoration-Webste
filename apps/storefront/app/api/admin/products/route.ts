import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { productImages, products } from "@dec-walls/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { guardAdmin } from "../_guard";
import { errorResponse } from "../_respond";
import { productInputSchema } from "./_product-input";
import { createProduct } from "./_product-save";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  // Get products with one primary image URL per product using a CTE.
  const firstImage = db.$with("first_image").as(
    db
      .selectDistinctOn([productImages.productId], {
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .orderBy(productImages.productId, desc(productImages.isPrimary), asc(productImages.sortOrder)),
  );

  const rows = await db
    .with(firstImage)
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      status: products.status,
      priceAmount: products.priceAmount,
      priceCurrency: products.priceCurrency,
      compareAtAmount: products.compareAtAmount,
      label: products.label,
      material: products.material,
      color: products.color,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      primaryImageUrl: firstImage.url,
    })
    .from(products)
    .leftJoin(firstImage, eq(firstImage.productId, products.id))
    .orderBy(desc(products.createdAt));

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const input = productInputSchema.parse(await req.json());
    const created = await createProduct(db, input);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
