/**
 * Auth API
 * Authentication related API functions
 */

import apiClient from "@/src/lib/axios";

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
