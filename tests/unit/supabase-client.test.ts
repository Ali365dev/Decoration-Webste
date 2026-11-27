import { describe, expect, it } from "vitest";
import {
  resolveSupabaseAnonKey,
  isSupabaseConfigured,
} from "../../packages/auth/src/supabase";

describe("resolveSupabaseAnonKey", () => {
  it("returns the anon key when present", () => {
    expect(
      resolveSupabaseAnonKey({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
      }),
    ).toBe("anon-key");
  });

  it("falls back to publishable key when anon key is absent", () => {
    expect(
      resolveSupabaseAnonKey({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pub-key",
      }),
    ).toBe("pub-key");
  });

  it("prefers anon key over publishable key when both present", () => {
    expect(
      resolveSupabaseAnonKey({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pub-key",
      }),
    ).toBe("anon-key");
  });

  it("returns undefined when neither key is present", () => {
    expect(
      resolveSupabaseAnonKey({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
      }),
    ).toBeUndefined();
  });
});

describe("isSupabaseConfigured", () => {
  it("is a function", () => {
    expect(typeof isSupabaseConfigured).toBe("function");
  });
});

describe("createSupabaseBrowserClient", () => {
  it("reads NEXT_PUBLIC_* by literal name so Next.js can inline them in the browser", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync(new URL("../../packages/auth/src/supabase.ts", import.meta.url), "utf8");
    const body = src.slice(src.indexOf("export function createSupabaseBrowserClient"), src.indexOf("export function createSupabaseServerClient"));
    expect(body).toContain("process.env.NEXT_PUBLIC_SUPABASE_URL");
    expect(body).toContain("process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    expect(body).not.toContain("getEnv(");
  });
});
