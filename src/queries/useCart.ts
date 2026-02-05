/**
 * Cart Query Hooks
 * React Query hooks for cart operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartAPI, type Cart } from "@/src/apiRequests/cart";

// Query Keys
export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all] as const,
};

// Hooks
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async () => {
      try {
        const cart = await cartAPI.getCart();
        console.log("Cart loaded successfully:", cart);
        return cart;
      } catch (error: any) {
        console.error("Error loading cart:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        
        // Return empty cart on error instead of throwing
        // This prevents the page from breaking
        return {
          id: null,
          items: [],
          coupon: null,
          subtotal: 0,
          totalItems: 0,
          currency: "VND",
        } as Cart;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on error, just return empty cart
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.addItem,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.updateItem,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.removeItem,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(cartKeys.detail(), {
        id: null,
        items: [],
        coupon: null,
        subtotal: 0,
        totalItems: 0,
        currency: "VND",
      } as Cart);
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.applyCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.removeCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
};

export const useMergeGuestCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.mergeGuestCart,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
};

// Re-export types for convenience
export type { Cart, CartItem, AddToCartPayload, UpdateCartItemPayload } from "@/src/apiRequests/cart";
