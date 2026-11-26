import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { products, productImages, productVariants } from "@dec-walls/db/schema";
import { eq, desc } from "drizzle-orm";
import { guardAdmin } from "../_guard";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const rows = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json();
  const { slug, name, description, status, priceAmount, priceCurrency, compareAtAmount, label } = body;

  if (!slug || !name || !priceAmount) {
    return NextResponse.json({ error: "slug, name and priceAmount are required" }, { status: 400 });
  }

  try {
    const [product] = await db
      .insert(products)
      .values({ slug, name, description, status: status ?? "draft", priceAmount, priceCurrency: priceCurrency ?? "PKR", compareAtAmount, label })
      .returning();

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
