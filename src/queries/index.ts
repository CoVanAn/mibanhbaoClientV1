/**
 * Queries Index
 * Central export for all React Query hooks
 */

// Cart
export {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useApplyCoupon,
  useRemoveCoupon,
  useMergeGuestCart,
  cartKeys,
  type Cart,
  type CartItem,
  type AddToCartPayload,
  type UpdateCartItemPayload,
} from "./useCart";

// Product
export {
  useProduct,
  useProductList,
  productKeys,
  type ProductDetailData,
  type PaginatedProductListData,
  type ProductSummary,
  type FetchProductListOptions,
} from "./useProduct";

// Order
export {
  useMyOrders,
  useOrder,
  useOrderHistory,
  useCreateOrder,
  useCancelOrder,
  useInvalidateOrders,
  orderKeys,
} from "./useOrder";
export type {
  Order,
  OrderItem,
  CreateOrderPayload,
  CancelOrderPayload,
  OrderListParams,
  PaginatedOrderList,
} from "../apiRequests/order";

// Category
export {
  useCategories,
  categoryKeys,
  type CategorySummary,
} from "./useCategory";

// Account
export {
  useProfile,
  useUpdateProfile,
  useAddresses,
  useSaveAddress,
  useDeleteAddress,
  useChangePassword,
  accountKeys,
  type Address,
  type AddressForm,
  type ProfileForm,
  type User,
} from "./useAccount";
