import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the user has a valid session token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    // If no token is found, redirect to the login page
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If the user is logged in, allow the request to continue
  return NextResponse.next();
}

export const config = {
  // matcher: ["/admin/:path*"],
  matcher: ["/dashboard/:path*"],

};