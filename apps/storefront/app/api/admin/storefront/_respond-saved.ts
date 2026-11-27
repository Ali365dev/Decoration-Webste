import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { notifyLiveSite } from "@/lib/live-refresh";

/** After a save: rebuild this storefront's pages, ask the deployed one to do the same, and report. */
export async function savedResponse(data: unknown, version: string) {
  revalidatePath("/", "layout");
  const liveRefresh = await notifyLiveSite();
  return NextResponse.json({ data, version, liveRefresh });
}
