/**
 * Auth API Requests
 * Client-side functions to call auth Route Handlers
 * 
 * Pattern: Client -> Route Handler -> Backend API
 * This ensures cookies are managed by Next.js server
 */

import { httpClient } from "@/src/lib/http";

// Types
export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: AuthUser;
}

// Singleton to prevent multiple refresh requests
let refreshTokenRequest: Promise<AuthResponse> | null = null;

const authApiRequest = {
  /**
   * Login via Route Handler
   * POST /api/auth/login -> Sets HttpOnly cookies
   */
  login: (body: LoginBody): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>("/api/auth/login", body),

  /**
   * Register via Route Handler
   * POST /api/auth/register -> Sets HttpOnly cookies
   */
  register: (body: RegisterBody): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>("/api/auth/register", body),

  /**
   * Logout via Route Handler
   * POST /api/auth/logout -> Clears HttpOnly cookies
   */
  logout: (): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>("/api/auth/logout", null),

  /**
   * Refresh token via Route Handler
   * POST /api/auth/refresh-token -> Updates HttpOnly cookies
   * Uses singleton pattern to prevent multiple concurrent refresh requests
   */
  async refreshToken(): Promise<AuthResponse> {
    if (refreshTokenRequest) {
      return refreshTokenRequest;
    }

    refreshTokenRequest = httpClient.post<AuthResponse>(
      "/api/auth/refresh-token",
      null
    );

    try {
      const result = await refreshTokenRequest;
      return result;
    } finally {
      refreshTokenRequest = null;
    }
  },

  /**
   * Get current user via Route Handler
   * GET /api/auth/me
   * @param accessToken Optional access token to verify (from localStorage)
   */
  getCurrentUser: (accessToken?: string): Promise<AuthResponse> =>
    httpClient.get<AuthResponse>("/api/auth/me", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }),
};

export default authApiRequest;
