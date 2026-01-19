import axios from "axios";
import { API_URL } from "@/src/store/constants";

const createCartSlice = (set: any, get: any) => ({
  cartItems: {},

  setCartItems: (items: any) => {
    set({ cartItems: items });
  },

  loadCartData: async (tokenValue: string) => {
    if (!tokenValue) {
      set({ cartItems: {} });
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/get`,
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

  addToCart: async (id: string, quantity: number = 1) => {
    if (!id || quantity <= 0) return;
    set((state: any) => {
      const updated = { ...state.cartItems };
      updated[id] = (updated[id] || 0) + quantity;
      return { cartItems: updated };
    });
    const token = get().token;
    if (token && quantity > 0) {
      try {
        for (let i = 0; i < quantity; i += 1) {
          await axios.post(
            `${API_URL}/api/cart/add`,
            { itemId: id },
            { headers: { token } }
          );
        }
      } catch (error) {
        console.error("Error syncing addToCart:", error);
      }
    }
  },

  removeFromCart: async (id: string) => {
    if (!id) return;
    set((state: any) => {
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
          `${API_URL}/api/cart/remove`,
          { itemId: id },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error syncing removeFromCart:", error);
      }
    }
  },

  getTotalCartAmount: () => {
    const { cartItems, food_list } = get();
    let total = 0;
    Object.keys(cartItems || {}).forEach((itemId) => {
      const quantity = cartItems[itemId];
      if (quantity > 0) {
        const itemInfo = (food_list || []).find((item: any) => item._id === itemId);
        if (itemInfo) {
          total += itemInfo.price * quantity;
        }
      }
    });
    return total;
  },
});

export default createCartSlice;
