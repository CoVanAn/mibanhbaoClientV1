import { z } from "zod";

export const PromotionTypeSchema = z.enum(["PERCENT", "FIXED"]);

export const CartCouponSchema = z.object({
    code: z.string(),
    type: PromotionTypeSchema,
    value: z.coerce.number(),
});

export const OrderCouponSchema = CartCouponSchema.extend({
    id: z.coerce.number(),
});

export type CartCouponData = z.infer<typeof CartCouponSchema>;
export type OrderCouponData = z.infer<typeof OrderCouponSchema>;