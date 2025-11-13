# Auth Store - Hướng dẫn sử dụng

## 📦 Cấu trúc Auth Store

File: `src/stores/useAuthStore.js`

### State được quản lý:

- `customer`: Thông tin khách hàng hiện tại
- `token`: JWT token để xác thực API

### Computed Properties:

- `isAuthenticated`: Boolean - Kiểm tra user đã đăng nhập chưa
- `userName`: String - Tên khách hàng (hiển thị trong MenuDrawer)
- `userEmail`: String - Email khách hàng
- `userAvatar`: String - Link avatar

### Methods:

- `login(customerData, authToken)`: Lưu thông tin đăng nhập
- `logout()`: Xóa thông tin đăng nhập
- `updateCustomer(customerData)`: Cập nhật thông tin khách hàng
- `getAuthHeader()`: Lấy header Authorization cho API calls

---

## 🔄 Luồng hoạt động

### 1. Đăng ký (RegisterPage.vue)

```
User điền form → Submit →
POST /api/customers/register →
Backend trả về {customer, token} →
Gọi login(customer, token) →
Lưu vào localStorage →
Redirect to /
```

### 2. Đăng nhập (LoginPage.vue)

```
User điền email/password → Submit →
POST /api/customers/login →
Backend trả về {customer, token} →
Gọi login(customer, token) →
Lưu vào localStorage →
Redirect to /
```

### 3. Hiển thị tên user (MenuDrawer.vue)

```
Component mount →
Đọc userName từ auth store →
Nếu có: Hiển thị tên + nút Đăng xuất
Nếu không: Hiển thị "Khách" + nút Đăng nhập/Đăng ký
```

### 4. Cập nhật profile (MyAccountPage.vue)

```
Page load →
Đọc customer từ auth store →
Hiển thị trong form

User chỉnh sửa → Submit →
PUT /api/customers/profile (với token) →
Backend trả về data mới →
Gọi updateCustomer(data) →
Cập nhật localStorage
```

### 5. Đăng xuất (MenuDrawer.vue / MyAccountPage.vue)

```
User click Đăng xuất →
Confirm dialog →
Gọi logout() →
Xóa localStorage →
Redirect to /
```

---

## 💾 LocalStorage

Dữ liệu được lưu tự động:

- `customer`: JSON string của thông tin khách hàng
- `token`: JWT token

Dữ liệu này được load lại khi:

- Refresh trang
- Đóng/mở trình duyệt
- Navigate giữa các trang

---

## 🔒 Protected Routes (Tương lai)

Để bảo vệ các route cần đăng nhập:

```javascript
// router/index.js
import { useAuthStore } from 'src/stores/useAuthStore'

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuthStore()

  // Routes cần đăng nhập
  const protectedRoutes = ['/account', '/orders', '/checkout']

  if (protectedRoutes.includes(to.path) && !isAuthenticated.value) {
    next('/login')
  } else {
    next()
  }
})
```

---

## 📋 API Calls với Token

Tất cả API calls cần authentication:

```javascript
import { useAuthStore } from 'src/stores/useAuthStore'
import axios from 'axios'

const { getAuthHeader } = useAuthStore()

// Ví dụ
const response = await axios.get('http://localhost:5000/api/customers/profile', {
  headers: getAuthHeader(),
})

// Header tự động thêm: Authorization: Bearer <token>
```

---

## ✅ Files đã tích hợp Auth Store

1. **MenuDrawer.vue** ✓
   - Hiển thị tên user khi đã đăng nhập
   - Hiển thị avatar
   - Nút đăng xuất

2. **LoginPage.vue** ✓
   - Gọi API login
   - Lưu customer & token vào store
   - Redirect sau khi login thành công

3. **RegisterPage.vue** ✓
   - Gọi API register
   - Tự động login sau khi đăng ký thành công
   - Redirect to home

4. **MyAccountPage.vue** ✓
   - Load thông tin từ auth store
   - Cập nhật profile qua API
   - Đổi mật khẩu
   - Đăng xuất

---

## 🎯 Kết quả

Khi user đăng nhập/đăng ký thành công:

- **MenuDrawer** sẽ hiển thị tên user thay vì "Khách"
- Avatar được hiển thị (nếu có)
- Nút "Đăng xuất" xuất hiện
- Thông tin được persist qua sessions
- Mọi API call tự động gửi kèm token
