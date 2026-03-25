import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "@/src/store/constants";
import useStore from "@/src/store/user";
import {
  removeTokensFromLocalStorage,
  isTokenExpired,
} from "@/src/lib/tokenUtils";

/**
 * Get access token from Zustand store
 * This is safe because Zustand allows accessing state outside React components
 */
const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return useStore.getState().token || null;
};

/**
 * Set access token to Zustand store
 */
const setTokenToStore = (token: string): void => {
  if (typeof window === "undefined") return;
  useStore.getState().setToken(token);
};

/**
 * Clear access token from Zustand store
 */
const clearTokenFromStore = (): void => {
  if (typeof window === "undefined") return;
  useStore.getState().clearToken();
};

// Create axios instance with credentials enabled for HttpOnly cookies
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

// Track if we're currently refreshing token to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh access token via Route Handler
 */
const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    // Wait for ongoing refresh
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    // Call Route Handler instead of backend directly
    const response = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: unknown = await response.json();

    const isRefreshSuccess =
      typeof data === "object" &&
      data !== null &&
      "success" in data &&
      "accessToken" in data &&
      (data as { success: boolean }).success === true &&
      typeof (data as { accessToken: unknown }).accessToken === "string";

    if (isRefreshSuccess) {
      const accessToken = (data as { accessToken: string }).accessToken;
      // Store new access token in Zustand store (memory only)
      setTokenToStore(accessToken);

      // Update authorization header
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      isRefreshing = false;

      return accessToken;
    }

    isRefreshing = false;
    return null;
  } catch (error) {
    processQueue(error, null);
    isRefreshing = false;

    // Clear tokens on refresh failure
    clearTokenFromStore();
    removeTokensFromLocalStorage();

    throw error;
  }
};

// Request interceptor - add access token and proactively refresh if expiring soon
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from Zustand store (memory)
    if (typeof window !== "undefined") {
      const token = getAccessToken();

      if (token) {
        // Check if token is expiring soon (within 5 minutes)
        if (isTokenExpired(token, 5 * 60)) {
          try {
            // Proactively refresh before making the request
            const newToken = await refreshAccessToken();
            if (newToken) {
              config.headers.set("Authorization", `Bearer ${newToken}`);
            }
          } catch {
            // If refresh fails, try with current token anyway
            config.headers.set("Authorization", `Bearer ${token}`);
          }
        } else {
          // Token still valid, use it
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401 (fallback)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ code?: string }>) => {
    const originalRequest = error.config;
    const retriableRequest = originalRequest as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // If error is 401 and has TOKEN_EXPIRED code (fallback if proactive refresh missed)
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      retriableRequest &&
      !retriableRequest._retry
    ) {
      retriableRequest._retry = true;

      try {
        // Call refresh token via Route Handler
        const newToken = await refreshAccessToken();

        if (newToken) {
          retriableRequest.headers = {
            ...(retriableRequest.headers ?? {}),
            Authorization: `Bearer ${newToken}`,
          };
          // Retry original request with new token
          return apiClient(retriableRequest);
        }
      } catch (refreshError) {
        // Clear tokens and reject
        clearTokenFromStore();
        removeTokensFromLocalStorage();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to set access token
export const setAccessToken = (token: string) => {
  setTokenToStore(token);
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Helper to clear access token
export const clearAccessToken = () => {
  clearTokenFromStore();
  removeTokensFromLocalStorage();
  delete apiClient.defaults.headers.common["Authorization"];
};

export default apiClient;
