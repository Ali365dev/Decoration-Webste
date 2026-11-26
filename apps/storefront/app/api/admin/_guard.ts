import { NextRequest, NextResponse } from "next/server";

export function guardAdmin(req: NextRequest): NextResponse | null {
  // Admin API is disabled in production until staff login is added
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 503 });
  }
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "ADMIN_API_KEY not configured" }, { status: 503 });
  }
  if (req.headers.get("x-admin-key") !== key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
