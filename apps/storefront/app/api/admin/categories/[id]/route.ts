import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { categories } from "@dec-walls/db/schema";
import { eq } from "drizzle-orm";
import { guardAdmin } from "../../_guard";
import { errorResponse } from "../../_respond";
import { InputError } from "../../products/_product-input";
import { categoryInputSchema } from "../_category-input";
import { categoryColumns, categoryValues, rethrowSlugConflict } from "../_category-save";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { id } = await params;
  try {
    const input = categoryInputSchema.parse(await req.json());
    if (input.parentId === id) throw new InputError("A category cannot be its own parent");
    const [updated] = await db
      .update(categories)
      .set(categoryValues(input))
      .where(eq(categories.id, id))
      .returning(categoryColumns)
      .catch(rethrowSlugConflict);
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
  try {
    const children = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, id)).limit(1);
    if (children.length) {
      return NextResponse.json({ error: "This category has sub-categories. Move or delete them first." }, { status: 409 });
    }
    // Product links go with it (category_products cascades); products themselves stay.
    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: deleted });
  } catch (err) {
    return errorResponse(err);
  }
}
