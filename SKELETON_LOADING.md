# Skeleton Loading Components

Đã tạo các skeleton loading components cho admin panel:

## Components đã tạo:

### 1. SkeletonCard.vue

- Component skeleton cho stat cards
- Hiển thị placeholder cho số liệu thống kê

### 2. SkeletonTable.vue

- Component skeleton cho bảng dữ liệu
- Props:
  - `rows`: số dòng hiển thị (default: 5)
  - `withImage`: có hiển thị placeholder ảnh không (default: true)

### 3. SkeletonChart.vue

- Component skeleton cho biểu đồ
- Hiển thị placeholder cho chart với bars

### 4. SkeletonDashboard.vue

- Component skeleton tổng hợp cho trang Dashboard
- Bao gồm: header, stats cards, charts, và table

### 5. SkeletonProductList.vue

- Component skeleton cho trang danh sách sản phẩm
- Bao gồm: header, stats cards, filters, và table

### 6. SkeletonProductForm.vue

- Component skeleton cho form thêm/sửa sản phẩm
- Bao gồm: image upload areas, input fields, variants section

## Đã áp dụng skeleton loading cho:

✅ **DashboardPage.vue**

- Import: `SkeletonDashboard`
- Loading state: `loading` (default: true)

✅ **ProductListPage.vue**

- Import: `SkeletonProductList`
- Loading state: `isLoading` (default: true)

✅ **AddProductPage.vue**

- Import: `SkeletonProductForm`
- Loading state: `isLoading` (default: false, chỉ bật khi fetch data)

✅ **CategoryPage.vue**

- Import: `SkeletonProductList`
- Loading state: `loading`

## Các trang cần áp dụng thêm:

Để áp dụng cho các trang còn lại, cần:

1. **OrdersDashboardPage.vue**
2. **CustomersDashboardPage.vue**
3. **SettingsDashboardPage.vue**
4. **AnalyticsDashboardPage.vue**

### Cách áp dụng:

```vue
<template>
  <!-- Skeleton Loading -->
  <SkeletonProductList v-if="loading" />

  <!-- Main Content -->
  <div v-else class="original-content">...</div>
</template>

<script setup>
import SkeletonProductList from '@/components/admin/SkeletonProductList.vue'
const loading = ref(true)

// Trong hàm fetch data:
const fetchData = async () => {
  loading.value = true
  try {
    // fetch data...
  } finally {
    loading.value = false
  }
}
</script>
```

## Animation:

Tất cả skeleton components đều có animation pulse tự động:

- Opacity chuyển đổi giữa 1 và 0.5
- Duration: 2s
- Infinite loop
