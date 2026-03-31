/**
 * Login Route Handler
 * Handles user login and sets HttpOnly cookies for tokens
 */

import { NextResponse } from "next/server";
import { API_URL } from "@/src/store/constants";
import logger from "@/src/lib/logger";

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  // refreshToken is set as HttpOnly cookie by backend, not in response body
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
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

export async function POST(request: Request) {
  try {
    const body: LoginBody = await request.json();

    // Call backend API to login
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Đăng nhập thất bại",
        },
        { status: response.status || 401 }
      );
    }

    const { accessToken, user } = data;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Không nhận được token từ server",
        },
        { status: 500 }
      );
    }

    // Decode accessToken to get expiration
    const decodedAccessToken = decodeJWT(accessToken);

    // Get backend's refreshToken cookie
    const backendCookies = response.headers.get("set-cookie");

    // Parse refreshToken from backend cookie
    let refreshTokenValue = null;
    if (backendCookies) {
      const refreshTokenMatch = backendCookies.match(/refreshToken=([^;]+)/);
      if (refreshTokenMatch) {
        refreshTokenValue = refreshTokenMatch[1];
      }
    }

    // Build Set-Cookie headers
    const accessTokenExpiry = decodedAccessToken
      ? new Date(decodedAccessToken.exp * 1000).toUTCString()
      : new Date(Date.now() + 15 * 60 * 1000).toUTCString();

    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(); // 30 days

    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";

    // Create response with Set-Cookie headers
    const jsonResponse = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
      user,
    });

    // Set accessToken cookie
    const accessTokenCookie = `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Expires=${accessTokenExpiry}`;
    jsonResponse.headers.set("Set-Cookie", accessTokenCookie);

    // Set refreshToken cookie if available
    if (refreshTokenValue) {
      const refreshTokenCookie = `refreshToken=${refreshTokenValue}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Expires=${refreshTokenExpiry}`;
      jsonResponse.headers.append("Set-Cookie", refreshTokenCookie);
    }

    return jsonResponse;
  } catch (error) {
    logger.error("[auth/login] Request failed", error);

    // More detailed error message
    const errorMessage = error instanceof Error
      ? error.message
      : "Có lỗi xảy ra khi đăng nhập";

    return NextResponse.json(
      {
        success: false,
        message: `Lỗi kết nối: ${errorMessage}`,
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
