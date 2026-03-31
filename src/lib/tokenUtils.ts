/**
 * Token Utilities
 * 
 * SECURITY NOTE:
 * - accessToken is NO LONGER stored in localStorage (XSS vulnerability)
 * - accessToken is now stored in memory only (Zustand store)
 * - On page reload, session is restored via refreshToken (HttpOnly cookie)
 * - refreshToken is stored in HttpOnly cookie (managed by server)
 * 
 * Legacy functions below are kept for backward compatibility but deprecated.
 */

const isBrowser = typeof window !== "undefined";

// ⚠️ DEPRECATED: Access Token should NOT be stored in localStorage
// Kept for migration/cleanup purposes only
/**
 * @deprecated Use Zustand store instead. AccessToken should not be in localStorage.
 */
export const getAccessTokenFromLocalStorage = (): string | null =>
  isBrowser ? localStorage.getItem("accessToken") : null;

/**
 * @deprecated Use Zustand store instead. AccessToken should not be in localStorage.
 */
export const setAccessTokenToLocalStorage = (token: string): void => {
  if (isBrowser) {
    localStorage.setItem("accessToken", token);
  }
};

// ⚠️ DEPRECATED: Refresh Token is in HttpOnly cookie, not localStorage
/**
 * @deprecated Refresh token is managed via HttpOnly cookie by server.
 */
export const getRefreshTokenFromLocalStorage = (): string | null =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

/**
 * @deprecated Refresh token is managed via HttpOnly cookie by server.
 */
export const setRefreshTokenToLocalStorage = (token: string): void => {
  if (isBrowser) {
    localStorage.setItem("refreshToken", token);
  }
};

// Remove tokens from localStorage (cleanup function)
export const removeTokensFromLocalStorage = (): void => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

/**
 * Decode JWT token to get payload
 */
export const decodeJWT = <T = unknown>(token: string): T | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as T;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired or expiring soon
 * @param token JWT token string
 * @param bufferSeconds Seconds before expiry to consider as "expiring soon" (default: 60)
 */
export const isTokenExpired = (
  token: string,
  bufferSeconds: number = 60
): boolean => {
  const decoded = decodeJWT<{ exp: number }>(token);
  if (!decoded?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp - now < bufferSeconds;
};

/**
 * Check and refresh token if needed
 * Call this periodically or before important API calls
 */
export const checkAndRefreshToken = async (params?: {
  onSuccess?: () => void;
  onError?: () => void;
  force?: boolean;
}): Promise<void> => {
  const accessToken = getAccessTokenFromLocalStorage();

  // No token, nothing to refresh
  if (!accessToken) {
    params?.onError?.();
    return;
  }

  // Check if token is expiring soon (within 5 minutes) or force refresh
  const shouldRefresh = params?.force || isTokenExpired(accessToken, 5 * 60);

  if (!shouldRefresh) {
    return;
  }

  try {
    // Dynamic import to avoid circular dependency
    const { default: authApiRequest } = await import("@/src/apiRequests/auth");
    const response = await authApiRequest.refreshToken();

    if (response.success && response.accessToken) {
      setAccessTokenToLocalStorage(response.accessToken);
      params?.onSuccess?.();
    } else {
      removeTokensFromLocalStorage();
      params?.onError?.();
    }
  } catch {
    removeTokensFromLocalStorage();
    params?.onError?.();
  }
};
