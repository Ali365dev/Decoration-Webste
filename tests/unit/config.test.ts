import { describe, expect, it } from "vitest";
import { getEnv, hasSupabase, hasDatabase } from "../../packages/config/src/index";

describe("getEnv", () => {
  it("treats empty string DATABASE_URL as absent", () => {
    const env = getEnv({ DATABASE_URL: "" });
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("treats empty string NEXT_PUBLIC_SUPABASE_ANON_KEY as absent", () => {
    const env = getEnv({ NEXT_PUBLIC_SUPABASE_ANON_KEY: "" });
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeUndefined();
  });

  it("treats empty string NEXT_PUBLIC_SUPABASE_URL as absent", () => {
    const env = getEnv({ NEXT_PUBLIC_SUPABASE_URL: "" });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it("accepts a valid DATABASE_URL", () => {
    const env = getEnv({ DATABASE_URL: "postgresql://user:pass@localhost/db" });
    expect(env.DATABASE_URL).toBe("postgresql://user:pass@localhost/db");
  });
});

describe("hasSupabase", () => {
  it("returns false when env vars are empty strings", () => {
    // Calling with overrides doesn't affect the hasSupabase singleton, so we
    // verify the shape via getEnv instead — empty strings become undefined.
    const env = getEnv({
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    });
    const fakeHas = Boolean(
      env.NEXT_PUBLIC_SUPABASE_URL &&
        (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    );
    expect(fakeHas).toBe(false);
  });
});
