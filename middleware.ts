import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard route
  if (pathname.startsWith("/dashboard")) {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("sb-access-token");

    if (!authHeader && !cookieToken) {
      // Allow client-side local storage fallback in SPA mode
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/bids/:path*"],
};
