import { create } from "zustand";
import axios from "axios";

const linkApi = "http://localhost:4000";

const useStore = create((set, get) => ({
  url: linkApi,
  token: "",
  cartItems: {},
  food_list: [],

  setToken: (tokenValue) => {
    set({ token: tokenValue });
  },

  // setCartItems: (items) => {
  //   set({ cartItems: items });
  // },

  // fetchFoodList: async () => {
  //   try {
  //     const response = await axios.get(`${linkApi}/api/food/list`);
  //     set({ food_list: response.data });
  //   } catch (error) {
  //     console.error("Error fetching food list:", error);
  //   }
  // },

  // loadCartData: async (tokenValue) => {
  //   try {
  //     const response = await axios.post(
  //       `${linkApi}/api/cart/get`,
  //       {},
  //       { headers: { token: tokenValue } }
  //     );
  //     const data = response.data.cartData;
  //     set({ cartItems: data && typeof data === "object" ? data : {} });
  //   } catch (error) {
  //     console.error("Error loading cart data:", error);
  //     if (typeof window !== "undefined") {
  //       localStorage.removeItem("token");
  //     }
  //     set({ token: "", cartItems: {} });
  //   }
  // },

  // addToCart: async (id) => {
  //   set((state) => {
  //     const updated = { ...state.cartItems };
  //     updated[id] = (updated[id] || 0) + 1;
  //     return { cartItems: updated };
  //   });
  //   if (get().token) {
  //     try {
  //       await axios.post(
  //         `${linkApi}/api/cart/add`,
  //         { itemId: id },
  //         { headers: { token: get().token } }
  //       );
  //     } catch (error) {
  //       console.error("Error syncing addToCart:", error);
  //     }
  //   }
  // },

  // removeFromCart: async (id) => {
  //   set((state) => {
  //     const updated = { ...state.cartItems };
  //     const current = updated[id] || 0;
  //     if (current <= 1) {
  //       delete updated[id];
  //     } else {
  //       updated[id] = current - 1;
  //     }
  //     return { cartItems: updated };
  //   });
  //   if (get().token) {
  //     try {
  //       await axios.post(
  //         `${linkApi}/api/cart/remove`,
  //         { itemId: id },
  //         { headers: { token: get().token } }
  //       );
  //     } catch (error) {
  //       console.error("Error syncing removeFromCart:", error);
  //     }
  //   }
  // },

  handleGoogleLogin: async () => {
    if (typeof window === "undefined") {
      return;
    }
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
