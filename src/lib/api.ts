import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/src/constants/api";

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
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
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
 * Decode JWT and check if token is expiring soon (within 2-5 minutes)
 */
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeLeft = exp - now;
    // Refresh if less than 5 minutes remaining
    return timeLeft < 5 * 60 * 1000;
  } catch (error) {
    // If can't decode, assume it's expiring
    return true;
  }
};

/**
 * Refresh access token using HttpOnly cookie
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
    const response = await axios.post(
      `${API_URL}/api/user/refresh-token`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      const { accessToken } = response.data;

      // Store new access token in memory
      if (typeof window !== "undefined") {
        (window as any).__accessToken = accessToken;
      }

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

    // Clear token on refresh failure
    if (typeof window !== "undefined") {
      delete (window as any).__accessToken;
    }

    throw error;
  }
};

// Request interceptor - add access token and proactively refresh if expiring soon
apiClient.interceptors.request.use(
  async (config) => {
    // Try to get token from store if available
    if (typeof window !== "undefined") {
      const token = (window as any).__accessToken;
      
      if (token) {
        // Check if token is expiring soon (within 5 minutes)
        if (isTokenExpiringSoon(token)) {
          try {
            // Proactively refresh before making the request
            const newToken = await refreshAccessToken();
            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
          } catch (error) {
            // If refresh fails, try with current token anyway
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          // Token still valid, use it
          config.headers.Authorization = `Bearer ${token}`;
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
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and has TOKEN_EXPIRED code (fallback if proactive refresh missed)
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh token
        const newToken = await refreshAccessToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry original request with new token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Clear token and reject
        if (typeof window !== "undefined") {
          delete (window as any).__accessToken;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to set access token in interceptor
export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    (window as any).__accessToken = token;
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Helper to clear access token
export const clearAccessToken = () => {
  if (typeof window !== "undefined") {
    delete (window as any).__accessToken;
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/api/user/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post("/api/user/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post("/api/user/refresh-token", {});
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/api/user/logout", {});
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/api/user/me");
    return response.data;
  },
};

export default apiClient;
