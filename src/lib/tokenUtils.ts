/**
 * Token Utilities
 * JWT helpers and legacy localStorage cleanup only.
 */

const isBrowser = typeof window !== "undefined";

// Legacy cleanup: remove any stale tokens from previous implementations.
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
