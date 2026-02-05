/**
 * API Requests Index
 * Central export for all API request modules
 *
 * Note: These call the backend API directly via axios
 * Auth uses Route Handlers for cookie management
 */

// Auth (via Route Handlers)
export { default as authApiRequest } from "./auth";
export type { LoginBody, RegisterBody, AuthUser, AuthResponse } from "./auth";

// Account
export { accountAPI } from "./account";
export type { Address, AddressForm, ProfileForm, User } from "./account";

// Cart
export { cartAPI } from "./cart";
export type {
  Cart,
  CartItem,
  AddToCartPayload,
  UpdateCartItemPayload,
} from "./cart";

// Product
export { productAPI } from "./product";
export type {
  FetchProductListOptions,
  ProductDetailData,
  PaginatedProductListData,
  ProductSummary,
} from "./product";

// Category
export { categoryAPI } from "./category";
export type { CategorySummary } from "./category";
