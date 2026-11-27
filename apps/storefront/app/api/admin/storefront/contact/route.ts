import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@dec-walls/db/client";
import { guardAdmin } from "../../_guard";
import { errorResponse } from "../../_respond";
import { parseContactUpdate } from "../_input";
import { savedResponse } from "../_respond-saved";
import { contactVersion, readContactAdmin, saveContact } from "../_store";

export async function GET(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const contact = await readContactAdmin(db);
    return NextResponse.json({ data: contact, version: contactVersion(contact) });
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
    const update = parseContactUpdate(await req.json().catch(() => null));
    const saved = await saveContact(db, update);
    return savedResponse(saved, contactVersion(saved));
  } catch (err) {
    return errorResponse(err);
  }
}
