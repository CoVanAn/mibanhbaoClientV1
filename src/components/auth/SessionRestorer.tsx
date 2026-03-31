"use client";

import { useEffect, useRef } from "react";
import useStore, { UserSlice } from "@/src/store/user";
import authApiRequest from "@/src/apiRequests/auth";
import logger from "@/src/lib/logger";

/**
 * SessionRestorer Component
 * Restores user session using refreshToken from HttpOnly cookie
 * No longer uses localStorage for security (XSS protection)
 */
export function SessionRestorer() {
  const setToken = useStore((state: UserSlice) => state.setToken);
  const setInitialized = useStore((state: UserSlice) => state.setInitialized);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);
  const token = useStore((state: UserSlice) => state.token);

  // Use ref to ensure we only try once per mount (avoid double-run in React Strict Mode)
  const hasAttemptedRestore = useRef(false);

  useEffect(() => {
    const restoreSession = async () => {
      // Skip if already initialized, has token, or already attempted
      if (isInitialized || token || hasAttemptedRestore.current) {
        return;
      }

      // Mark that we've attempted (prevents double-run in React Strict Mode)
      hasAttemptedRestore.current = true;

      try {
        // Try to refresh token using refreshToken from HttpOnly cookie
        // This is the ONLY way to restore session after reload
        const response = await authApiRequest.refreshToken();

        if (response.success && response.accessToken) {
          setToken(response.accessToken);
        }
      } catch (error) {
        logger.warn("[sessionRestorer] Session restore failed", error);
      } finally {
        setInitialized(true);
      }
    };

    restoreSession();
  }, [isInitialized, setInitialized, setToken, token]);

  // This component doesn't render anything
  return null;
}
