import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { productVariants, products } from "@dec-walls/db/schema";
import { asc, eq, ilike, lte, sql } from "drizzle-orm";
import { guardAdmin } from "../_guard";
import { mapVariantRow } from "../_mappers";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const lowStock = searchParams.get("lowStock") === "true";
  const lowStockThreshold = 5;

  const rows = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      sku: productVariants.sku,
      inventoryQuantity: productVariants.inventoryQuantity,
      price: productVariants.priceAmount,
      productName: products.name,
      productSlug: products.slug,
      productStatus: products.status,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(
      lowStock
        ? lte(productVariants.inventoryQuantity, lowStockThreshold)
        : q
          ? ilike(products.name, `%${q}%`)
          : undefined,
    )
    .orderBy(asc(productVariants.inventoryQuantity))
    .limit(500);

  const summary = {
    total: rows.length,
    lowStock: rows.filter((r) => r.inventoryQuantity <= lowStockThreshold).length,
    outOfStock: rows.filter((r) => r.inventoryQuantity === 0).length,
    totalUnits: rows.reduce((s, r) => s + r.inventoryQuantity, 0),
  };

  return NextResponse.json({
    data: rows.map(mapVariantRow),
    summary,
    total: rows.length,
  });
}

export async function PUT(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json();
  const { variantId, quantity } = body;

  if (!variantId || typeof quantity !== "number") {
    return NextResponse.json({ error: "variantId and quantity are required" }, { status: 400 });
  }

  const [updated] = await db
    .update(productVariants)
    .set({ inventoryQuantity: quantity })
    .where(eq(productVariants.id, variantId))
    .returning({ id: productVariants.id, inventoryQuantity: productVariants.inventoryQuantity });

  if (!updated) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

  return NextResponse.json({ data: updated });
}
