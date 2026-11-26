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
