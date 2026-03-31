/**
 * Order API Requests
 * Order related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";
import {
  CancelOrderPayloadSchema,
  CreateOrderPayloadSchema,
  OrderListParamsSchema,
  OrderSchema,
  OrderStatusHistorySchema,
  PaginatedOrderListSchema,
  type CancelOrderPayloadData,
  type CreateOrderPayloadData,
  type OrderAddressData,
  type OrderCouponData,
  type OrderData,
  type OrderItemData,
  type OrderListParamsData,
  type OrderPaymentData,
  type OrderShipmentData,
  type OrderStatusHistoryData,
  type OrderUserData,
  type PaginatedOrderListData,
} from "@/src/schema/order.schema";

// Types
export type OrderItem = OrderItemData;
export type OrderAddress = OrderAddressData;
export type OrderUser = OrderUserData;
export type OrderCoupon = OrderCouponData;
export type OrderStatusHistory = OrderStatusHistoryData;
export type OrderPayment = OrderPaymentData;
export type OrderShipment = OrderShipmentData;
export type Order = OrderData;
export type CreateOrderPayload = CreateOrderPayloadData;
export type CancelOrderPayload = CancelOrderPayloadData;
export type OrderListParams = OrderListParamsData;
export type PaginatedOrderList = PaginatedOrderListData;

const parseOrder = (payload: unknown): Order => {
  const parsed = OrderSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Không thể tải đơn hàng");
  }

  return parsed.data;
};

const parseOrderList = (payload: unknown): PaginatedOrderList => {
  const parsed = PaginatedOrderListSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Không thể tải danh sách đơn hàng");
  }

  return parsed.data;
};

const parseOrderHistory = (payload: unknown): OrderStatusHistory[] => {
  const parsed = OrderStatusHistorySchema.array().safeParse(payload);

  if (!parsed.success) {
    throw new Error("Không thể tải lịch sử đơn hàng");
  }

  return parsed.data;
};

const extractOrder = (payload: unknown): Order => {
  const order = (payload as { order?: unknown })?.order;

  if (!order) {
    throw new Error("Không thể tải đơn hàng");
  }

  return parseOrder(order);
};

// API Functions
export const orderAPI = {
  /**
   * Create order from cart
   */
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const body = CreateOrderPayloadSchema.parse(payload);
    const response = await apiClient.post("/api/order/create", body);
    return extractOrder(response.data);
  },

  /**
   * Get user's orders
   */
  getMyOrders: async (params?: OrderListParams): Promise<PaginatedOrderList> => {
    const query = params ? OrderListParamsSchema.parse(params) : undefined;
    const response = await apiClient.get("/api/order/my", { params: query });
    return parseOrderList(response.data);
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get(`/api/order/${orderId}`);
    return extractOrder(response.data);
  },

  /**
   * Cancel order
   */
  cancelOrder: async (
    orderId: number,
    payload: CancelOrderPayload
  ): Promise<Order> => {
    const body = CancelOrderPayloadSchema.parse(payload);
    const response = await apiClient.post(`/api/order/${orderId}/cancel`, body);
    return extractOrder(response.data);
  },

  /**
   * Get order status history
   */
  getOrderHistory: async (orderId: number): Promise<OrderStatusHistory[]> => {
    const response = await apiClient.get(`/api/order/${orderId}/history`);
    const history = (response.data as { history?: unknown })?.history;

    if (!history) {
      return [];
    }

    return parseOrderHistory(history);
  },
};
