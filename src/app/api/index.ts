/**
 * API Index
 * Central export for all API modules
 */

export { authAPI } from "./auth/auth";
export { cartAPI, type Cart, type CartItem, type AddToCartPayload, type UpdateCartItemPayload } from "./cart/route";
export { productAPI, type FetchProductListOptions, type ProductDetailData, type PaginatedProductListData, type ProductSummary } from "./product/route";
export { categoryAPI, type CategorySummary } from "./category/route";
export { accountAPI, type Address, type AddressForm, type ProfileForm, type User } from "./account/route";
