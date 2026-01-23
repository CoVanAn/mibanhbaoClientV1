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
    const tokenParam = params.get("token");
    if (tokenParam) {
      set({ token: tokenParam });
      await get().loadCartData(tokenParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
});

export default createUserSlice;
