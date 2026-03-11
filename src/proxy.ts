import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuth = !!token;

  const publicOnlyRoutes = ["/", "/authenticate"];
  const protectedRoutes = ["/workspace", "/pricing"];

  // logged in users only
  if (isAuth && publicOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  // logged out users cannot access protected pages
  if (!isAuth && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL("/authenticate", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};