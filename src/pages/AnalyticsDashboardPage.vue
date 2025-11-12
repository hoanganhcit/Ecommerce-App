<template>
  <q-page class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-gray-900">Thống kê & Phân tích</div>
      <p class="text-gray-600 mt-1">Báo cáo doanh thu và hiệu suất kinh doanh</p>
    </div>

    <!-- Time Range Filter -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium text-gray-700">Khoảng thời gian:</div>
        <q-btn-group unelevated>
          <q-btn
            v-for="range in timeRanges"
            :key="range.value"
            :label="range.label"
            :color="selectedTimeRange === range.value ? 'primary' : 'grey-3'"
            :text-color="selectedTimeRange === range.value ? 'white' : 'grey-8'"
            @click="selectedTimeRange = range.value"
            no-caps
          />
        </q-btn-group>
        <q-space />
        <div class="flex gap-2">
          <q-input v-model="customStartDate" outlined dense type="date" label="Từ ngày" />
          <q-input v-model="customEndDate" outlined dense type="date" label="Đến ngày" />
          <q-btn label="Áp dụng" color="primary" unelevated @click="applyCustomRange" />
        </div>
      </div>
    </div>

    <!-- Revenue Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in revenueStats"
        :key="stat.label"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center', stat.bgColor]">
            <i :class="[stat.icon, 'text-xl', stat.iconColor]"></i>
          </div>
          <div v-if="stat.trend" class="flex items-center gap-1">
            <i
              :class="[
                stat.trend > 0
                  ? 'fas fa-arrow-up text-green-500'
                  : 'fas fa-arrow-down text-red-500',
                'text-sm',
              ]"
            ></i>
            <span
              :class="[stat.trend > 0 ? 'text-green-600' : 'text-red-600', 'text-sm font-medium']"
            >
              {{ Math.abs(stat.trend) }}%
            </span>
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          <p v-if="stat.subtitle" class="text-xs text-gray-500 mt-1">{{ stat.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-lg font-semibold text-gray-900">Doanh thu theo thời gian</div>
          <q-btn-dropdown
            flat
            dense
            color="grey-7"
            label="Tháng"
            dropdown-icon="expand_more"
            no-caps
          >
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>Ngày</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Tuần</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Tháng</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div
          class="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg"
        >
          <div class="text-center text-gray-400">
            <i class="fal fa-chart-line text-5xl mb-3"></i>
            <p class="text-sm">Biểu đồ doanh thu</p>
            <p class="text-xs">(Tích hợp Chart.js hoặc ApexCharts)</p>
          </div>
        </div>
      </div>

      <!-- Orders Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-lg font-semibold text-gray-900">Đơn hàng theo trạng thái</div>
        </div>
        <div
          class="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg"
        >
          <div class="text-center text-gray-400">
            <i class="fal fa-chart-pie text-5xl mb-3"></i>
            <p class="text-sm">Biểu đồ tròn trạng thái đơn hàng</p>
            <p class="text-xs">(Pending, Processing, Shipping, Delivered)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Top Products -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</div>
        <div class="space-y-3">
          <div
            v-for="(product, index) in topProducts"
            :key="product.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              :class="index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'"
            >
              {{ index + 1 }}
            </div>
            <img :src="product.image" :alt="product.name" class="w-12 h-12 object-cover rounded" />
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-gray-900 truncate">{{ product.name }}</div>
              <div class="text-xs text-gray-500">{{ product.sold }} đã bán</div>
            </div>
            <div class="text-sm font-semibold text-gray-900">
              {{ formatPrice(product.revenue) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Top Customers -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="text-lg font-semibold text-gray-900 mb-4">Khách hàng VIP</div>
        <div class="space-y-3">
          <div
            v-for="customer in topCustomers"
            :key="customer.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <q-avatar size="40px">
              <img :src="customer.avatar" :alt="customer.name" />
            </q-avatar>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-gray-900">{{ customer.name }}</div>
              <div class="text-xs text-gray-500">{{ customer.orders }} đơn hàng</div>
            </div>
            <div class="text-sm font-semibold text-gray-900">{{ formatPrice(customer.spent) }}</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</div>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex gap-3">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                activity.iconBg,
              ]"
            >
              <i :class="[activity.icon, 'text-sm', activity.iconColor]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Performance Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <div class="text-lg font-semibold text-gray-900">Hiệu suất bán hàng</div>
      </div>
      <q-table
        :rows="salesData"
        :columns="salesColumns"
        row-key="date"
        :pagination="{ rowsPerPage: 7 }"
        flat
        class="sales-table"
      >
        <template v-slot:body-cell-revenue="props">
          <q-td :props="props">
            <div class="font-semibold text-gray-900">{{ formatPrice(props.value) }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-growth="props">
          <q-td :props="props">
            <div class="flex items-center gap-1">
              <i
                :class="[
                  props.value > 0
                    ? 'fas fa-arrow-up text-green-500'
                    : 'fas fa-arrow-down text-red-500',
                  'text-xs',
                ]"
              ></i>
              <span
                :class="[
                  props.value > 0 ? 'text-green-600' : 'text-red-600',
                  'text-sm font-medium',
                ]"
              >
                {{ Math.abs(props.value) }}%
              </span>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const selectedTimeRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')

// Time Ranges
const timeRanges = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày', value: 'week' },
  { label: '30 ngày', value: 'month' },
  { label: '90 ngày', value: 'quarter' },
  { label: 'Năm nay', value: 'year' },
]

// Revenue Stats
const revenueStats = computed(() => [
  {
    label: 'Tổng doanh thu',
    value: formatPrice(138200000),
    icon: 'fal fa-dollar-sign',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    trend: 12.5,
    subtitle: 'So với tháng trước',
  },
  {
    label: 'Đơn hàng mới',
    value: '84',
    icon: 'fal fa-shopping-cart',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trend: 8.2,
    subtitle: '+7 so với tuần trước',
  },
  {
    label: 'Khách hàng mới',
    value: '32',
    icon: 'fal fa-users',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    trend: 15.3,
    subtitle: '+5 so với tuần trước',
  },
  {
    label: 'Tỷ lệ chuyển đổi',
    value: '3.24%',
    icon: 'fal fa-chart-line',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    trend: -2.1,
    subtitle: 'Từ tổng lượt truy cập',
  },
])

// Top Products
const topProducts = ref([
  {
    id: 1,
    name: 'Áo thun nam basic',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    sold: 156,
    revenue: 78000000,
  },
  {
    id: 2,
    name: 'Quần jean nam slim fit',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
    sold: 124,
    revenue: 62000000,
  },
  {
    id: 3,
    name: 'Áo khoác bomber',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
    sold: 98,
    revenue: 49000000,
  },
  {
    id: 4,
    name: 'Giày thể thao',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    sold: 87,
    revenue: 43500000,
  },
  {
    id: 5,
    name: 'Áo hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop',
    sold: 76,
    revenue: 38000000,
  },
])

// Top Customers
const topCustomers = ref([
  {
    id: 1,
    name: 'Lê Văn Cường',
    avatar: 'https://i.pravatar.cc/150?img=12',
    orders: 15,
    spent: 22400000,
  },
  {
    id: 2,
    name: 'Vũ Thị Phương',
    avatar: 'https://i.pravatar.cc/150?img=20',
    orders: 20,
    spent: 31200000,
  },
  {
    id: 3,
    name: 'Nguyễn Văn An',
    avatar: 'https://i.pravatar.cc/150?img=1',
    orders: 12,
    spent: 15600000,
  },
  {
    id: 4,
    name: 'Ngô Thị Hoa',
    avatar: 'https://i.pravatar.cc/150?img=24',
    orders: 10,
    spent: 13500000,
  },
  {
    id: 5,
    name: 'Mai Thị My',
    avatar: 'https://i.pravatar.cc/150?img=47',
    orders: 9,
    spent: 11700000,
  },
])

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    title: 'Đơn hàng #ORD001 đã được giao',
    time: '5 phút trước',
    icon: 'fal fa-check-circle',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    title: 'Khách hàng mới đăng ký: Trần Văn B',
    time: '15 phút trước',
    icon: 'fal fa-user-plus',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 3,
    title: 'Sản phẩm "Áo thun basic" sắp hết hàng',
    time: '1 giờ trước',
    icon: 'fal fa-exclamation-triangle',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    id: 4,
    title: 'Đơn hàng #ORD002 đang được xử lý',
    time: '2 giờ trước',
    icon: 'fal fa-box',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 5,
    title: 'Review 5 sao từ Nguyễn Văn A',
    time: '3 giờ trước',
    icon: 'fal fa-star',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
])

// Sales Table
const salesColumns = [
  { name: 'date', label: 'Ngày', field: 'date', align: 'left' },
  { name: 'orders', label: 'Đơn hàng', field: 'orders', align: 'center' },
  { name: 'revenue', label: 'Doanh thu', field: 'revenue', align: 'right' },
  { name: 'customers', label: 'Khách hàng', field: 'customers', align: 'center' },
  { name: 'avgOrder', label: 'TB/Đơn', field: 'avgOrder', align: 'right' },
  { name: 'growth', label: 'Tăng trưởng', field: 'growth', align: 'center' },
]

const salesData = ref([
  {
    date: '12/11/2025',
    orders: 15,
    revenue: 18500000,
    customers: 12,
    avgOrder: 1233333,
    growth: 12,
  },
  {
    date: '11/11/2025',
    orders: 23,
    revenue: 28900000,
    customers: 18,
    avgOrder: 1256522,
    growth: 18,
  },
  {
    date: '10/11/2025',
    orders: 18,
    revenue: 22100000,
    customers: 14,
    avgOrder: 1227778,
    growth: 5,
  },
  {
    date: '09/11/2025',
    orders: 12,
    revenue: 15600000,
    customers: 10,
    avgOrder: 1300000,
    growth: -3,
  },
  {
    date: '08/11/2025',
    orders: 20,
    revenue: 25400000,
    customers: 16,
    avgOrder: 1270000,
    growth: 15,
  },
  {
    date: '07/11/2025',
    orders: 16,
    revenue: 19800000,
    customers: 13,
    avgOrder: 1237500,
    growth: 8,
  },
  {
    date: '06/11/2025',
    orders: 14,
    revenue: 17200000,
    customers: 11,
    avgOrder: 1228571,
    growth: -5,
  },
])

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const applyCustomRange = () => {
  if (!customStartDate.value || !customEndDate.value) {
    $q.notify({
      type: 'warning',
      message: 'Vui lòng chọn khoảng thời gian',
      position: 'top-right',
    })
    return
  }
  $q.notify({
    type: 'positive',
    message: 'Đã áp dụng khoảng thời gian tùy chỉnh',
    position: 'top-right',
  })
}
</script>

<style scoped>
:deep(.sales-table .q-table thead tr),
:deep(.sales-table .q-table tbody td) {
  height: 50px;
}

:deep(.sales-table .q-table th) {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}

:deep(.sales-table .q-table tbody tr:hover) {
  background-color: #f9fafb;
}
</style>
