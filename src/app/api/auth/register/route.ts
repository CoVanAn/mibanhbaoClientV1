/**
 * Register Route Handler
 * Handles user registration and sets HttpOnly cookies for tokens
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/src/store/constants";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
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

    const { accessToken, refreshToken, user } = data;

    // If tokens are returned (auto-login after register)
    if (accessToken && refreshToken) {
      const decodedAccessToken = decodeJWT(accessToken);
      const decodedRefreshToken = decodeJWT(refreshToken);

      // Set accessToken cookie (HttpOnly)
      cookieStore.set("accessToken", accessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: decodedAccessToken
          ? new Date(decodedAccessToken.exp * 1000)
          : undefined,
      });

      // Set refreshToken cookie (HttpOnly)
      cookieStore.set("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: decodedRefreshToken
          ? new Date(decodedRefreshToken.exp * 1000)
          : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Đăng ký thành công",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi đăng ký",
      },
      { status: 500 }
    );
  }
}
