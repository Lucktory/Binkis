import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

const ADMIN_PROTECTED_PREFIXES = ["/codes", "/generate", "/verify", "/winners", "/card"];

function isAdminPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return ADMIN_PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_PASSWORD;
  if (!cookie || !expected || cookie !== expected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|claim|v|login|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|css|js|woff|woff2|ttf|map)).*)",
  ],
};
