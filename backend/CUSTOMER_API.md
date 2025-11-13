# Customer Authentication API Documentation

## Mô tả

Backend API để quản lý đăng ký, đăng nhập và cập nhật thông tin khách hàng.

## Cấu trúc dữ liệu Customer.js

### Fields:

- `customerId`: String (tự động tạo - CUST001, CUST002, ...)
- `fullName`: String (bắt buộc, min 3 ký tự) - Từ RegisterPage
- `email`: String (bắt buộc, unique) - Từ RegisterPage & LoginPage
- `password`: String (bắt buộc, min 6 ký tự, mã hóa) - Từ RegisterPage & LoginPage
- `phone`: String (bắt buộc, 10-11 số) - Từ RegisterPage
- `address`: String - Từ RegisterPage & MyAccountPage
- `avatar`: String (mặc định)
- `joinDate`: Date (tự động)
- `totalOrders`: Number (mặc định 0)
- `totalSpent`: Number (mặc định 0)
- `status`: Enum ['active', 'inactive', 'vip']

### Methods:

- `comparePassword(candidatePassword)`: So sánh mật khẩu khi login

---

## API Endpoints

### 🔓 Public Routes (Không cần token)

#### 1. Đăng ký tài khoản

**POST** `/api/customers/register`

**Request Body:**

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "example@email.com",
  "phone": "0123456789",
  "password": "123456",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "customer": {
      "id": "...",
      "customerId": "CUST001",
      "fullName": "Nguyễn Văn A",
      "email": "example@email.com",
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "avatar": "https://i.pravatar.cc/150?img=1"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Sử dụng trong:** `RegisterPage.vue`

---

#### 2. Đăng nhập

**POST** `/api/customers/login`

**Request Body:**

```json
{
  "email": "example@email.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "customer": {
      "id": "...",
      "customerId": "CUST001",
      "fullName": "Nguyễn Văn A",
      "email": "example@email.com",
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "avatar": "https://i.pravatar.cc/150?img=1",
      "totalOrders": 0,
      "totalSpent": 0,
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Sử dụng trong:** `LoginPage.vue`

---

### 🔒 Protected Routes (Cần token)

**Header cần thiết:**

```
Authorization: Bearer <token>
```

#### 3. Lấy thông tin profile

**GET** `/api/customers/profile`

**Response:**

```json
{
  "success": true,
  "data": {
    "customerId": "CUST001",
    "fullName": "Nguyễn Văn A",
    "email": "example@email.com",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "avatar": "https://i.pravatar.cc/150?img=1",
    "totalOrders": 5,
    "totalSpent": 1500000,
    "status": "active",
    "joinDate": "2025-01-01T00:00:00.000Z"
  }
}
```

**Sử dụng trong:** `MyAccountPage.vue` (khi load trang)

---

#### 4. Cập nhật profile

**PUT** `/api/customers/profile`

**Request Body:**

```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321",
  "address": "456 Đường XYZ, Quận 2, TP.HCM",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": { ... }
}
```

**Sử dụng trong:** `MyAccountPage.vue` (khi user nhấn Save)

---

#### 5. Đổi mật khẩu

**PUT** `/api/customers/change-password`

**Request Body:**

```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

**Sử dụng trong:** `MyAccountPage.vue` (phần đổi mật khẩu)

---

## Luồng hoạt động

### 1. RegisterPage.vue → Backend

```
User điền form → Submit → POST /api/customers/register →
Lưu vào MongoDB (Customer model) → Trả về token →
Lưu token vào localStorage → Redirect to /login
```

### 2. LoginPage.vue → Backend

```
User điền email/password → Submit → POST /api/customers/login →
Kiểm tra email & password → Trả về token →
Lưu token vào localStorage → Redirect to /
```

### 3. MyAccountPage.vue → Backend

```
Page load → GET /api/customers/profile (với token) →
Hiển thị thông tin user

User chỉnh sửa → PUT /api/customers/profile (với token) →
Cập nhật MongoDB → Trả về data mới
```

---

## Bảo mật

1. **Password**: Tự động mã hóa bằng bcrypt trước khi lưu
2. **Token**: JWT với expiry 30 ngày
3. **Middleware**: `protectCustomer` kiểm tra token hợp lệ
4. **Validation**: Express-validator kiểm tra input

---

## Lưu ý

- Token được lưu trong localStorage của frontend
- Mỗi request protected cần gửi token trong header `Authorization: Bearer <token>`
- Password không bao giờ trả về trong response (sử dụng `select: false`)
- Email phải unique (không trùng lặp)
