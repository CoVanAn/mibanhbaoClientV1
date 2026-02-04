/**
 * Cart API
 * Cart related API functions
 */

import apiClient from "@/src/lib/axios";

// Types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string | null;
  variantId: number;
  variantName: string;
  variantSku: string;
  quantity: number;
  unitPrice: string;
  subtotal: number;
  inStock: number;
  isAvailable: boolean;
}

export interface Cart {
  id: number | null;
  items: CartItem[];
  coupon: {
    code: string;
    type: string;
    value: number;
  } | null;
  subtotal: number;
  totalItems: number;
  currency: string;
  updatedAt?: string;
}

export interface AddToCartPayload {
  variantId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  itemId: number;
  quantity: number;
}

// API Functions
export const cartAPI = {
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get("/api/cart");
    return data.cart;
  },

  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const { data } = await apiClient.post("/api/cart/items", payload);
    return data.cart;
  },

  updateItem: async ({ itemId, quantity }: UpdateCartItemPayload): Promise<Cart> => {
    const { data } = await apiClient.put(
      `/api/cart/items/${itemId}`,
      { quantity }
    );
    return data.cart;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const { data } = await apiClient.delete(`/api/cart/items/${itemId}`);
    return data.cart;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/api/cart");
  },

  applyCoupon: async (couponCode: string): Promise<Cart> => {
    const { data } = await apiClient.post(
      "/api/cart/coupon",
      { couponCode }
    );
    return data.cart;
  },

  removeCoupon: async (): Promise<Cart> => {
    const { data } = await apiClient.delete("/api/cart/coupon");
    return data.cart;
  },

  mergeGuestCart: async (guestToken: string): Promise<Cart> => {
    const { data } = await apiClient.post(
      "/api/cart/merge",
      { guestToken }
    );
    return data.cart;
  },
};
