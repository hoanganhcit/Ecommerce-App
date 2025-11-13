# Hướng dẫn Debug Upload Avatar

## Vấn đề gặp phải

Upload avatar báo lỗi: "Tải lên ảnh thất bại. Vui lòng thử lại."

## Nguyên nhân và Giải pháp

### 1. ✅ Không nên set Content-Type header cho multipart/form-data

**Vấn đề:**

```javascript
headers: {
  ...getAuthHeader(),
  'Content-Type': 'multipart/form-data', // ❌ SAI - Thiếu boundary
}
```

**Giải pháp:**

```javascript
headers: getAuthHeader(), // ✅ ĐÚNG - Browser tự động set Content-Type với boundary
```

**Lý do:**
Khi upload file với FormData, browser sẽ tự động set `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`
Nếu ta set manually thì sẽ thiếu boundary → server không parse được file.

### 2. ✅ Tạo thư mục uploads

Backend multer cần thư mục `public/uploads/avatars` phải tồn tại:

```bash
cd backend
mkdir -p public/uploads/avatars
```

Hoặc code tự động tạo (đã có trong controller):

```javascript
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
```

### 3. ✅ Kiểm tra backend server đang chạy

```powershell
# Kiểm tra Node.js processes
Get-Process node

# Backend nên chạy trên port 5000
netstat -ano | findstr :5000
```

### 4. ✅ Improved Error Handling

Giờ frontend sẽ log chi tiết lỗi:

- Server error (response.status, response.data)
- Network error (no response from server)
- Request setup error

Check console.log để xem lỗi cụ thể.

## Cách Test Upload Avatar

### Bước 1: Đảm bảo đã đăng nhập

- Đăng nhập vào hệ thống để có token
- Check localStorage có `customer` và `token` không

### Bước 2: Vào trang Account

```
http://localhost:9000/account
```

### Bước 3: Upload Avatar

1. Click nút "Chỉnh sửa"
2. Click icon camera trên avatar
3. Chọn file ảnh (jpg, png, gif, max 5MB)
4. Xem console log để debug

### Bước 4: Check Response

**Nếu thành công:**

```json
{
  "success": true,
  "message": "Upload ảnh đại diện thành công",
  "data": {
    "avatar": "http://localhost:5000/uploads/avatars/avatar-1699876543210-123456789.jpg",
    ...
  }
}
```

**Nếu thất bại, check console:**

- `Server error: 401` → Token sai hoặc hết hạn
- `Server error: 400` → Không có file hoặc file type sai
- `Server error: 500` → Lỗi server (check backend logs)
- `No response from server` → Backend không chạy hoặc wrong URL

## Debug Backend

### Check backend logs

Backend nên có logs:

```
Upload avatar error: [error details]
```

### Test route trực tiếp với Postman/Thunder Client

**Endpoint:**

```
POST http://localhost:5000/api/customers/upload-avatar
```

**Headers:**

```
Authorization: Bearer <your-token>
```

**Body (form-data):**

```
avatar: [chọn file ảnh]
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Upload ảnh đại diện thành công",
  "data": {
    "id": "...",
    "customerId": "CUST001",
    "avatar": "http://localhost:5000/uploads/avatars/avatar-xxx.jpg"
  }
}
```

## Common Issues & Solutions

### 1. "Vui lòng đăng nhập để tiếp tục" (401)

**Nguyên nhân:** Token không có hoặc không hợp lệ

**Giải pháp:**

- Logout và login lại
- Check localStorage.getItem('token')
- Check token có format `Bearer xxx` không

### 2. "Vui lòng chọn file ảnh" (400)

**Nguyên nhân:** req.file is undefined

**Giải pháp:**

- Check FormData đúng format: `formData.append('avatar', file)`
- Check field name phải là 'avatar' (match với `upload.single('avatar')`)
- Không set Content-Type header manually

### 3. "Chỉ chấp nhận file ảnh" (400)

**Nguyên nhân:** File type không phải image

**Giải pháp:**

- Chỉ upload jpg, png, gif
- Check file.mimetype startsWith 'image/'

### 4. File quá lớn (413 Payload Too Large)

**Nguyên nhân:** File > 5MB

**Giải pháp:**

- Resize/compress ảnh trước khi upload
- Hoặc tăng limit trong multer config

### 5. "ENOENT: no such file or directory"

**Nguyên nhân:** Thư mục upload không tồn tại

**Giải pháp:**

```bash
mkdir -p backend/public/uploads/avatars
```

### 6. CORS Error

**Nguyên nhân:** Frontend và backend khác origin

**Giải pháp:**
Check backend có CORS middleware:

```javascript
app.use(
  cors({
    origin: 'http://localhost:9000',
    credentials: true,
  }),
)
```

## Files Modified

### Frontend

- `src/pages/home/MyAccountPage.vue`
  - Removed manual Content-Type header
  - Improved error logging
  - Added detailed error messages

### Backend

- `backend/src/controllers/customerAuthController.js`
  - Multer config with auto-create directory
  - File filter for images only
  - Error handling

## Testing Checklist

- [ ] Backend server đang chạy (port 5000)
- [ ] Thư mục `backend/public/uploads/avatars` tồn tại
- [ ] Đã đăng nhập (có token trong localStorage)
- [ ] Token hợp lệ và chưa hết hạn
- [ ] Upload file ảnh < 5MB
- [ ] Check console.log khi upload
- [ ] Check backend logs nếu có lỗi
- [ ] Avatar hiển thị sau upload thành công
- [ ] Avatar URL lưu vào database
- [ ] Ảnh cũ bị xóa khi upload ảnh mới

## Next Steps

Nếu vẫn còn lỗi sau khi sửa:

1. **Open Browser Console (F12)**
2. **Upload avatar**
3. **Check console logs:**
   - "Upload avatar error: ..."
   - "Error response: ..."
   - "Server error: [status] [data]"

4. **Copy lỗi và báo lại để debug tiếp**

5. **Check Network tab:**
   - Request URL đúng không?
   - Request Headers có Authorization không?
   - Request Payload có file không?
   - Response status code?
   - Response data?
