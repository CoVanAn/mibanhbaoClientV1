import { z } from "zod";
import { CartCouponSchema } from "./coupon.schema";

export const CartItemSchema = z.object({
    id: z.coerce.number(),
    productId: z.coerce.number(),
    productName: z.string(),
    productSlug: z.string(),
    productImage: z.string().nullable(),
    variantId: z.coerce.number(),
    variantName: z.string(),
    variantSku: z.string(),
    quantity: z.coerce.number(),
    unitPrice: z.union([z.string(), z.number()]).transform((value) => String(value)),
    subtotal: z.coerce.number(),
    inStock: z.coerce.number(),
    isAvailable: z.boolean(),
});

export const CartSchema = z.object({
    id: z.coerce.number().nullable(),
    items: z.array(CartItemSchema),
    coupon: CartCouponSchema.nullable(),
    subtotal: z.coerce.number(),
    totalItems: z.coerce.number(),
    currency: z.string(),
    updatedAt: z.string().optional(),
});

export const AddToCartPayloadSchema = z.object({
    variantId: z.coerce.number().int().positive(),
    productId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().min(1).max(999),
});

export const UpdateCartItemPayloadSchema = z.object({
    itemId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().min(0).max(999),
});

export type CartItemData = z.infer<typeof CartItemSchema>;
export type CartData = z.infer<typeof CartSchema>;
export type AddToCartPayloadData = z.infer<typeof AddToCartPayloadSchema>;
export type UpdateCartItemPayloadData = z.infer<typeof UpdateCartItemPayloadSchema>;