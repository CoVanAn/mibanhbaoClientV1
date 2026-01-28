/**
 * Cart API Queries
 * React Query hooks for cart operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api";

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
const cartApi = {
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

// React Query Hooks
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const cart = await cartApi.getCart();
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
        };
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
    mutationFn: cartApi.addItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.updateItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], {
        id: null,
        items: [],
        coupon: null,
        subtotal: 0,
        totalItems: 0,
        currency: "VND",
      });
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.applyCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useMergeGuestCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.mergeGuestCart,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};
