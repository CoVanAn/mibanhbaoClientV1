// Access token only stored in memory (not persisted to localStorage)
// Refresh token is stored in HttpOnly cookie (managed by server)
const createUserSlice = (set: any, get: any) => ({
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
      // Google login successful, access token is in cookie
      // Read access token from cookie (non-HttpOnly)
      const accessToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("accessToken="))
        ?.split("=")[1];
      
      if (accessToken) {
        set({ token: accessToken, isInitialized: true });
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Dispatch custom event to trigger refetch in other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("google-login-success"));
        }
        
        console.log("[Google Login] Token set successfully, triggering refetch");
      }
    } else if (googleAuthStatus === "error") {
      console.error("Google authentication failed");
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }
  },
});

export default createUserSlice;
