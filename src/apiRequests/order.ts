/**
 * Order API Requests
 * Order related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";

// Types
export interface OrderItem {
  id: number;
  productId: number | null;
  variantId: number | null;
  name: string;
  variant: string | null;
  sku: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderAddress {
  id: number;
  name: string;
  phone: string;
  company: string | null;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
}

export interface OrderUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface OrderCoupon {
  id: number;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
}

export interface OrderStatusHistory {
  id: number;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  changedBy: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
}

export interface OrderPayment {
  id: number;
  provider: string;
  amount: number;
  status: "UNPAID" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";
  paidAt: string | null;
  createdAt: string;
}

export interface OrderShipment {
  id: number;
  carrier: string | null;
  trackingCode: string | null;
  status: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface Order {
  id: number;
  code: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "COMPLETED"
    | "CANCELED"
    | "REFUNDED";
  method: "DELIVERY" | "PICKUP";
  currency: string;
  itemsSubtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  customerNote: string | null;
  internalNote: string | null;
  pickupAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
  user: OrderUser | null;
  address: OrderAddress | null;
  items: OrderItem[];
  coupon: OrderCoupon | null;
  statusHistory: OrderStatusHistory[];
  payments: OrderPayment[];
  shipment: OrderShipment | null;
}

export interface CreateOrderPayload {
  method: "DELIVERY" | "PICKUP";
  addressId?: number;
  customerNote?: string;
  pickupAt?: string; // ISO datetime
  scheduledAt?: string; // ISO datetime
}

export interface CancelOrderPayload {
  reason: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "COMPLETED"
    | "CANCELED"
    | "REFUNDED";
}

export interface PaginatedOrderList {
  success: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Functions
export const orderAPI = {
  /**
   * Create order from cart
   */
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiClient.post("/api/order/create", payload);
    return response.data.order;
  },

  /**
   * Get user's orders
   */
  getMyOrders: async (params?: OrderListParams): Promise<PaginatedOrderList> => {
    const response = await apiClient.get("/api/order/my", { params });
    return response.data;
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get(`/api/order/${orderId}`);
    return response.data.order;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (
    orderId: number,
    payload: CancelOrderPayload
  ): Promise<Order> => {
    const response = await apiClient.post(`/api/order/${orderId}/cancel`, payload);
    return response.data.order;
  },

  /**
   * Get order status history
   */
  getOrderHistory: async (orderId: number): Promise<OrderStatusHistory[]> => {
    const response = await apiClient.get(`/api/order/${orderId}/history`);
    return response.data.history;
  },
};
