export type FulfillmentMethod = "DELIVERY" | "PICKUP";
export type PaymentMethod = "COD" | "BANKING";

export type CheckoutData = {
    method: FulfillmentMethod;
    addressId?: number;
    customerNote: string;
    pickupAt?: string;
    scheduledAt?: string;
    paymentMethod: PaymentMethod;
};
