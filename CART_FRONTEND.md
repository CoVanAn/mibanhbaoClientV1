# Cart Implementation - Frontend

## Tổng quan

Đã triển khai đầy đủ giao diện giỏ hàng cho Client project (Next.js) với:

- ✅ React Query hooks để quản lý state
- ✅ UI Components (CartDrawer, CartItemCard, CartSummary, CartIcon)
- ✅ Toast notifications
- ✅ Tích hợp vào product page
- ✅ Shopping cart icon trong header

## Cấu trúc Files

```
Client/src/
├── queries/
│   └── cart.ts                    # React Query hooks
├── components/
│   ├── cart/
│   │   ├── CartDrawer.tsx        # Drawer chính
│   │   ├── CartDrawer.module.scss
│   │   ├── CartItemCard.tsx      # Item card với quantity controls
│   │   ├── CartItemCard.module.scss
│   │   ├── CartSummary.tsx       # Tổng tiền, coupon, checkout
│   │   ├── CartSummary.module.scss
│   │   ├── CartIcon.tsx          # Icon giỏ hàng với badge
│   │   ├── CartIcon.module.scss
│   │   └── index.ts
│   ├── common/
│   │   ├── Toast.tsx             # Toast notification system
│   │   └── Toast.module.scss
│   └── Header/
│       └── Header.tsx            # Đã thêm CartIcon
├── app/
│   └── [slug]/
│       ├── ProductVariant.tsx    # Đã cập nhật dùng React Query
│       └── ProductHero.tsx       # Truyền productId vào VariantSelector
└── lib/
    └── providers.tsx             # Đã wrap ToastProvider
```

## React Query Hooks

### Queries

```typescript
// Lấy giỏ hàng
const { data: cart, isLoading } = useCart();
```

### Mutations

```typescript
// Thêm vào giỏ
const addToCart = useAddToCart();
await addToCart.mutateAsync({
  productId: 123,
  variantId: 456,
  quantity: 2,
});

// Cập nhật số lượng
const updateItem = useUpdateCartItem();
await updateItem.mutateAsync({
  itemId: 789,
  quantity: 5,
});

// Xóa item
const removeItem = useRemoveCartItem();
await removeItem.mutateAsync(itemId);

// Xóa toàn bộ giỏ
const clearCart = useClearCart();
await clearCart.mutateAsync();

// Apply coupon
const applyCoupon = useApplyCoupon();
await applyCoupon.mutateAsync("DISCOUNT10");

// Remove coupon
const removeCoupon = useRemoveCoupon();
await removeCoupon.mutateAsync();
```

## Components

### 1. CartIcon (Header)

Hiển thị icon giỏ hàng với badge số lượng:

```tsx
import { CartIcon } from "@/src/components/cart";

<CartIcon />;
```

**Features:**

- Badge hiển thị tổng số item
- Click để mở CartDrawer
- Badge animation khi số lượng thay đổi

### 2. CartDrawer

Drawer trượt từ bên phải hiển thị giỏ hàng:

```tsx
const [isOpen, setIsOpen] = useState(false);

<CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />;
```

**Features:**

- Overlay để đóng drawer
- Header với số lượng item
- Nút "Xóa toàn bộ"
- Empty state khi giỏ trống
- Loading state

### 3. CartItemCard

Card hiển thị từng sản phẩm trong giỏ:

**Features:**

- Product image, name, variant
- Quantity controls (-, input, +)
- Nút xóa item
- Stock warnings
- Price display
- Disabled state khi đang update

### 4. CartSummary

Tổng kết giỏ hàng:

**Features:**

- Coupon input với apply/remove
- Subtotal, discount, shipping note
- Total calculation
- Checkout button (navigate to /checkout)

### 5. Toast Notification

Simple toast system để hiển thị thông báo:

```tsx
import { useToast } from "@/src/components/common/Toast";

const toast = useToast();

toast.success("Thành công!");
toast.error("Lỗi!");
toast.info("Thông tin");
```

**Features:**

- Auto dismiss sau 3 giây
- Slide animation
- Multiple toasts stack
- Responsive

## Product Page Integration

File `ProductVariant.tsx` đã được cập nhật:

```tsx
import { useAddToCart } from "@/src/queries/cart";
import { useToast } from "@/src/components/common/Toast";

// In component
const addToCart = useAddToCart();
const toast = useToast();

const handleAddToCart = async () => {
  try {
    await addToCart.mutateAsync({
      productId,
      variantId: Number(selectedVariant.id),
      quantity,
    });
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "Không thể thêm vào giỏ hàng";
    toast.error(errorMsg);
  }
};
```

## API Configuration

File `cart.ts` đã config axios:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true, // Quan trọng: Để gửi cookies (guestToken)
});
```

**Environment Variable:**

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Testing

### 1. Test Add to Cart

1. Vào trang product: `/[slug]`
2. Chọn variant và số lượng
3. Click "Thêm vào giỏ hàng"
4. Kiểm tra:
   - Toast notification hiện "Đã thêm..."
   - Badge ở CartIcon cập nhật số lượng
   - Network tab có request POST /api/cart/items

### 2. Test Cart Drawer

1. Click vào CartIcon ở header
2. Drawer mở từ bên phải
3. Kiểm tra hiển thị items
4. Test quantity controls (+, -, input)
5. Test nút xóa item
6. Test nút "Xóa toàn bộ"

### 3. Test Coupon

1. Mở cart drawer
2. Nhập mã coupon: "DISCOUNT10"
3. Click "Áp dụng"
4. Kiểm tra discount hiển thị
5. Click icon X để remove coupon

### 4. Test Guest Flow

1. Mở DevTools > Application > Cookies
2. Xóa cookies (clear)
3. Add product to cart
4. Kiểm tra có cookie `guestToken` được tạo
5. Refresh page
6. Giỏ hàng vẫn còn (dựa vào guestToken)

### 5. Test Authenticated Flow

1. Đăng nhập
2. Add product to cart
3. Kiểm tra cart được lưu vào userId
4. Logout
5. Login lại
6. Cart vẫn còn

## Troubleshooting

### CartIcon không hiển thị badge

**Nguyên nhân:** React Query chưa fetch cart data

**Giải pháp:**

- Kiểm tra Network tab có GET /api/cart
- Kiểm tra `withCredentials: true` trong axios config
- Kiểm tra backend đã set CORS headers:
  ```javascript
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
  ```

### Toast không hiện

**Nguyên nhân:** ToastProvider chưa được wrap

**Giải pháp:**

- Kiểm tra `lib/providers.tsx` đã có `<ToastProvider>`
- Kiểm tra layout.tsx đã wrap `<Providers>`

### Add to cart lỗi "productId is required"

**Nguyên nhân:** ProductVariant không nhận được productId

**Giải pháp:**

- Kiểm tra ProductHero đã truyền `productId={product.id}`
- Kiểm tra ProductDetailContext có expose product.id

### Cookie không được gửi

**Nguyên nhân:** `withCredentials: true` bị thiếu

**Giải pháp:**

- Kiểm tra axios config có `withCredentials: true`
- Backend phải set `Access-Control-Allow-Credentials: true`
- Backend `Access-Control-Allow-Origin` không được dùng `*`

## Next Steps

### Optional Enhancements

1. **Skeleton Loading**
   - Thêm skeleton UI cho cart drawer loading state
   - Skeleton cho cart items

2. **Optimistic Updates**
   - Cập nhật UI ngay lập tức trước khi API response
   - Rollback nếu API failed

3. **Cart Sync Between Tabs**
   - Sử dụng BroadcastChannel API
   - Sync cart state giữa các tabs

4. **Analytics**
   - Track "Add to Cart" events
   - Track "Remove from Cart" events
   - Track "Checkout Initiated"

5. **Cart Recommendations**
   - "Frequently bought together"
   - "You may also like"

6. **Mini Cart Preview**
   - Hover CartIcon → Show mini preview
   - Quick view recent added items

7. **Persistent Cart Animation**
   - Animation khi item được thêm vào cart
   - Flying animation từ product → cart icon

## API Endpoints Used

```
GET    /api/cart                  # Lấy giỏ hàng
POST   /api/cart/items            # Thêm item
PUT    /api/cart/items/:itemId    # Cập nhật quantity
DELETE /api/cart/items/:itemId    # Xóa item
DELETE /api/cart                  # Xóa toàn bộ
POST   /api/cart/coupon           # Apply coupon
DELETE /api/cart/coupon           # Remove coupon
POST   /api/cart/merge            # Merge guest cart (after login)
```

## Type Definitions

```typescript
type CartItem = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string;
  variantId: number;
  variantName: string;
  variantSku: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  inStock: number;
  isAvailable: boolean;
};

type Cart = {
  id: number;
  items: CartItem[];
  coupon?: {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  };
  subtotal: string;
  discount?: string;
  total?: string;
  totalItems: number;
  currency: string;
};
```

## Completed ✅

- [x] React Query cart hooks
- [x] CartDrawer component
- [x] CartItemCard component
- [x] CartSummary component
- [x] CartIcon component
- [x] Toast notification system
- [x] Product page integration
- [x] Header integration
- [x] Error handling
- [x] Loading states
- [x] Type safety
- [x] Responsive design
- [x] Animations

## Related Documentation

- Backend: `Server/CART_API.md`
- Testing: `Server/CART_TESTING.md`
- Validation: `Server/VALIDATION.md`
