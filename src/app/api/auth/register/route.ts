/**
 * Register Route Handler
 * Handles user registration and sets HttpOnly cookies for tokens
 */

import { NextResponse } from "next/server";
import { API_URL } from "@/src/store/constants";
import logger from "@/src/lib/logger";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  accessToken?: string;
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
    const body: RegisterBody = await request.json();

    // Call backend API to register
    const response = await fetch(`${API_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: RegisterResponse = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Đăng ký thất bại",
        },
        { status: response.status || 400 }
      );
    }

    const { accessToken, user } = data;
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Không nhận được access token từ server",
        },
        { status: 500 }
      );
    }

    const decodedAccessToken = decodeJWT(accessToken);
    const backendCookies = response.headers.get("set-cookie");
    let refreshTokenValue: string | null = null;
    if (backendCookies) {
      const refreshTokenMatch = backendCookies.match(/refreshToken=([^;]+)/);
      if (refreshTokenMatch) {
        refreshTokenValue = refreshTokenMatch[1];
      }
    }

    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";
    const accessTokenExpiry = decodedAccessToken
      ? new Date(decodedAccessToken.exp * 1000).toUTCString()
      : new Date(Date.now() + 15 * 60 * 1000).toUTCString();
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();

    const jsonResponse = NextResponse.json({
      success: true,
      message: data.message || "Đăng ký thành công",
      accessToken,
      user,
    });

    const accessTokenCookie = `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Expires=${accessTokenExpiry}`;
    jsonResponse.headers.set("Set-Cookie", accessTokenCookie);

    if (refreshTokenValue) {
      const refreshTokenCookie = `refreshToken=${refreshTokenValue}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Expires=${refreshTokenExpiry}`;
      jsonResponse.headers.append("Set-Cookie", refreshTokenCookie);
    }

    return jsonResponse;
  } catch (error) {
    logger.error("[auth/register] Request failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi đăng ký",
      },
      { status: 500 }
    );
  }
}
