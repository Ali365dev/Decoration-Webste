import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getEnv, hasSupabase } from "@dec-walls/config";

export function resolveSupabaseAnonKey(env: {
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
}): string | undefined {
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export function createSupabaseBrowserClient() {
  // Next.js only inlines NEXT_PUBLIC_* values into browser code when each is read by its
  // full literal name; the shared env helper spreads process.env and sees nothing there.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || undefined;
  const anonKey = resolveSupabaseAnonKey({
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || undefined,
  });
  if (!url || !anonKey) {
    throw new Error("Supabase public credentials are not configured");
  }
  return createBrowserClient(url, anonKey);
}

export function createSupabaseServerClient(cookieStore: {
  getAll: () => { name: string; value: string }[];
  setAll: (
    cookies: { name: string; value: string; options?: Record<string, unknown> }[],
  ) => void;
}) {
  const env = getEnv();
  const anonKey = resolveSupabaseAnonKey(env);
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !anonKey) {
    throw new Error("Supabase public credentials are not configured");
  }
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => cookieStore.setAll(cookies),
      },
    },
  );
}

export function createSupabaseServiceClient() {
  const env = getEnv();
  if (
    !env.NEXT_PUBLIC_SUPABASE_URL ||
    !env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error("Supabase service role credentials are not configured");
  }
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function isSupabaseConfigured() {
  return hasSupabase();
}
