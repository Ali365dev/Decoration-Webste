import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { products } from "@dec-walls/db/schema";
import { eq } from "drizzle-orm";
import { guardAdmin } from "../../_guard";
import { errorResponse } from "../../_respond";
import { productInputSchema } from "../_product-input";
import { loadProduct, updateProduct } from "../_product-save";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;
  const product = await loadProduct(db, id).catch(() => null);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: product });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;
  try {
    const input = productInputSchema.parse(await req.json());
    const updated = await updateProduct(db, id, input);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;

  // Archive instead of delete, so past orders keep pointing at a real product.
  const [archived] = await db
    .update(products)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ id: products.id, status: products.status });

  if (!archived) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: archived });
}
