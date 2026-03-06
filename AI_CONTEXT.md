# AI_CONTEXT.md

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **State Management:** Zustand, React Context, custom hooks
- **API Communication:** RESTful (via apiRequests/ layer, axios)
- **Styling:** SCSS modules, global SCSS
- **Testing:** (Not specified)

## Architecture Overview

- **SPA/MPA hybrid:** Next.js App Router
- **Component-based structure**
- **Pages:** Organized by feature (account, cart, checkout, products, order-success, etc.)
- **API layer:** src/apiRequests/ for backend communication
- **Hooks:** src/queries/ and custom hooks for data fetching, business logic
- **Store:** Zustand for cart, user, product state
- **Schema:** Zod schemas for validation

## Data Flow

1. **User action** → React component → API call (apiRequests/)
2. **API response** → Hook/store updates state
3. **State/store** → UI re-renders

## API Summary

- **Auth:** Login, register, token, account info
- **User:** Profile, address, password, order history
- **Product:** List, detail, variants, search
- **Category:** List, filter
- **Cart:** Add, update, remove, sync with backend
- **Order:** Create, view, status, order success
- **Checkout:** Address, payment, confirmation

## State Strategy

- **Auth:** React Context, Zustand store (user)
- **Cart:** Zustand store (cart), sync with backend
- **Data:** React Query-like hooks (useProduct, useOrder, useCart, etc.)
- **UI State:** Local state in components, modals

## Business Rules

- **Authentication required** for checkout, account, order
- **Cart persistence** (localStorage + backend sync)
- **Form validation** via Zod schemas
- **Order creation:** Validate cart, address, payment before submit
- **Coupon/Promotion:** Áp dụng tại checkout, validate với backend
- **Address management:** CRUD cho user addresses

### Permission Matrix (Client)

| Role  | Account | Cart | Order | Address | Coupon |
| ----- | ------- | ---- | ----- | ------- | ------ |
| Guest | -       | CRUD | -     | -       | Apply  |
| User  | CRUD    | CRUD | CRUD  | CRUD    | Apply  |

### Order State Machine (Client)

```
pending → confirmed → shipping → completed
pending → cancelled
```

- Hiển thị trạng thái order cho user, cập nhật theo backend
- Khi order "confirmed": cart clear, hiển thị thông báo
- Khi order "cancelled": cho phép đặt lại
- Chỉ cho phép thao tác phù hợp với trạng thái (ví dụ: không thể hủy khi đã shipping)

### Data Model Relationships (Client)

```
User        1—N Order
Order       1—N OrderItem
OrderItem   1—1 Product/Variant
Product     1—N Variant
Category    1—N Product
Cart        1—N CartItem
```

### API Contract Example

// Auth API (POST /api/auth/login)
Request:
{
"email": "string",
"password": "string"
}
Response:
{
"token": "string",
"user": { "id": "string", "name": "string", ... }
}

// Cart API (POST /api/cart)
Request:
{
"items": [
{ "productId": "string", "variantId": "string", "qty": number }
]
}
Response:
{
"cartId": "string",
"items": [ ... ],
"total": number
}

// Order API (POST /api/order)
Request:
{
"cartId": "string",
"addressId": "string",
"paymentMethod": "cod" | "online",
"couponCode"?: "string"
}
Response:
{
"orderId": "string",
"status": "pending",
"total": number
}

// Coupon API (POST /api/coupon/apply)
Request:
{
"code": "string",
"cartId": "string"
}
Response:
{
"valid": true,
"discount": number,
"message"?: "string"
}

### UI/UX Flow

- Multi-step checkout: cart → address → payment → confirm
- Modal xác nhận khi đặt hàng thành công
- Cart đồng bộ giữa local và backend khi login/logout
- Responsive: useIsMobile hook cho UI mobile
- Advanced filter/search cho sản phẩm
- Address book: thêm/sửa/xóa địa chỉ, chọn địa chỉ mặc định
- Order tracking: user xem trạng thái đơn hàng, lịch sử
- Coupon: nhập mã, hiển thị kết quả áp dụng, thông báo lỗi

## Current Modules

- **Components:** auth, common, features, layouts
- **Pages:** account, cart, checkout, order-success, products, [slug], static pages
- **API:** apiRequests/ (account, auth, cart, category, order, product)
- **Hooks:** useAuth, useCart, useProduct, useOrder, useCategory, useIsMobile
- **Store:** cart, user, product, useStore
- **Schema:** account, category, product
- **Utils:** tokenUtils, constants, helpers
- **Styles:** SCSS modules, global SCSS

## Planned Features

- Promotion/coupon UI & logic (áp dụng, validate, hiển thị discount)
- Order tracking page (theo dõi trạng thái, lịch sử đơn hàng)
- Product recommendation engine (gợi ý sản phẩm dựa trên lịch sử/cart)
- Address book improvements (quản lý nhiều địa chỉ, chọn mặc định)
- Multi-language support (i18n, translations)
- Security token enhancement (see SECURITY_TOKEN_ENHANCEMENT.md)
- Guest checkout (không cần đăng nhập vẫn đặt hàng)
- Wishlist/favorite sản phẩm
