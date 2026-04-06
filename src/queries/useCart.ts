/**
 * Cart Query Hooks
 * React Query hooks for cart operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { cartAPI, type Cart } from "@/src/apiRequests/cart";
import useStore, { UserSlice } from "@/src/store/user";

// Query Keys
export const cartKeys = {
  all: ["cart"] as const,
  detail: (scope: "guest" | "authenticated" = "guest") =>
    [...cartKeys.all, scope] as const,
};

// Hooks
export const useCart = () => {
  const token = useStore((state: UserSlice) => state.token);
  const scope = token ? "authenticated" : "guest";

  return useQuery({
    queryKey: cartKeys.detail(scope),
    queryFn: async () => {
      try {
        const cart = await cartAPI.getCart();
        return cart;
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;

        // Treat unauthenticated/missing cart as an empty cart state.
        if (status === 401 || status === 404) {
          return {
            id: null,
            items: [],
            coupon: null,
            subtotal: 0,
            totalItems: 0,
            currency: "VND",
          } as Cart;
        }

        // Surface network/server issues to UI instead of masking as "empty cart".
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.addItem,
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: cartKeys.all }, data);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.updateItem,
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: cartKeys.all }, data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.removeItem,
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: cartKeys.all }, data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.clearCart,
    onSuccess: () => {
      queryClient.setQueriesData({ queryKey: cartKeys.all }, {
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
      queryClient.setQueriesData({ queryKey: cartKeys.all }, data);
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.removeCoupon,
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: cartKeys.all }, data);
    },
  });
};

export const useMergeGuestCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.mergeGuestCart,
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: cartKeys.all }, data);
    },
  });
};

// Re-export types for convenience
export type { Cart, CartItem, AddToCartPayload, UpdateCartItemPayload } from "@/src/apiRequests/cart";
