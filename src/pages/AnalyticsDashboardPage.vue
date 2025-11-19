<template>
  <q-page class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-gray-900">Thống kê & Phân tích</div>
      <p class="text-gray-600 mt-1">Báo cáo doanh thu và hiệu suất kinh doanh</p>
    </div>

    <!-- Time Range Filter -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6 relative">
      <q-inner-loading :showing="loading" color="primary">
        <q-spinner-dots size="50px" />
      </q-inner-loading>
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
            :loading="loading"
            :disable="loading"
            no-caps
          />
        </q-btn-group>
        <q-space />
        <div class="flex gap-2">
          <q-input
            v-model="customStartDate"
            outlined
            dense
            type="date"
            label="Từ ngày"
            :disable="loading"
          />
          <q-input
            v-model="customEndDate"
            outlined
            dense
            type="date"
            label="Đến ngày"
            :disable="loading"
          />
          <q-btn
            label="Áp dụng"
            color="primary"
            unelevated
            @click="applyCustomRange"
            :loading="loading"
            :disable="loading"
          />
        </div>
      </div>
    </div>

    <!-- Revenue Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in revenueStats"
        :key="stat.label"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow relative"
      >
        <q-inner-loading :showing="loading" color="primary" />
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
      <div class="bg-white rounded-lg border border-gray-200 p-6 relative">
        <q-inner-loading :showing="loading" color="primary">
          <q-spinner-dots size="50px" />
        </q-inner-loading>
        <div class="flex items-center justify-between mb-4">
          <div class="text-lg font-semibold text-gray-900">Doanh thu theo thời gian</div>
          <q-btn-dropdown
            flat
            dense
            color="grey-7"
            :label="chartPeriod"
            dropdown-icon="expand_more"
            no-caps
            :disable="loading"
          >
            <q-list>
              <q-item clickable v-close-popup @click="chartPeriod = 'Ngày'">
                <q-item-section>Ngày</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="chartPeriod = 'Tuần'">
                <q-item-section>Tuần</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="chartPeriod = 'Tháng'">
                <q-item-section>Tháng</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <VueApexCharts
          type="area"
          height="320"
          :options="revenueChartOptions"
          :series="revenueChartSeries"
        ></VueApexCharts>
      </div>

      <!-- Orders Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 relative">
        <q-inner-loading :showing="loading" color="primary">
          <q-spinner-dots size="50px" />
        </q-inner-loading>
        <div class="flex items-center justify-between mb-4">
          <div class="text-lg font-semibold text-gray-900">Đơn hàng theo trạng thái</div>
        </div>
        <VueApexCharts
          type="donut"
          height="320"
          :options="ordersChartOptions"
          :series="ordersChartSeries"
        ></VueApexCharts>
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
        <div v-if="topCustomers.length > 0" class="space-y-3">
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
        <div v-else class="flex items-center justify-center h-48">
          <div class="text-center text-gray-400">
            <i class="fal fa-users text-4xl mb-2"></i>
            <p class="text-sm">Chưa có khách hàng VIP</p>
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
            <div class="flex items-center gap-1 justify-center">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

defineOptions({
  components: {
    VueApexCharts,
  },
})

const $q = useQuasar()

// State
const selectedTimeRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const loading = ref(false)
const analyticsData = ref(null)
const chartPeriod = ref('Tháng')

// Time Ranges
const timeRanges = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày', value: 'week' },
  { label: '30 ngày', value: 'month' },
  { label: '90 ngày', value: 'quarter' },
  { label: 'Năm nay', value: 'year' },
]

// Fetch analytics data
const fetchAnalytics = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('adminToken')

    if (!token) {
      $q.notify({
        type: 'warning',
        message: 'Vui lòng đăng nhập lại',
        position: 'top',
      })
      return
    }

    const params = { timeRange: selectedTimeRange.value }
    if (customStartDate.value && customEndDate.value) {
      params.startDate = customStartDate.value
      params.endDate = customEndDate.value
    }

    const response = await axios.get('http://localhost:5000/api/analytics/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })

    analyticsData.value = response.data.data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể tải dữ liệu thống kê',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Revenue Stats
const revenueStats = computed(() => {
  if (!analyticsData.value) return []

  const stats = analyticsData.value.revenueStats

  return [
    {
      label: 'Tổng doanh thu',
      value: formatPrice(stats.totalRevenue || 0),
      icon: 'fal fa-dollar-sign',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: stats.revenueTrend || 0,
      subtitle: 'So với kỳ trước',
    },
    {
      label: 'Đơn hàng mới',
      value: (stats.totalOrders || 0).toString(),
      icon: 'fal fa-shopping-cart',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: stats.orderTrend || 0,
      subtitle: 'So với kỳ trước',
    },
    {
      label: 'Khách hàng mới',
      value: (stats.newCustomers || 0).toString(),
      icon: 'fal fa-users',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: stats.customerTrend || 0,
      subtitle: 'So với kỳ trước',
    },
    {
      label: 'Tỷ lệ chuyển đổi',
      value: (stats.conversionRate || 0).toFixed(2) + '%',
      icon: 'fal fa-chart-line',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: 0,
      subtitle: 'Từ tổng lượt truy cập',
    },
  ]
})

// Top Products
const topProducts = computed(() => analyticsData.value?.topProducts || [])

// Top Customers
const topCustomers = computed(() => analyticsData.value?.topCustomers || [])

// Recent Activities
const recentActivities = computed(() => analyticsData.value?.recentActivities || [])

// Sales Table
const salesColumns = [
  { name: 'date', label: 'Ngày', field: 'date', align: 'left' },
  { name: 'orders', label: 'Đơn hàng', field: 'orders', align: 'center' },
  { name: 'revenue', label: 'Doanh thu', field: 'revenue', align: 'center' },
  { name: 'customers', label: 'Khách hàng', field: 'customers', align: 'center' },
  { name: 'avgOrder', label: 'TB/Đơn', field: 'avgOrder', align: 'center' },
  { name: 'growth', label: 'Tăng trưởng', field: 'growth', align: 'center' },
]

const salesData = computed(() => analyticsData.value?.salesData || [])

// Lifecycle
onMounted(() => {
  fetchAnalytics()
})

// Watch time range changes
watch(selectedTimeRange, () => {
  fetchAnalytics()
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const applyCustomRange = () => {
  if (!customStartDate.value || !customEndDate.value) {
    $q.notify({
      type: 'warning',
      message: 'Vui lòng chọn khoảng thời gian',
      position: 'top',
    })
    return
  }
  fetchAnalytics()
}

// Revenue Chart
const revenueChartSeries = computed(() => {
  const data = analyticsData.value?.revenueChart || []
  return [
    {
      name: 'Doanh thu',
      data: data.map((item) => item.revenue || 0),
    },
    {
      name: 'Đơn hàng',
      data: data.map((item) => (item.orders || 0) * 100000), // Scale for visibility
    },
  ]
})

const revenueChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 320,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  colors: ['#10b981', '#3b82f6'],
  xaxis: {
    categories: analyticsData.value?.revenueChart?.map((item) => item.date) || [],
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
      },
      formatter: (value) => {
        return new Intl.NumberFormat('vi-VN', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(value)
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontSize: '14px',
    fontWeight: 500,
  },
  grid: {
    borderColor: '#f3f4f6',
    strokeDashArray: 4,
  },
  tooltip: {
    y: {
      formatter: (value, { seriesIndex }) => {
        if (seriesIndex === 0) {
          return formatPrice(value)
        }
        return Math.round(value / 100000) + ' đơn'
      },
    },
  },
}))

// Orders Chart
const ordersChartSeries = computed(() => {
  const stats = analyticsData.value?.orderStats || {}
  return [
    stats.pending || 0,
    stats.processing || 0,
    stats.shipping || 0,
    stats.delivered || 0,
    stats.cancelled || 0,
  ]
})

const ordersChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 320,
  },
  labels: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'],
  colors: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
  legend: {
    position: 'bottom',
    fontSize: '14px',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '14px',
            fontWeight: 600,
          },
          value: {
            show: true,
            fontSize: '20px',
            fontWeight: 700,
            formatter: (val) => val,
          },
          total: {
            show: true,
            label: 'Tổng đơn',
            fontSize: '14px',
            color: '#6b7280',
            formatter: () => {
              const total = ordersChartSeries.value.reduce((a, b) => a + b, 0)
              return total
            },
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    y: {
      formatter: (val) => val + ' đơn',
    },
  },
}))
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
