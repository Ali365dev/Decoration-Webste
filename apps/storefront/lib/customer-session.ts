import { cookies } from "next/headers";
import { createSupabaseServerClient, isSupabaseConfigured } from "@dec-walls/auth/supabase";

export type SignedInCustomer = { id: string; email: string; fullName: string | null };

/** A Supabase client bound to this request's auth cookies. Null when Supabase is not configured. */
export async function getServerSupabase() {
  if (!isSupabaseConfigured()) return null;
  const store = await cookies();
  return createSupabaseServerClient({
    getAll: () => store.getAll(),
    setAll: (list) => {
      // Server components cannot write cookies; proxy.ts refreshes the session before they run.
      try {
        for (const { name, value, options } of list) store.set(name, value, options);
      } catch {}
    },
  });
}

/**
 * The signed-in storefront customer, verified with the Supabase auth server (getUser, not
 * getSession, so a forged cookie is rejected). Null for guests and unconfirmed emails.
 */
export async function getSignedInUser(): Promise<SignedInCustomer | null> {
  const store = await cookies();
  if (!store.getAll().some((c) => c.name.startsWith("sb-"))) return null;
  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;
  if (error || !user?.email || !user.email_confirmed_at) return null;
  const meta = user.user_metadata as { full_name?: unknown } | undefined;
  return {
    id: user.id,
    email: user.email.toLowerCase(),
    fullName: typeof meta?.full_name === "string" ? meta.full_name : null,
  };
}
