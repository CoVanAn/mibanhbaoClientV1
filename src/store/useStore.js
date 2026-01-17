import { create } from "zustand";
import axios from "axios";

const linkApi = "http://localhost:4000";

const readTokenFromStorage = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
};

const useStore = create((set, get) => ({
  url: linkApi,
  token: readTokenFromStorage(),
  food_list: [],
  cartItems: {},

  setToken: (tokenValue) => {
    if (typeof window !== "undefined") {
      if (tokenValue) {
        localStorage.setItem("token", tokenValue);
      } else {
        localStorage.removeItem("token");
      }
    }
    set({ token: tokenValue });
  },

  setCartItems: (items) => {
    set({ cartItems: items });
  },

  loadCartData: async (tokenValue) => {
    if (!tokenValue) {
      set({ cartItems: {} });
      return;
    }
    try {
      const response = await axios.post(
        `${linkApi}/api/cart/get`,
        {},
        { headers: { token: tokenValue } }
      );
      const data = response.data.cartData;
      set({ cartItems: data && typeof data === "object" ? data : {} });
    } catch (error) {
      console.error("Error loading cart data:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      set({ token: "", cartItems: {} });
    }
  },

  addToCart: async (id, quantity = 1) => {
    if (!id || quantity <= 0) return;
    set((state) => {
      const updated = { ...state.cartItems };
      updated[id] = (updated[id] || 0) + quantity;
      return { cartItems: updated };
    });
    const token = get().token;
    if (token && quantity > 0) {
      try {
        for (let i = 0; i < quantity; i += 1) {
          await axios.post(
            `${linkApi}/api/cart/add`,
            { itemId: id },
            { headers: { token } }
          );
        }
      } catch (error) {
        console.error("Error syncing addToCart:", error);
      }
    }
  },

  removeFromCart: async (id) => {
    if (!id) return;
    set((state) => {
      const updated = { ...state.cartItems };
      const current = updated[id] || 0;
      if (current <= 1) {
        delete updated[id];
      } else {
        updated[id] = current - 1;
      }
      return { cartItems: updated };
    });
    const token = get().token;
    if (token) {
      try {
        await axios.post(
          `${linkApi}/api/cart/remove`,
          { itemId: id },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error syncing removeFromCart:", error);
      }
    }
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

  getTotalCartAmount: () => {
    const { cartItems, food_list } = get();
    let total = 0;
    Object.keys(cartItems || {}).forEach((itemId) => {
      const quantity = cartItems[itemId];
      if (quantity > 0) {
        const itemInfo = (food_list || []).find((item) => item._id === itemId);
        if (itemInfo) {
          total += itemInfo.price * quantity;
        }
      }
    });
    return total;
  },
}));

export default useStore;
