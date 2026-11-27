import { NextResponse } from "next/server";
import { z } from "zod/v4";

/** Maps thrown errors to JSON responses: validation 400, InputError 400, ConflictError 409, else 500. */
export function errorResponse(err: unknown): NextResponse {
  if (err instanceof z.ZodError) {
    const issue = err.issues[0];
    const field = issue?.path.join(".") || "input";
    return NextResponse.json({ error: `${field}: ${issue?.message ?? "invalid"}` }, { status: 400 });
  }
  const status = (err as { status?: number })?.status;
  if (status === 400 || status === 409) {
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
  console.error("[admin api]", err);
  return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
}
