/**
 * API Index
 * Central export for all API modules
 * 
 * Note: This file is deprecated. Use apiRequests/ instead.
 * @deprecated
 */

// Re-export from apiRequests for backward compatibility
export type { Cart, CartItem, AddToCartPayload, UpdateCartItemPayload } from "@/src/apiRequests/cart";
export type { ProductDetailData, ProductSummary } from "@/src/apiRequests/product";
export type { CategorySummary } from "@/src/apiRequests/category";
export type { Address, ProfileForm, User } from "@/src/apiRequests/account";
