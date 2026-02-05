/**
 * Login Route Handler
 * Handles user login and sets HttpOnly cookies for tokens
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/src/constants/api";

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
  const cookieStore = await cookies();

  try {
    const body: LoginBody = await request.json();

    // Log API URL for debugging
    console.log("[Login Route] API_URL:", API_URL);
    console.log("[Login Route] Calling:", `${API_URL}/api/user/login`);

    // Call backend API to login
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[Login Route] Response status:", response.status);

    const data: LoginResponse = await response.json();
    console.log("[Login Route] Response data:", data);

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
    console.log("[Login Route] Backend set-cookie header:", backendCookies);

    // Parse refreshToken from backend cookie
    let refreshTokenValue = null;
    if (backendCookies) {
      const refreshTokenMatch = backendCookies.match(/refreshToken=([^;]+)/);
      if (refreshTokenMatch) {
        refreshTokenValue = refreshTokenMatch[1];
        console.log("[Login Route] Parsed refreshToken, length:", refreshTokenValue.length);
      } else {
        console.log("[Login Route] WARNING: Could not parse refreshToken from backend cookie");
      }
    } else {
      console.log("[Login Route] WARNING: No set-cookie header from backend");
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
      console.log("[Login Route] Both cookies set via headers");
    } else {
      console.log("[Login Route] Only accessToken cookie set (no refreshToken from backend)");
    }

    return jsonResponse;
  } catch (error) {
    console.error("[Login Route] Error:", error);
    
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
