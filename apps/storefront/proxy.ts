import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@dec-walls/auth/supabase";

/**
 * Refreshes the customer's Supabase session before the pages that read it on the server.
 * Server components cannot write cookies, so without this an expired access token would make a
 * signed-in customer look signed out after about an hour.
 */
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured() || !request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (list) => {
      for (const { name, value } of list) request.cookies.set(name, value);
      response = NextResponse.next({ request });
      for (const { name, value, options } of list) response.cookies.set(name, value, options);
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/api/checkout"],
};
