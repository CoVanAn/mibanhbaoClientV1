/**
 * Google OAuth Callback Route Handler
 * Receives tokens from backend and sets them as HttpOnly cookies on frontend domain
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const error = searchParams.get("error");

  // Handle error case
  if (error) {
    return NextResponse.redirect(
      new URL("/?googleAuth=error", request.url)
    );
  }

  // Validate tokens
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL("/?googleAuth=error", request.url)
    );
  }

  // Create redirect response
  const response = NextResponse.redirect(
    new URL("/?googleAuth=success", request.url)
  );

  // Set refresh token as HttpOnly cookie (30 days)
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  // Set access token as HttpOnly cookie (15 minutes)
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  return response;
}
