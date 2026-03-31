/**
 * Refresh Token Route Handler
 * Handles token refresh using HttpOnly cookie
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/src/store/constants";
import logger from "@/src/lib/logger";

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

// Decode JWT to get expiration time
const decodeJWT = (token: string): { exp: number } | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Không tìm thấy refresh token",
      },
      { status: 401 }
    );
  }

  try {
    // Call backend API to refresh token
    // IMPORTANT: Backend reads refreshToken from cookie, so we need to forward it
    const response = await fetch(`${API_URL}/api/user/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the refreshToken cookie to backend
        Cookie: `refreshToken=${refreshToken}`,
      },
      credentials: "include", // Include cookies in request
    });

    const data: RefreshTokenResponse = await response.json();

    if (!response.ok || !data.success) {
      // Clear invalid cookies via Set-Cookie headers
      const clearResponse = NextResponse.json(
        {
          success: false,
          message: data.message || "Refresh token không hợp lệ",
        },
        { status: 401 }
      );

      // Clear cookies by setting them with Max-Age=0
      clearResponse.headers.set("Set-Cookie", "accessToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
      clearResponse.headers.append("Set-Cookie", "refreshToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");

      return clearResponse;
    }

    const { accessToken: newAccessToken } = data;

    if (!newAccessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Không nhận được access token mới",
        },
        { status: 500 }
      );
    }

    // Get backend's new refreshToken cookie from Set-Cookie header
    const backendCookies = response.headers.get("set-cookie");

    // Decode tokens to get expiration
    const decodedAccessToken = decodeJWT(newAccessToken);

    // Build Set-Cookie headers
    const accessTokenExpiry = decodedAccessToken
      ? new Date(decodedAccessToken.exp * 1000).toUTCString()
      : new Date(Date.now() + 15 * 60 * 1000).toUTCString();

    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";

    // Create response with Set-Cookie headers
    const jsonResponse = NextResponse.json({
      success: true,
      message: "Refresh token thành công",
      accessToken: newAccessToken,
    });

    // Set accessToken cookie
    const accessTokenCookie = `accessToken=${newAccessToken}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Expires=${accessTokenExpiry}`;
    jsonResponse.headers.set("Set-Cookie", accessTokenCookie);

    // Parse and set new refreshToken cookie from backend
    if (backendCookies) {
      const refreshTokenMatch = backendCookies.match(/refreshToken=([^;]+)/);

      if (refreshTokenMatch) {
        const newRefreshTokenValue = refreshTokenMatch[1];

        const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(); // 30 days
        const refreshTokenCookie = `refreshToken=${newRefreshTokenValue}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Expires=${refreshTokenExpiry}`;
        jsonResponse.headers.append("Set-Cookie", refreshTokenCookie);
      }
    }

    return jsonResponse;
  } catch (error) {
    logger.error("[auth/refresh-token] Request failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi refresh token",
      },
      { status: 500 }
    );
  }
}
