import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { guardAdmin } from "../../_guard";
import { errorResponse } from "../../_respond";
import { parseHomeUpdate } from "../_input";
import { savedResponse } from "../_respond-saved";
import { homeVersion, readHome, saveHome } from "../_store";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const { home } = await readHome(db);
    return NextResponse.json({ data: home, version: homeVersion(home) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const { home } = await readHome(db);
    const update = parseHomeUpdate(await req.json().catch(() => null), home.sections, homeVersion(home));
    const saved = await saveHome(db, update);
    return savedResponse(saved, homeVersion(saved));
  } catch (err) {
    return errorResponse(err);
  }
}
