import { create } from "zustand";

export type UserSlice = {
  token: string;
  isInitialized: boolean;
  setToken: (tokenValue: string) => void;
  clearToken: () => void;
  setInitialized: (value: boolean) => void;
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
});

const useStore = create<UserSlice>((set) => ({
  ...createUserSlice(set),
}));

export default useStore;
