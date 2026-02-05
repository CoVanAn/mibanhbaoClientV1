/**
 * Logout Route Handler
 * Handles user logout and clears HttpOnly cookies
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/src/constants/api";

export async function POST() {
  const cookieStore = await cookies();

  // Get tokens before clearing (for backend logout call)
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log("[Logout Route] Logging out, has tokens:", { 
    hasAccessToken: !!accessToken, 
    hasRefreshToken: !!refreshToken 
  });

  try {
    // Call backend API to logout (invalidate tokens on server) if tokens exist
    if (accessToken && refreshToken) {
      await fetch(`${API_URL}/api/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
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

    console.log("[Logout Route] Cookies cleared via headers");

    return response;
  } catch (error) {
    console.error("[Logout Route] Error:", error);
    
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