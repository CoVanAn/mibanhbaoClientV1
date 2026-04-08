/**
 * Logout Route Handler
 * Handles user logout and clears HttpOnly cookies
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/src/store/constants";
import logger from "@/src/lib/logger";

export async function POST() {
  const cookieStore = await cookies();

  // Get tokens before clearing (for backend logout call)
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    // Call backend API to revoke refresh token if available
    if (refreshToken) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      await fetch(`${API_URL}/api/user/logout`, {
        method: "POST",
        headers,
      });
    }

    // Create response with cleared cookies
    const response = NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    });

    // Clear cookies by setting Max-Age=0
    response.headers.set(
      "Set-Cookie",
      "accessToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );
    response.headers.append(
      "Set-Cookie",
      "refreshToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );

    return response;
  } catch (error) {
    logger.warn("[auth/logout] Backend logout failed, clearing cookies locally", error);

    // Still clear cookies even if backend call fails
    const response = NextResponse.json({
      success: true,
      message: "Đã đăng xuất",
    });

    response.headers.set(
      "Set-Cookie",
      "accessToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );
    response.headers.append(
      "Set-Cookie",
      "refreshToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );

    return response;
  }
}