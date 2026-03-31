import { create } from "zustand";
import authApiRequest from "@/src/apiRequests/auth";

export type UserSlice = {
  token: string;
  isInitialized: boolean;
  setToken: (tokenValue: string) => void;
  clearToken: () => void;
  setInitialized: (value: boolean) => void;
  handleGoogleLogin: () => Promise<void>;
};

// Access token only stored in memory (not persisted to localStorage)
// Refresh token is stored in HttpOnly cookie (managed by server)
const createUserSlice = (set: (partial: Partial<UserSlice>) => void): UserSlice => ({
  token: "", // Access token in memory only
  isInitialized: false, // Track if we've tried to refresh on mount

  setToken: (tokenValue: string) => {
    set({ token: tokenValue });
  },

  clearToken: () => {
    set({ token: "" });
  },

  setInitialized: (value: boolean) => {
    set({ isInitialized: value });
  },

  handleGoogleLogin: async () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const googleAuthStatus = params.get("googleAuth");

    if (googleAuthStatus === "success") {
      try {
        const response = await authApiRequest.refreshToken();

        if (response.success && response.accessToken) {
          set({ token: response.accessToken, isInitialized: true });
          window.dispatchEvent(new Event("google-login-success"));
        } else {
          set({ isInitialized: true });
          alert("Không thể khôi phục phiên đăng nhập Google. Vui lòng thử lại.");
        }
      } catch {
        set({ isInitialized: true });
        alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
      } finally {
        // Clean up URL regardless of refresh outcome
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (googleAuthStatus === "error") {
      set({ isInitialized: true });
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }
  },
});

const useStore = create<UserSlice>((set) => ({
  ...createUserSlice(set),
}));

export default useStore;
