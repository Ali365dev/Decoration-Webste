import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { MENU_KEYS, type MenuKey } from "@dec-walls/validation/cms";
import { guardAdmin } from "../../../_guard";
import { errorResponse } from "../../../_respond";
import { parseMenuUpdate } from "../../_input";
import { savedResponse } from "../../_respond-saved";
import { menuVersion, readMenuAdmin, saveMenu } from "../../_store";

type Ctx = { params: Promise<{ key: string }> };

const menuKey = async (ctx: Ctx): Promise<MenuKey | null> => {
  const { key } = await ctx.params;
  return (MENU_KEYS as readonly string[]).includes(key) ? (key as MenuKey) : null;
};

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const key = await menuKey(ctx);
  if (!key) return NextResponse.json({ error: "Unknown menu" }, { status: 404 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const menu = await readMenuAdmin(db, key);
    return NextResponse.json({ data: menu, version: menuVersion(menu) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const key = await menuKey(ctx);
  if (!key) return NextResponse.json({ error: "Unknown menu" }, { status: 404 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const update = parseMenuUpdate(key, await req.json().catch(() => null));
    const saved = await saveMenu(db, key, update);
    return savedResponse(saved, menuVersion(saved));
  } catch (err) {
    return errorResponse(err);
  }
}
