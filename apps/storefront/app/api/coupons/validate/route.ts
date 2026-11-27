import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { discounts, couponUsages } from "@dec-walls/db/schema";
import { eq, sql } from "drizzle-orm";
import { validateCoupon, calcCouponDiscount } from "../_coupon-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code")?.trim().toUpperCase();
  const subtotalParam = searchParams.get("subtotal");

  if (!code) return NextResponse.json({ valid: false, discountAmount: 0, message: "No code provided" });

  const subtotal = subtotalParam ? Number(subtotalParam) : 0;
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json({ valid: false, discountAmount: 0, message: "Invalid subtotal" });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ valid: false, discountAmount: 0, message: "Service unavailable" }, { status: 503 });

  const [row] = await db
    .select({
      id: discounts.id,
      code: discounts.code,
      type: discounts.type,
      value: discounts.value,
      isActive: discounts.isActive,
      startsAt: discounts.startsAt,
      endsAt: discounts.endsAt,
      minOrderAmount: discounts.minOrderAmount,
      usageLimit: discounts.usageLimit,
      totalUsages: sql<number>`(select count(*) from ${couponUsages} where coupon_id = ${discounts.id})`,
    })
    .from(discounts)
    .where(eq(sql`lower(${discounts.code})`, code.toLowerCase()));

  if (!row) return NextResponse.json({ valid: false, discountAmount: 0, message: "Invalid or inactive coupon" });

  const coupon = {
    ...row,
    value: Number(row.value),
    minOrderAmount: Number(row.minOrderAmount),
    totalUsages: Number(row.totalUsages),
  };

  const result = validateCoupon(coupon, subtotal);
  return NextResponse.json(result);
}
