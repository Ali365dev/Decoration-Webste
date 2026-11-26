import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { products, productImages, productVariants } from "@dec-walls/db/schema";
import { eq } from "drizzle-orm";
import { guardAdmin } from "../../_guard";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const images = await db.select().from(productImages).where(eq(productImages.productId, id));
  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));

  return NextResponse.json({ data: { ...product, images, variants } });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;
  const body = await req.json();

  // prevent slug from being changed
  const { slug: _slug, id: _id, createdAt: _created, ...updates } = body;

  try {
    const [updated] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;

  // archive instead of delete — keeps historical order records valid
  const [archived] = await db
    .update(products)
    .set({ status: "scheduled", updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  if (!archived) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: archived });
}
