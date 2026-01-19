const readTokenFromStorage = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
};

const createUserSlice = (set: any, get: any) => ({
  token: readTokenFromStorage(),

  setToken: (tokenValue: string) => {
    if (typeof window !== "undefined") {
      if (tokenValue) {
        localStorage.setItem("token", tokenValue);
      } else {
        localStorage.removeItem("token");
      }
    }
    set({ token: tokenValue });
  },

  handleGoogleLogin: async () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      set({ token: tokenParam });
      localStorage.setItem("token", tokenParam);
      await get().loadCartData(tokenParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
});

export default createUserSlice;
