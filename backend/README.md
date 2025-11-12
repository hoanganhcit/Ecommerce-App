# Ecommerce Backend API

Backend API server cho ứng dụng Ecommerce, sử dụng Node.js, Express và MongoDB.

## Cài đặt

1. **Cài đặt dependencies:**

```bash
cd backend
npm install
```

2. **Cấu hình môi trường:**
   File `.env` đã được tạo sẵn với cấu hình mặc định. Bạn có thể chỉnh sửa nếu cần:

- `MONGODB_URI`: mongodb://localhost:27017/ecommerce
- `JWT_SECRET`: Secret key cho JWT
- `ALLOWED_ORIGINS`: http://localhost:9000,http://localhost:8080

3. **Khởi động MongoDB:**
   Đảm bảo MongoDB đang chạy trên port 27017

4. **Seed dữ liệu mẫu:**

```bash
npm run seed
```

Dữ liệu được tạo:

- 2 users (admin + user)
- 20 products
- 12 customers
- 5 categories

**Login credentials:**

- Admin: `admin@ecommerce.com` / `admin123`
- User: `user@ecommerce.com` / `user123`

## Chạy Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Đăng ký tài khoản
- `POST /login` - Đăng nhập
- `GET /me` - Lấy thông tin user hiện tại (Protected)
- `PUT /profile` - Cập nhật profile (Protected)
- `PUT /change-password` - Đổi mật khẩu (Protected)

### Products (`/api/products`)

- `GET /` - Danh sách sản phẩm (Public)
  - Query params: `category`, `minPrice`, `maxPrice`, `sizes`, `colors`, `collections`, `search`, `sort`, `page`, `limit`
- `GET /featured` - Sản phẩm nổi bật (Public)
- `GET /slug/:slug` - Lấy sản phẩm theo slug (Public)
- `GET /:id` - Chi tiết sản phẩm (Public)
- `POST /` - Tạo sản phẩm (Admin)
- `PUT /:id` - Cập nhật sản phẩm (Admin)
- `DELETE /:id` - Xóa sản phẩm (Admin)

### Orders (`/api/orders`)

- `POST /` - Tạo đơn hàng (Public)
- `GET /` - Danh sách đơn hàng (Admin)
- `GET /:id` - Chi tiết đơn hàng (Protected)
- `GET /customer/:customerId` - Đơn hàng của khách (Protected)
- `PUT /:id/status` - Cập nhật trạng thái (Admin)
- `PUT /:id/cancel` - Hủy đơn hàng (Protected)

### Customers (`/api/customers`)

- `GET /` - Danh sách khách hàng (Admin)
- `GET /stats` - Thống kê khách hàng (Admin)
- `GET /:id` - Chi tiết khách hàng (Admin)
- `POST /` - Tạo khách hàng (Admin)
- `PUT /:id` - Cập nhật khách hàng (Admin)
- `DELETE /:id` - Xóa khách hàng (Admin)

## Request Examples

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0901234567"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

### Create Order

```bash
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "productId": "64a1b2c3d4e5f6g7h8i9j0k1",
      "quantity": 2,
      "size": "M",
      "color": "Đen"
    }
  ],
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "customer@email.com"
  },
  "shippingAddress": {
    "address": "123 Lê Lợi",
    "city": "TP.HCM",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "paymentMethod": "cod",
  "voucher": {
    "code": "FREESHIP",
    "type": "freeship"
  },
  "notes": "Giao giờ hành chính"
}
```

### Get Products with Filters

```bash
GET /api/products?category=men&minPrice=100000&maxPrice=500000&page=1&limit=12
```

## Authentication

Protected routes yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Models

### User

- username, email, password, fullName, phone, avatar
- role: 'user' | 'admin'
- addresses, birthday, gender
- timestamps

### Product

- name, slug, description, price, originalPrice, discount
- category, images, thumbnail
- sizes, colors, collections, tags
- stock, sold, rating
- specifications

### Order

- orderId, customer, items[]
- customerInfo, shippingAddress
- paymentMethod, paymentStatus, status
- subtotal, shippingFee, discount, total
- statusHistory[]

### Customer

- customerId, name, email, phone, avatar
- address, joinDate
- totalOrders, totalSpent, status
- lastOrder

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Product.js       # Product model
│   │   ├── Order.js         # Order model
│   │   ├── Customer.js      # Customer model
│   │   └── Category.js      # Category model
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── customerController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── customers.js
│   ├── middleware/
│   │   ├── auth.js          # JWT middleware
│   │   └── validate.js      # Validation middleware
│   ├── seeders/
│   │   └── seed.js          # Database seeder
│   └── server.js            # Entry point
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
└── package.json
```

## Scripts

```bash
npm start       # Production
npm run dev     # Development with nodemon
npm run seed    # Seed database
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Validation
- **multer**: File upload
- **helmet**: Security headers
- **compression**: Response compression
- **morgan**: HTTP request logger

## Notes

- Đảm bảo MongoDB đang chạy trước khi start server
- Sử dụng `.env` file để cấu hình
- Port mặc định: 5000
- Seed database trước khi test API
