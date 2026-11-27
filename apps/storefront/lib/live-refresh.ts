import { timingSafeEqual } from "node:crypto";

/** Constant-time comparison of the revalidate secret. Empty or missing values never match. */
export function secretMatches(given: string | null, expected: string | undefined): boolean {
  if (!given || !expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type LiveRefresh = "ok" | "skipped" | "failed";

/**
 * Asks the deployed storefront to rebuild its pages after a dashboard save.
 * "skipped" when STOREFRONT_PUBLIC_URL or REVALIDATE_SECRET isn't set here.
 */
export async function notifyLiveSite(fetchImpl: typeof fetch = fetch): Promise<LiveRefresh> {
  const base = process.env.STOREFRONT_PUBLIC_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return "skipped";
  try {
    const res = await fetchImpl(`${base.replace(/\/+$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(3000),
    });
    return res.status === 204 ? "ok" : "failed";
  } catch (error) {
    console.error("[live refresh] could not reach the live storefront", error);
    return "failed";
  }
}
