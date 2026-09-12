import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route prefixes and their required role
const PROTECTED_ROUTES: Record<string, string> = {
  "/dashboard/customer": "customer",
  "/dashboard/affiliate": "affiliate",
  "/dashboard/wholesaler": "wholesaler",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const token = request.cookies.get("sirajtech_token")?.value;

  if (isDashboardRoute) {
    // No token → redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAuthRoute && token) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all dashboard routes
    "/dashboard/:path*",
    // Exclude static files, images, api routes
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
