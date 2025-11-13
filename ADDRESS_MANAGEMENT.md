# Quản lý Nhiều Địa Chỉ Giao Hàng - Address Management

## Tổng quan

Khách hàng có thể tạo nhiều địa chỉ giao hàng và chọn 1 địa chỉ mặc định để sử dụng khi đặt hàng.

## Tính năng

### ✅ Quản lý nhiều địa chỉ

- Thêm nhiều địa chỉ giao hàng (Nhà riêng, Văn phòng, v.v.)
- Chỉnh sửa thông tin địa chỉ đã lưu
- Xóa địa chỉ không dùng nữa
- Đặt/thay đổi địa chỉ mặc định

### ✅ Thông tin địa chỉ bao gồm:

- **Nhãn địa chỉ**: Tên gọi (Nhà riêng, Văn phòng...)
- **Người nhận**: Họ tên người nhận hàng
- **Số điện thoại**: SĐT liên hệ
- **Địa chỉ đầy đủ**: Địa chỉ chi tiết
- **Mặc định**: Đánh dấu địa chỉ mặc định

## Database Schema

### Address Model

```javascript
{
  customer: ObjectId,           // Ref to Customer
  label: String,                // "Nhà riêng", "Văn phòng"
  receiverName: String,         // Tên người nhận
  phone: String,                // SĐT (10-11 số)
  fullAddress: String,          // Địa chỉ đầy đủ
  isDefault: Boolean,           // Địa chỉ mặc định
  timestamps: true
}
```

### Pre-save Hook

- Khi đặt 1 địa chỉ làm mặc định → tự động bỏ mặc định các địa chỉ khác
- Địa chỉ đầu tiên tự động được đặt làm mặc định

## API Endpoints

### 1. Lấy danh sách địa chỉ

```
GET /api/customers/addresses
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "customer": "...",
      "label": "Nhà riêng",
      "receiverName": "Nguyễn Văn A",
      "phone": "0123456789",
      "fullAddress": "123 ABC, Phường XYZ, Quận 1, TP.HCM",
      "isDefault": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### 2. Thêm địa chỉ mới

```
POST /api/customers/addresses
Headers: Authorization: Bearer <token>
Body:
{
  "label": "Văn phòng",
  "receiverName": "Nguyễn Văn B",
  "phone": "0987654321",
  "fullAddress": "456 DEF, Phường GHI, Quận 3, TP.HCM",
  "isDefault": false
}

Response:
{
  "success": true,
  "message": "Thêm địa chỉ thành công",
  "data": { ... }
}
```

### 3. Cập nhật địa chỉ

```
PUT /api/customers/addresses/:id
Headers: Authorization: Bearer <token>
Body:
{
  "label": "Nhà riêng mới",
  "receiverName": "Nguyễn Văn A",
  "phone": "0123456789",
  "fullAddress": "789 XYZ, Phường ABC, Quận 5, TP.HCM",
  "isDefault": false
}
```

### 4. Đặt làm địa chỉ mặc định

```
PUT /api/customers/addresses/:id/set-default
Headers: Authorization: Bearer <token>
Body: {}

Response:
{
  "success": true,
  "message": "Đã đặt làm địa chỉ mặc định",
  "data": { ... }
}
```

### 5. Xóa địa chỉ

```
DELETE /api/customers/addresses/:id
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Đã xóa địa chỉ"
}

Note: Nếu xóa địa chỉ mặc định → tự động đặt địa chỉ khác làm mặc định
```

## Frontend Implementation

### State Management

```javascript
const showAddressDialog = ref(false) // Hiển thị dialog
const isSavingAddress = ref(false) // Loading state
const editingAddress = ref(null) // Address đang edit
const addresses = ref([]) // Danh sách addresses

const addressForm = ref({
  label: '',
  receiverName: '',
  phone: '',
  fullAddress: '',
  isDefault: false,
})
```

### Load Addresses

```javascript
const loadAddresses = async () => {
  const response = await axios.get('http://localhost:5000/api/customers/addresses', {
    headers: getAuthHeader(),
  })
  addresses.value = response.data.data || []
}
```

### Add New Address

```javascript
// Click "Thêm địa chỉ" → Reset form và mở dialog
addressForm.value = {
  label: '',
  receiverName: customer.value?.fullName || '',
  phone: customer.value?.phone || '',
  fullAddress: '',
  isDefault: addresses.value.length === 0, // Auto default if first
}
showAddressDialog.value = true
```

### Edit Address

```javascript
const editAddress = (address) => {
  editingAddress.value = address
  addressForm.value = {
    label: address.label,
    receiverName: address.receiverName,
    phone: address.phone,
    fullAddress: address.fullAddress,
    isDefault: address.isDefault,
  }
  showAddressDialog.value = true
}
```

### Save Address

```javascript
const handleSaveAddress = async () => {
  if (editingAddress.value) {
    // Update existing
    await axios.put(
      `http://localhost:5000/api/customers/addresses/${editingAddress.value._id}`,
      addressForm.value,
      { headers: getAuthHeader() },
    )
  } else {
    // Create new
    await axios.post('http://localhost:5000/api/customers/addresses', addressForm.value, {
      headers: getAuthHeader(),
    })
  }
  await loadAddresses()
  closeAddressDialog()
}
```

### Set Default

```javascript
const setDefaultAddress = async (addressId) => {
  await axios.put(
    `http://localhost:5000/api/customers/addresses/${addressId}/set-default`,
    {},
    { headers: getAuthHeader() },
  )
  await loadAddresses() // Refresh list
}
```

### Delete Address

```javascript
const deleteAddress = async (addressId) => {
  $q.dialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
    cancel: true,
  }).onOk(async () => {
    await axios.delete(`http://localhost:5000/api/customers/addresses/${addressId}`, {
      headers: getAuthHeader(),
    })
    await loadAddresses()
  })
}
```

## UI/UX Features

### Address Card Display

- Hiển thị badge "Mặc định" màu xanh cho địa chỉ mặc định
- Border màu xanh + background nhạt cho địa chỉ mặc định
- Sắp xếp: Địa chỉ mặc định lên đầu

### Action Buttons

- **Check icon** (màu xanh): Đặt làm mặc định (ẩn nếu đã mặc định)
- **Edit icon** (màu xanh dương): Chỉnh sửa
- **Trash icon** (màu đỏ): Xóa

### Dialog Form

- Validation HTML5 với `required` attribute
- Pattern validation cho phone: `[0-9]{10,11}`
- Checkbox "Đặt làm địa chỉ mặc định"
- Auto-fill tên và SĐT từ profile khi thêm mới

### Empty State

- Icon lớn + text khi chưa có địa chỉ nào
- Gợi ý "Thêm địa chỉ giao hàng để tiện cho việc đặt hàng"

## Validation

### Backend Validation (Express Validator)

```javascript
const addressValidation = [
  body('label').trim().notEmpty().withMessage('Vui lòng nhập nhãn địa chỉ'),
  body('receiverName').trim().notEmpty().withMessage('Vui lòng nhập tên người nhận'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('fullAddress').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ đầy đủ'),
]
```

### Frontend Validation (HTML5)

- `required` cho tất cả fields
- `type="tel"` + `pattern="[0-9]{10,11}"` cho phone
- `trim()` trên tất cả text inputs

## Business Logic

### Auto-set Default

1. **Địa chỉ đầu tiên** → Tự động đặt làm mặc định
2. **Đặt địa chỉ khác làm mặc định** → Bỏ mặc định địa chỉ cũ
3. **Xóa địa chỉ mặc định** → Tự động đặt địa chỉ khác làm mặc định (nếu còn)

### Security

- Tất cả endpoints đều require `protectCustomer` middleware
- Customer chỉ thấy/sửa/xóa địa chỉ của chính mình
- Query filter: `{ customer: req.customer._id }`

## Testing Checklist

### ✅ Add Address

- [ ] Thêm địa chỉ đầu tiên → Auto set default
- [ ] Thêm địa chỉ thứ 2 → Không auto set default
- [ ] Check "Đặt làm mặc định" khi thêm → Địa chỉ cũ mất default
- [ ] Validation: Bỏ trống field required → Hiện lỗi
- [ ] SĐT không hợp lệ → Hiện lỗi

### ✅ Edit Address

- [ ] Sửa thông tin địa chỉ → Lưu thành công
- [ ] Sửa và check "Đặt làm mặc định" → Địa chỉ khác mất default
- [ ] Validation vẫn hoạt động khi edit

### ✅ Set Default

- [ ] Click icon check → Địa chỉ đó thành default
- [ ] Địa chỉ cũ mất badge "Mặc định"
- [ ] Icon check biến mất ở địa chỉ vừa set default

### ✅ Delete Address

- [ ] Click trash → Hiện confirm dialog
- [ ] Cancel → Không xóa
- [ ] OK → Xóa thành công
- [ ] Xóa địa chỉ mặc định → Địa chỉ khác auto thành default
- [ ] Xóa địa chỉ cuối cùng → List trống, hiện empty state

### ✅ UI/UX

- [ ] Dialog responsive trên mobile
- [ ] Loading state khi save
- [ ] Toast notification sau mỗi action
- [ ] Addresses được sort: default lên đầu
- [ ] Border + background highlight cho địa chỉ mặc định

## Files Changed

### Frontend

- `src/pages/home/MyAccountPage.vue` - UI + Logic cho address management

### Backend

- `backend/src/models/Address.js` - Address schema với pre-save hook
- `backend/src/controllers/addressController.js` - CRUD controllers
- `backend/src/routes/customers.js` - Address routes với validation

## Integration Notes

### Khi đặt hàng (Checkout)

```javascript
// Get default address
const defaultAddress = addresses.value.find((addr) => addr.isDefault)

// Or let user select from list
const selectedAddress = addresses.value.find((addr) => addr._id === selectedId)
```

### Display trong Order

```javascript
order.shippingAddress = {
  receiverName: address.receiverName,
  phone: address.phone,
  fullAddress: address.fullAddress,
}
```

## Migration Notes

Nếu customer có field `address` (text) trong Customer model:

- Giữ lại field đó cho backward compatibility
- Hoặc migrate sang Address collection:

```javascript
// Migration script
const customers = await Customer.find({ address: { $exists: true, $ne: '' } })
for (const customer of customers) {
  await Address.create({
    customer: customer._id,
    label: 'Địa chỉ chính',
    receiverName: customer.fullName,
    phone: customer.phone,
    fullAddress: customer.address,
    isDefault: true,
  })
}
```

## Future Enhancements

- [ ] Tích hợp Google Maps API để chọn địa chỉ
- [ ] Auto-complete địa chỉ theo tỉnh/huyện/xã
- [ ] Lưu tọa độ GPS cho delivery tracking
- [ ] Thêm note/landmark cho địa chỉ
- [ ] Import/Export addresses
