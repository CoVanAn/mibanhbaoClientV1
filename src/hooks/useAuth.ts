import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "@/src/store/useStore";
import { authAPI, setAccessToken } from "@/src/lib/api";

/**
 * Hook to handle authentication initialization
 * Automatically refreshes access token on mount using HttpOnly cookie
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const isInitialized = useStore((state: any) => state.isInitialized);
  const setInitialized = useStore((state: any) => state.setInitialized);
  const setToken = useStore((state: any) => state.setToken);
  const clearToken = useStore((state: any) => state.clearToken);

  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return;

    const initAuth = async () => {
      try {
        // Try to refresh access token using HttpOnly cookie
        const response = await authAPI.refreshToken();
        
        if (response.success && response.accessToken) {
          // Set token in store and axios interceptor
          setToken(response.accessToken);
          setAccessToken(response.accessToken);
          
          // Refetch cart after token is restored
          console.log("Token restored, refetching cart...");
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      } catch (error) {
        // No valid refresh token cookie, user needs to login
        console.log("No valid session, user needs to login");
        clearToken();
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [isInitialized, setInitialized, setToken, clearToken, queryClient]);

  return { isInitialized };
};
