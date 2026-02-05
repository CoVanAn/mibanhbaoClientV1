"use server";

/**
 * Auth Server Actions
 * Server Actions can reliably set cookies unlike Route Handlers
 */

import { cookies } from "next/headers";
import { API_URL } from "@/src/constants/api";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: AuthUser;
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

/**
 * Login Server Action
 * Sets HttpOnly cookies for both accessToken and refreshToken
 */
export async function loginAction(body: LoginBody): Promise<AuthResponse> {
  const cookieStore = await cookies();

  try {
    console.log("[Login Action] Calling backend:", `${API_URL}/api/user/login`);

    // Call backend API to login
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[Login Action] Response status:", response.status);

    const data: AuthResponse = await response.json();
    console.log("[Login Action] Response data:", data);

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Đăng nhập thất bại",
      };
    }

    const { accessToken, user } = data;

    if (!accessToken) {
      return {
        success: false,
        message: "Không nhận được token từ server",
      };
    }

    // Decode accessToken to get expiration
    const decodedAccessToken = decodeJWT(accessToken);

    // Get backend's refreshToken cookie
    const backendCookies = response.headers.get("set-cookie");
    console.log("[Login Action] Backend set-cookie header:", backendCookies);

    // 1. Set accessToken cookie (HttpOnly)
    const accessTokenExpiry = decodedAccessToken
      ? new Date(decodedAccessToken.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000); // 15 min fallback

    console.log("[Login Action] Setting accessToken cookie...");
    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: accessTokenExpiry,
    });

    // 2. Parse and set refreshToken cookie from backend
    if (backendCookies) {
      const refreshTokenMatch = backendCookies.match(/refreshToken=([^;]+)/);
      console.log("[Login Action] RefreshToken match:", refreshTokenMatch);

      if (refreshTokenMatch) {
        const refreshTokenValue = refreshTokenMatch[1];
        console.log(
          "[Login Action] Setting refreshToken cookie, value length:",
          refreshTokenValue.length
        );

        const refreshTokenExpiry = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ); // 30 days

        cookieStore.set({
          name: "refreshToken",
          value: refreshTokenValue,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: refreshTokenExpiry,
        });

        console.log("[Login Action] Both cookies set successfully");
      } else {
        console.log(
          "[Login Action] WARNING: Could not parse refreshToken from backend cookie"
        );
      }
    } else {
      console.log("[Login Action] WARNING: No set-cookie header from backend");
    }

    return {
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
      user,
    };
  } catch (error) {
    console.error("[Login Action] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng nhập";

    return {
      success: false,
      message: `Lỗi kết nối: ${errorMessage}`,
    };
  }
}

/**
 * Register Server Action
 * Sets HttpOnly cookies for both accessToken and refreshToken
 */
export async function registerAction(body: RegisterBody): Promise<AuthResponse> {
  const cookieStore = await cookies();

  try {
    console.log("[Register Action] Calling backend:", `${API_URL}/api/user/register`);

    // Call backend API to register
    const response = await fetch(`${API_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[Register Action] Response status:", response.status);

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Đăng ký thất bại",
      };
    }

    const { accessToken, user } = data;

    if (!accessToken) {
      return {
        success: false,
        message: "Không nhận được token từ server",
      };
    }

    // Decode accessToken to get expiration
    const decodedAccessToken = decodeJWT(accessToken);

    // Get backend's refreshToken cookie
    const backendCookies = response.headers.get("set-cookie");

    // Set accessToken cookie
    const accessTokenExpiry = decodedAccessToken
      ? new Date(decodedAccessToken.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: accessTokenExpiry,
    });

    // Parse and set refreshToken cookie from backend
    if (backendCookies) {
      const refreshTokenMatch = backendCookies.match(/refreshToken=([^;]+)/);

      if (refreshTokenMatch) {
        const refreshTokenValue = refreshTokenMatch[1];
        const refreshTokenExpiry = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        );

        cookieStore.set({
          name: "refreshToken",
          value: refreshTokenValue,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: refreshTokenExpiry,
        });
      }
    }

    return {
      success: true,
      message: "Đăng ký thành công",
      accessToken,
      user,
    };
  } catch (error) {
    console.error("[Register Action] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký";

    return {
      success: false,
      message: `Lỗi kết nối: ${errorMessage}`,
    };
  }
}

/**
 * Logout Server Action
 * Clears HttpOnly cookies
 */
export async function logoutAction(): Promise<AuthResponse> {
  const cookieStore = await cookies();

  try {
    // Clear cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return {
      success: true,
      message: "Đăng xuất thành công",
    };
  } catch (error) {
    console.error("[Logout Action] Error:", error);

    return {
      success: false,
      message: "Có lỗi xảy ra khi đăng xuất",
    };
  }
}
