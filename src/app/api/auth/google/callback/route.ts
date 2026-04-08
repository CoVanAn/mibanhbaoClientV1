/**
 * Google OAuth Callback Route Handler
 * Exchanges one-time code for tokens and sets them as HttpOnly cookies
 */

import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/src/store/constants";
import logger from "@/src/lib/logger";

interface GoogleExchangeResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle error case
  if (error) {
    return NextResponse.redirect(
      new URL("/?googleAuth=error", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/?googleAuth=error", request.url)
    );
  }

  try {
    const exchangeResponse = await fetch(`${API_URL}/auth/google/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data: GoogleExchangeResponse = await exchangeResponse.json();

    if (!exchangeResponse.ok || !data.success || !data.accessToken || !data.refreshToken) {
      return NextResponse.redirect(
        new URL("/?googleAuth=error", request.url)
      );
    }

    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    // Create redirect response
    const response = NextResponse.redirect(
      new URL("/?googleAuth=success", request.url)
    );

    // Set refresh token as HttpOnly cookie (30 days)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    // Set access token as HttpOnly cookie (15 minutes)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (exchangeError) {
    logger.error("[auth/google/callback] Exchange failed", exchangeError);
    return NextResponse.redirect(
      new URL("/?googleAuth=error", request.url)
    );
  }
}
