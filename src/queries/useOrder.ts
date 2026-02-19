/**
 * Order Query Hooks
 * React Query hooks for order operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orderAPI, type Order, type CreateOrderPayload, type CancelOrderPayload, type OrderListParams } from "@/src/apiRequests/order";
import { cartKeys } from "./useCart";

// Query Keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: OrderListParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  history: (id: number) => [...orderKeys.detail(id), "history"] as const,
};

// Hooks

/**
 * Get user's orders
 */
export const useMyOrders = (params?: OrderListParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderAPI.getMyOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Get order by ID
 */
export const useOrder = (orderId: number) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderAPI.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get order status history
 */
export const useOrderHistory = (orderId: number) => {
  return useQuery({
    queryKey: orderKeys.history(orderId),
    queryFn: () => orderAPI.getOrderHistory(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Create order from cart
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderAPI.createOrder(payload),
    onSuccess: (order) => {
      // Invalidate cart (it's now empty)
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      
      // Invalidate order lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Cache the new order
      queryClient.setQueryData(orderKeys.detail(order.id), order);

      // Redirect to order success page
      router.push(`/order-success/${order.code}`);
    },
  });
};

/**
 * Cancel order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: number; payload: CancelOrderPayload }) =>
      orderAPI.cancelOrder(orderId, payload),
    onSuccess: (order) => {
      // Update cached order
      queryClient.setQueryData(orderKeys.detail(order.id), order);

      // Invalidate order lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Invalidate history
      queryClient.invalidateQueries({ queryKey: orderKeys.history(order.id) });
    },
  });
};

/**
 * Invalidate all order queries
 */
export const useInvalidateOrders = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
  };
};
