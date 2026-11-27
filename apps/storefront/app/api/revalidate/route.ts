import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { secretMatches } from "@/lib/live-refresh";

/**
 * Rebuilds the storefront's pages after the dashboard saves content. Reachable in production on
 * purpose, protected by its own secret, and takes no input, so it can't read or change data.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) return new NextResponse(null, { status: 404 });
  if (!secretMatches(req.headers.get("x-revalidate-secret"), expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return new NextResponse(null, { status: 204 });
}
