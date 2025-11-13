# Cập nhật MyAccountPage - Quản lý thông tin khách hàng

## Những thay đổi đã thực hiện

### 1. Frontend - MyAccountPage.vue

#### ✅ Đã xóa dữ liệu mẫu (mock data)

- Loại bỏ các field: `birthday`, `gender`
- Xóa mảng `addresses` hardcoded
- Xóa `genderOptions` không sử dụng

#### ✅ Tải dữ liệu thật từ Auth Store

```javascript
onMounted(async () => {
  if (customer.value) {
    profile.value = {
      fullName: customer.value.fullName || '',
      phone: customer.value.phone || '',
      email: customer.value.email || '',
      avatar: customer.value.avatar || '',
      address: customer.value.address || '',
    }
    originalProfile.value = { ...profile.value }
  } else {
    router.push('/login')
  }
})
```

#### ✅ Upload Avatar mới

- Thêm input file ẩn với ref `avatarInput`
- Validate file type (chỉ nhận image/\*)
- Validate file size (tối đa 5MB)
- Upload qua FormData API
- Hiển thị loading progress
- Tự động cập nhật avatar sau upload thành công

```javascript
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate
  if (!file.type.startsWith('image/')) {
    // Notify error
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    // Notify error
    return
  }

  // Upload
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await axios.post('http://localhost:5000/api/customers/upload-avatar', formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

  // Update local state
  profile.value.avatar = response.data.data.avatar
  updateCustomer(response.data.data)
}
```

#### ✅ Cập nhật thông tin profile

- Chỉ gửi các field cần thiết: `fullName`, `phone`, `address`
- Không gửi `avatar` trong update profile (upload riêng)
- Cập nhật auth store sau khi save thành công
- Hiển thị trạng thái loading khi đang lưu

#### ✅ Đổi mật khẩu

- Validate mật khẩu mới ít nhất 6 ký tự
- Kiểm tra confirm password khớp
- Xóa form sau khi đổi thành công

#### ✅ Quản lý địa chỉ

- Hiển thị trường `address` dạng textarea
- Cho phép chỉnh sửa khi bật chế độ edit
- Lưu cùng với thông tin profile

### 2. Backend Updates

#### ✅ Upload Avatar Controller

File: `backend/src/controllers/customerAuthController.js`

**Cấu hình Multer:**

```javascript
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/avatars'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Chỉ chấp nhận file ảnh'), false)
  }
  cb(null, true)
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})
```

**Upload Avatar Function:**

```javascript
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh',
      })
    }

    const customer = await Customer.findById(req.customer._id)

    // Delete old avatar
    if (customer.avatar) {
      const oldAvatarPath = customer.avatar.replace('http://localhost:5000/', '')
      const fullPath = path.join(process.cwd(), oldAvatarPath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    }

    // Update new avatar
    const avatarUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`
    customer.avatar = avatarUrl
    await customer.save()

    res.json({
      success: true,
      message: 'Upload ảnh đại diện thành công',
      data: {
        id: customer._id,
        customerId: customer.customerId,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        avatar: customer.avatar,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi upload ảnh',
    })
  }
}
```

#### ✅ Route cho Upload Avatar

File: `backend/src/routes/customers.js`

```javascript
import { upload, uploadAvatar } from '../controllers/customerAuthController.js'

// Protected route
router.post('/upload-avatar', protectCustomer, upload.single('avatar'), uploadAvatar)
```

#### ✅ Static File Serving

File: `backend/src/server.js`

```javascript
// Serve uploaded files
app.use('/uploads', express.static('public/uploads'))
```

## Cấu trúc thư mục

```
backend/
  public/
    uploads/
      avatars/          # Avatar images sẽ lưu ở đây
        avatar-123456.jpg
        avatar-789012.png
```

## API Endpoints

### 1. Upload Avatar

```
POST /api/customers/upload-avatar
Headers:
  Authorization: Bearer <token>
Body (multipart/form-data):
  avatar: <file>

Response:
{
  "success": true,
  "message": "Upload ảnh đại diện thành công",
  "data": {
    "id": "...",
    "customerId": "CUST001",
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "address": "123 ABC Street",
    "avatar": "http://localhost:5000/uploads/avatars/avatar-123456.jpg"
  }
}
```

### 2. Update Profile

```
PUT /api/customers/profile
Headers:
  Authorization: Bearer <token>
Body:
{
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 ABC Street"
}
```

### 3. Change Password

```
PUT /api/customers/change-password
Headers:
  Authorization: Bearer <token>
Body:
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

## Hướng dẫn sử dụng

### 1. Đăng nhập

- Truy cập `/login`
- Nhập email và password
- Sau khi đăng nhập thành công, thông tin customer lưu vào auth store

### 2. Xem thông tin tài khoản

- Truy cập `/account`
- Hiển thị thông tin: Avatar, Họ tên, Email, SĐT, Địa chỉ, Mã KH

### 3. Chỉnh sửa thông tin

- Click nút "Chỉnh sửa"
- Các trường có thể sửa: Họ tên, SĐT, Địa chỉ
- Email là readonly (không thể sửa)
- Click "Lưu thay đổi" để cập nhật

### 4. Upload Avatar

- Click vào icon camera trên avatar (chỉ hiện khi đang ở chế độ edit)
- Chọn file ảnh (max 5MB)
- Ảnh sẽ tự động upload và hiển thị ngay lập tức

### 5. Đổi mật khẩu

- Nhập mật khẩu hiện tại
- Nhập mật khẩu mới (ít nhất 6 ký tự)
- Xác nhận mật khẩu mới
- Click "Đổi mật khẩu"

## Validation

### Frontend Validation

- Avatar: Chỉ file ảnh, max 5MB
- Mật khẩu mới: Ít nhất 6 ký tự
- Confirm password: Phải khớp với mật khẩu mới

### Backend Validation

- File type: Chỉ chấp nhận image/\*
- File size: Max 5MB (cấu hình trong multer)
- Password: Min 6 ký tự

## Error Handling

### Upload Avatar Errors

- File không phải ảnh → "Vui lòng chọn file ảnh"
- File > 5MB → "Kích thước ảnh không được vượt quá 5MB"
- Upload thất bại → "Tải lên ảnh thất bại. Vui lòng thử lại."

### Update Profile Errors

- Không tìm thấy customer → "Không tìm thấy thông tin khách hàng"
- Lỗi server → "Cập nhật thất bại. Vui lòng thử lại."

### Change Password Errors

- Mật khẩu hiện tại sai → "Mật khẩu hiện tại không đúng"
- Confirm password không khớp → "Mật khẩu xác nhận không khớp"
- Mật khẩu mới < 6 ký tự → "Mật khẩu mới phải có ít nhất 6 ký tự"

## Features đã loại bỏ

❌ Không còn birthday và gender fields
❌ Không còn address book (multiple addresses)
❌ Địa chỉ giờ là 1 text field duy nhất

## Tính năng mới

✅ Upload avatar với preview realtime
✅ Tự động xóa avatar cũ khi upload ảnh mới
✅ Loading indicator khi upload
✅ Validation đầy đủ cho file upload
✅ Static file serving cho images
✅ Tích hợp hoàn toàn với auth store
✅ Redirect về login nếu chưa đăng nhập

## Testing

1. **Test Upload Avatar:**
   - Upload ảnh hợp lệ → Thành công
   - Upload file không phải ảnh → Lỗi
   - Upload ảnh > 5MB → Lỗi

2. **Test Update Profile:**
   - Sửa họ tên → Lưu thành công
   - Sửa SĐT → Lưu thành công
   - Sửa địa chỉ → Lưu thành công
   - Click Hủy → Reset về giá trị cũ

3. **Test Change Password:**
   - Nhập sai password cũ → Lỗi
   - Confirm không khớp → Lỗi
   - Password mới < 6 ký tự → Lỗi
   - Đổi thành công → Xóa form

4. **Test Auth State:**
   - Chưa login → Redirect về /login
   - Đã login → Hiển thị đúng thông tin customer
   - Logout → Xóa state và về trang chủ
