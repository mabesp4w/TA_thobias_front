/** @format */

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log({ WEBSITE_STATUS: process.env.WEBSITE_STATUS });

export function middleware(request: NextRequest) {
  const websiteStatus = process.env.WEBSITE_STATUS;
  const pathname = request.nextUrl.pathname;

  // Jika status down dan bukan halaman domain-expired, redirect ke domain-expired
  if (websiteStatus === "down" && !pathname.startsWith("/domain-expired")) {
    return NextResponse.rewrite(new URL("/domain-expired", request.url));
  }

  // Jika status up dan sedang di halaman domain-expired, redirect ke home
  if (websiteStatus !== "down" && pathname.startsWith("/domain-expired")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi matcher - exclude file static dan API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
