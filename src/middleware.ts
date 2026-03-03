import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // IMPORTANT: calling getUser() refreshes auth cookies if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, searchParams } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""));
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

