"use client";

import { useEffect, useRef } from "react";
import useStore from "@/src/store/useStore";
import authApiRequest from "@/src/apiRequests/auth";

/**
 * SessionRestorer Component
 * Restores user session using refreshToken from HttpOnly cookie
 * No longer uses localStorage for security (XSS protection)
 */
export function SessionRestorer() {
  const setToken = useStore((state: any) => state.setToken);
  const setInitialized = useStore((state: any) => state.setInitialized);
  const isInitialized = useStore((state: any) => state.isInitialized);
  const token = useStore((state: any) => state.token);
  
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
        console.log("[SessionRestorer] Attempting to restore session via refreshToken...");
        
        // Try to refresh token using refreshToken from HttpOnly cookie
        // This is the ONLY way to restore session after reload
        const response = await authApiRequest.refreshToken();
        
        if (response.success && response.accessToken) {
          console.log("[SessionRestorer] Session restored successfully");
          console.log("[SessionRestorer] AccessToken length:", response.accessToken.length);
          setToken(response.accessToken);
        } else {
          console.log("[SessionRestorer] No active session found - this is normal for logged out users");
        }
      } catch (error: any) {
        // Only log actual errors, not 401 (which is normal for logged out users)
        if (error?.response?.status !== 401) {
          console.error("[SessionRestorer] Unexpected error:", error);
        } else {
          console.log("[SessionRestorer] No valid refresh token - user needs to login");
        }
      } finally {
        setInitialized(true);
        console.log("[SessionRestorer] Initialization complete");
      }
    };

    restoreSession();
  }, []); // Empty dependency array - run ONLY once on mount

  // This component doesn't render anything
  return null;
}
