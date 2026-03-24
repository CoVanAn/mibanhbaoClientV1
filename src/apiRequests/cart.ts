/**
 * Cart API Requests
 * Cart related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";
import {
  AddToCartPayloadSchema,
  CartSchema,
  UpdateCartItemPayloadSchema,
  type AddToCartPayloadData,
  type CartData,
  type CartItemData,
  type UpdateCartItemPayloadData,
} from "@/src/schema/cart.schema";

// Types
export type CartItem = CartItemData;
export type Cart = CartData;
export type AddToCartPayload = AddToCartPayloadData;
export type UpdateCartItemPayload = UpdateCartItemPayloadData;

const parseCart = (payload: unknown): Cart => {
  const parsed = CartSchema.safeParse(payload);

  if (!parsed.success) {
    console.error("Unexpected cart shape", parsed.error);
    throw new Error("Không thể đồng bộ giỏ hàng");
  }

  return parsed.data;
};

const extractCart = (payload: unknown): Cart => {
  const cart = (payload as { cart?: unknown })?.cart;

  if (!cart) {
    throw new Error("Không thể đồng bộ giỏ hàng");
  }

  return parseCart(cart);
};

// API Functions
export const cartAPI = {
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get("/api/cart");
    return extractCart(data);
  },

  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const body = AddToCartPayloadSchema.parse(payload);
    const { data } = await apiClient.post("/api/cart/items", body);
    return extractCart(data);
  },

  updateItem: async ({
    itemId,
    quantity,
  }: UpdateCartItemPayload): Promise<Cart> => {
    const parsed = UpdateCartItemPayloadSchema.parse({ itemId, quantity });
    const { data } = await apiClient.put(`/api/cart/items/${parsed.itemId}`, {
      quantity: parsed.quantity,
    });
    return extractCart(data);
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const { data } = await apiClient.delete(`/api/cart/items/${itemId}`);
    return extractCart(data);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/api/cart");
  },

  applyCoupon: async (couponCode: string): Promise<Cart> => {
    const normalizedCode = couponCode.trim().toUpperCase();
    const { data } = await apiClient.post("/api/cart/coupon", {
      couponCode: normalizedCode,
    });
    return extractCart(data);
  },

  removeCoupon: async (): Promise<Cart> => {
    const { data } = await apiClient.delete("/api/cart/coupon");
    return extractCart(data);
  },

  mergeGuestCart: async (guestToken: string): Promise<Cart> => {
    const { data } = await apiClient.post("/api/cart/merge", { guestToken });
    return extractCart(data);
  },
};
