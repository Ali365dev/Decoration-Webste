import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { collections } from "@dec-walls/db/schema";
import { eq } from "drizzle-orm";
import { guardAdmin } from "../../_guard";
import { errorResponse } from "../../_respond";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const { id } = await params;
    const [deleted] = await db
      .delete(collections)
      .where(eq(collections.id, id))
      .returning({ id: collections.id });
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: deleted });
  } catch (err) {
    return errorResponse(err);
  }
}
