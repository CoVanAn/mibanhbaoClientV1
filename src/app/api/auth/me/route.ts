/**
 * Get Current User Route Handler
 * Returns the current authenticated user's information
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/src/constants/api";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  // Try to get token from Authorization header first (for localStorage verification)
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.replace("Bearer ", "");
  
  // Fall back to cookie if no header token
  const accessToken = headerToken || cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Chưa đăng nhập",
      },
      { status: 401 }
    );
  }

  try {
    // Call backend API to get current user
    const response = await fetch(`${API_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Không thể lấy thông tin người dùng",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra",
      },
      { status: 500 }
    );
  }
}
