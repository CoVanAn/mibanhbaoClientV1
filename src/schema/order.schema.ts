import { z } from "zod";
import { OrderCouponSchema } from "./coupon.schema";

export const OrderStatusSchema = z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELED",
    "REFUNDED",
]);

export const FulfillmentMethodSchema = z.enum(["DELIVERY", "PICKUP"]);

export const PaymentStatusSchema = z.enum([
    "UNPAID",
    "AUTHORIZED",
    "PAID",
    "FAILED",
    "REFUNDED",
]);

export const OrderItemSchema = z.object({
    id: z.coerce.number(),
    productId: z.coerce.number().nullable(),
    variantId: z.coerce.number().nullable(),
    name: z.string(),
    variant: z.string().nullable(),
    sku: z.string().nullable(),
    image: z.string().nullable(),
    unitPrice: z.coerce.number(),
    quantity: z.coerce.number(),
    lineTotal: z.coerce.number(),
});

export const OrderAddressSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    phone: z.string(),
    company: z.string().nullable(),
    addressLine: z.string(),
    province: z.string(),
    district: z.string(),
    ward: z.string(),
});

export const OrderUserSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    email: z.string().trim().email(),
    phone: z.string().nullable(),
});

export const OrderStatusHistorySchema = z.object({
    id: z.coerce.number(),
    fromStatus: z.string().nullable(),
    toStatus: z.string(),
    reason: z.string().nullable(),
    changedBy: z
        .object({
            id: z.coerce.number(),
            name: z.string(),
        })
        .nullable(),
    createdAt: z.string(),
});

export const OrderPaymentSchema = z.object({
    id: z.coerce.number(),
    provider: z.string(),
    amount: z.coerce.number(),
    status: PaymentStatusSchema,
    paidAt: z.string().nullable(),
    createdAt: z.string(),
});

export const OrderShipmentSchema = z.object({
    id: z.coerce.number(),
    carrier: z.string().nullable(),
    trackingCode: z.string().nullable(),
    status: z.string().nullable(),
    shippedAt: z.string().nullable(),
    deliveredAt: z.string().nullable(),
});

export const OrderSchema = z.object({
    id: z.coerce.number(),
    code: z.string(),
    status: OrderStatusSchema,
    method: FulfillmentMethodSchema,
    currency: z.string(),
    itemsSubtotal: z.coerce.number(),
    shippingFee: z.coerce.number(),
    discount: z.coerce.number(),
    total: z.coerce.number(),
    customerNote: z.string().nullable(),
    internalNote: z.string().nullable(),
    pickupAt: z.string().nullable(),
    scheduledAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.coerce.number().nullable(),
    user: OrderUserSchema.nullable(),
    address: OrderAddressSchema.nullable(),
    items: z.array(OrderItemSchema),
    coupon: OrderCouponSchema.nullable(),
    statusHistory: z.array(OrderStatusHistorySchema),
    payments: z.array(OrderPaymentSchema),
    shipment: OrderShipmentSchema.nullable(),
});

export const PaginatedOrderListSchema = z.object({
    success: z.boolean(),
    orders: z.array(OrderSchema),
    pagination: z.object({
        page: z.coerce.number(),
        limit: z.coerce.number(),
        total: z.coerce.number(),
        totalPages: z.coerce.number(),
    }),
});

export const CreateOrderPayloadSchema = z.object({
    method: FulfillmentMethodSchema,
    addressId: z.coerce.number().int().positive().optional(),
    customerNote: z.string().max(500).optional(),
    pickupAt: z.string().optional(),
    scheduledAt: z.string().optional(),
});

export const CancelOrderPayloadSchema = z.object({
    reason: z.string().min(1).max(500),
});

export const OrderListParamsSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    status: OrderStatusSchema.optional(),
});

export type OrderItemData = z.infer<typeof OrderItemSchema>;
export type OrderAddressData = z.infer<typeof OrderAddressSchema>;
export type OrderUserData = z.infer<typeof OrderUserSchema>;
export type OrderCouponData = z.infer<typeof OrderCouponSchema>;
export type OrderStatusHistoryData = z.infer<typeof OrderStatusHistorySchema>;
export type OrderPaymentData = z.infer<typeof OrderPaymentSchema>;
export type OrderShipmentData = z.infer<typeof OrderShipmentSchema>;
export type OrderData = z.infer<typeof OrderSchema>;
export type PaginatedOrderListData = z.infer<typeof PaginatedOrderListSchema>;
export type CreateOrderPayloadData = z.infer<typeof CreateOrderPayloadSchema>;
export type CancelOrderPayloadData = z.infer<typeof CancelOrderPayloadSchema>;
export type OrderListParamsData = z.infer<typeof OrderListParamsSchema>;