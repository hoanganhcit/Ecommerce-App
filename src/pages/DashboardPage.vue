<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="text-3xl font-bold text-gray-800">Dashboard</div>
      <p class="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Orders -->
      <div class="bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            <div class="text-3xl font-bold text-gray-900">
              {{ stats.totalOrders.toLocaleString() }}
            </div>
            <p class="text-xs text-gray-500 mt-2">Tổng số đơn hàng</p>
          </div>
          <div class="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
            <q-icon name="shopping_bag" size="28px" class="text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div class="bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Revenue</p>
            <div class="text-3xl font-bold text-gray-900">{{ formatPrice(stats.revenue) }}</div>
            <p class="text-xs text-gray-500 mt-2">Doanh thu từ đơn đã giao</p>
          </div>
          <div class="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
            <q-icon name="attach_money" size="28px" class="text-green-600" />
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Products</p>
            <div class="text-3xl font-bold text-gray-900">{{ stats.products }}</div>
            <p class="text-xs text-gray-500 mt-2">Tổng số sản phẩm</p>
          </div>
          <div class="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
            <q-icon name="checkroom" size="28px" class="text-orange-600" />
          </div>
        </div>
      </div>

      <!-- Customers -->
      <div class="bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Customers</p>
            <div class="text-3xl font-bold text-gray-900">{{ stats.customers }}</div>
            <p class="text-xs text-gray-500 mt-2">Tổng số khách hàng</p>
          </div>
          <div class="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
            <q-icon name="people" size="28px" class="text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Layout for Charts and Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Revenue Report -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xl font-bold text-gray-800">Revenue Report</div>
                <p class="text-sm text-gray-600 mt-1">Monthly revenue overview</p>
              </div>
              <select
                v-model="revenueFilter"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          <div class="p-6">
            <!-- Revenue Chart -->
            <div class="h-64 flex items-end justify-between gap-3">
              <div
                v-for="(month, index) in revenueData"
                :key="index"
                class="flex-1 flex flex-col items-center justify-end h-64 group no-wrap"
              >
                <div class="relative w-full flex flex-col items-center justify-end h-full no-wrap">
                  <!-- Tooltip -->
                  <div
                    class="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10"
                  >
                    {{ formatPrice(month.amount) }}
                  </div>
                  <!-- Bar -->
                  <div
                    class="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 ease-out hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                    :style="{ height: month.percentage + '%' }"
                  ></div>
                </div>
                <!-- Label -->
                <div class="text-xs text-gray-600 mt-2 font-medium text-center">
                  {{ month.month }}
                </div>
              </div>
            </div>
            <!-- Revenue Summary -->
            <div class="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div class="text-center">
                <p class="text-xs text-gray-600 mb-1">Total Revenue</p>
                <p class="text-xl font-bold text-green-600">{{ formatPrice(totalRevenue) }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-600 mb-1">Average</p>
                <p class="text-xl font-bold text-blue-600">{{ formatPrice(averageRevenue) }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-600 mb-1">Growth</p>
                <p class="text-xl font-bold text-purple-600">+{{ revenueGrowth }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Earning Report -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl overflow-hidden h-full">
          <div class="p-6 border-b border-gray-100">
            <div class="text-xl font-bold text-gray-800">Earning Report</div>
            <p class="text-sm text-gray-600 mt-1">This month</p>
          </div>
          <div class="p-6">
            <!-- Donut Chart Representation -->
            <div class="flex items-center justify-center mb-6">
              <div class="relative w-48 h-48">
                <svg class="w-full h-full" viewBox="0 0 100 100">
                  <!-- Background circle -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    stroke-width="12"
                  ></circle>
                  <!-- Dynamic segments -->
                  <circle
                    v-for="(segment, index) in earningsChartSegments"
                    :key="index"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    :stroke="segment.color"
                    stroke-width="12"
                    :stroke-dasharray="segment.dashArray"
                    :stroke-dashoffset="segment.dashOffset"
                    transform="rotate(-90 50 50)"
                    class="transition-all duration-500"
                  ></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center flex-col">
                  <p class="text-xl font-bold text-gray-900 !mb-0">
                    {{ formatPrice(totalEarnings) }}
                  </p>
                  <p class="text-xs text-gray-600">Total Earnings</p>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="text-xl font-bold text-gray-900 mb-4">Danh mục bán chạy</div>
            <div class="space-y-3">
              <div
                v-for="(segment, index) in earningsChartSegments"
                :key="index"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: segment.color }"
                  ></div>
                  <span class="text-sm text-gray-700">{{ segment.name }}</span>
                </div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatPrice(segment.amount) }} ({{ segment.percentage }}%)
                </div>
              </div>
              <div v-if="earningsChartSegments.length === 0" class="text-center text-gray-500 py-4">
                Chưa có dữ liệu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Layout for Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="text-xl font-bold text-gray-800">Recent Orders</div>
          <p class="text-sm text-gray-600 mt-1">Latest customer orders</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ order.id }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-700">{{ order.customer }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900">{{
                    formatPrice(order.amount)
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      order.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Popular Products -->
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="text-xl font-bold text-gray-800">Popular Products</div>
          <p class="text-sm text-gray-600 mt-1">Top selling products</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="(product, index) in popularProducts"
              :key="index"
              class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
            >
              <!-- Product Image -->
              <div class="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  @error="(e) => (e.target.src = 'https://via.placeholder.com/100')"
                />
              </div>
              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-1">
                  <div class="flex-1 min-w-0 mr-2">
                    <div class="text-sm font-semibold text-gray-900 truncate">
                      {{ product.name }}
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5 !mb-0">{{ product.category }}</p>
                  </div>
                  <span class="text-sm font-bold text-gray-900 flex-shrink-0">{{
                    formatPrice(product.price)
                  }}</span>
                </div>
                <div class="flex items-center gap-3 justify-between">
                  <p class="text-xs text-gray-600 flex items-center gap-1 !mb-0">
                    <q-icon name="shopping_cart" size="14px" class="text-gray-400" />
                    {{ product.sold }} sold
                  </p>
                  <!-- Progress Bar -->
                  <div class="flex-1 max-w-[80px]">
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        class="h-1.5 rounded-full transition-all duration-500"
                        :class="product.progressColor"
                        :style="{ width: product.percentage + '%' }"
                      ></div>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-gray-500">{{ product.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Get admin auth header
const getAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// State
const loading = ref(false)
const stats = ref({
  totalOrders: 0,
  revenue: 0,
  products: 0,
  customers: 0,
})
const recentOrders = ref([])
const popularProducts = ref([])
const earningsByCategory = ref([])

// Load dashboard data
onMounted(() => {
  loadDashboardData()
})

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Load orders
    const ordersRes = await axios.get('http://localhost:5000/api/orders', {
      headers: getAdminAuthHeader(),
    })

    // Load products
    const productsRes = await axios.get('http://localhost:5000/api/products')

    // Load customers
    const customersRes = await axios.get('http://localhost:5000/api/customers', {
      headers: getAdminAuthHeader(),
    })

    // Load categories
    const categoriesRes = await axios.get('http://localhost:5000/api/categories')

    if (ordersRes.data.success) {
      const orders = ordersRes.data.data
      stats.value.totalOrders = orders.length

      // Calculate revenue from delivered orders
      const deliveredOrders = orders.filter((o) => o.status === 'delivered')
      stats.value.revenue = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0)

      // Calculate revenue by category for Earning Report
      if (categoriesRes.data.success && productsRes.data.success) {
        const categories = categoriesRes.data.data
        const products = productsRes.data.data
        const categoryRevenue = {}

        // Create product lookup map
        const productMap = {}
        products.forEach((p) => {
          productMap[p._id] = p
        })

        deliveredOrders.forEach((order) => {
          order.items?.forEach((item) => {
            // Get product from map
            const product = productMap[item.product?._id || item.product]
            if (product && product.category) {
              const categoryId =
                typeof product.category === 'object' ? product.category._id : product.category
              categoryRevenue[categoryId] =
                (categoryRevenue[categoryId] || 0) + (item.subtotal || 0)
            }
          })
        })

        console.log('Category Revenue:', categoryRevenue)

        // Map to category names and calculate percentages
        const totalEarnings = Object.values(categoryRevenue).reduce((sum, val) => sum + val, 0)
        earningsByCategory.value = categories
          .map((cat) => ({
            name: cat.name,
            amount: categoryRevenue[cat._id] || 0,
            percentage:
              totalEarnings > 0
                ? Math.round(((categoryRevenue[cat._id] || 0) / totalEarnings) * 100)
                : 0,
          }))
          .filter((cat) => cat.amount > 0)
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5) // Top 5 categories

        console.log('Earnings by Category:', earningsByCategory.value)
      }

      // Calculate revenue by month for Revenue Report
      const monthlyRevenue = {}
      const currentYear = new Date().getFullYear()

      deliveredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt)
        if (orderDate.getFullYear() === currentYear) {
          const monthKey = orderDate.toLocaleString('en-US', { month: 'short' })
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (order.total || 0)
        }
      })

      // Update revenue data for current year
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      revenueDataSets.value.year = months.map((month) => ({
        month,
        amount: monthlyRevenue[month] || 0,
      }))

      // Get recent orders (last 5)
      recentOrders.value = orders.slice(0, 5).map((order) => ({
        id: order.orderId || order._id,
        customer: order.customerInfo?.fullName || 'N/A',
        amount: order.total || 0,
        status:
          order.status === 'pending'
            ? 'Pending'
            : order.status === 'processing'
              ? 'Processing'
              : order.status === 'shipping'
                ? 'Shipping'
                : order.status === 'delivered'
                  ? 'Completed'
                  : 'Cancelled',
      }))
    }

    if (productsRes.data.success) {
      const products = productsRes.data.data
      stats.value.products = products.length

      // Get popular products (sort by sold)
      const productsWithSales = products.filter((p) => p.sold > 0)
      const maxSold =
        productsWithSales.length > 0 ? Math.max(...productsWithSales.map((p) => p.sold)) : 1

      popularProducts.value = productsWithSales
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 8)
        .map((product, index) => ({
          name: product.name,
          price: product.price,
          sold: product.sold || 0,
          percentage: Math.round(((product.sold || 0) / maxSold) * 100),
          bgColor: getBgColor(index),
          progressColor: getBgColor(index),
          image: product.images?.[0] || 'https://via.placeholder.com/100',
          category: product.category?.name || 'Uncategorized',
        }))
    }

    if (customersRes.data.success) {
      stats.value.customers = customersRes.data.data.length
    }
  } catch (error) {
    console.error('Load dashboard data error:', error)
  } finally {
    loading.value = false
  }
}

const getBgColor = (index) => {
  const colors = [
    'bg-blue-600',
    'bg-pink-500',
    'bg-amber-600',
    'bg-gray-700',
    'bg-stone-800',
    'bg-slate-700',
    'bg-indigo-600',
    'bg-teal-600',
  ]
  return colors[index % colors.length]
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

// Revenue Report Data
const revenueFilter = ref('year')

const revenueDataSets = ref({
  '6months': [],
  '12months': [],
  year: [],
})

// Computed for earnings chart
const totalEarnings = computed(() => {
  return earningsByCategory.value.reduce((sum, cat) => sum + cat.amount, 0)
})

const earningsChartSegments = computed(() => {
  const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6']
  let offset = 0
  const circumference = 251.2 // 2 * PI * 40

  return earningsByCategory.value.map((cat, index) => {
    const dashArray = (cat.percentage / 100) * circumference
    const segment = {
      name: cat.name,
      amount: cat.amount,
      percentage: cat.percentage,
      color: colors[index % colors.length],
      dashArray: `${dashArray} ${circumference}`,
      dashOffset: -offset,
    }
    offset += dashArray
    return segment
  })
})

// Computed properties for Revenue Report
const revenueData = computed(() => {
  const data = revenueDataSets.value[revenueFilter.value]
  if (!data || data.length === 0) return []
  const maxAmount = Math.max(...data.map((d) => d.amount))
  if (maxAmount === 0) return data.map((item) => ({ ...item, percentage: 0 }))
  return data.map((item) => ({
    ...item,
    percentage: (item.amount / maxAmount) * 100,
  }))
})

const totalRevenue = computed(() => {
  return revenueData.value.reduce((sum, item) => sum + item.amount, 0)
})

const averageRevenue = computed(() => {
  return Math.round(totalRevenue.value / revenueData.value.length)
})

const revenueGrowth = computed(() => {
  const data = revenueData.value
  if (data.length < 2) return 0
  const first = data[0].amount
  const last = data[data.length - 1].amount
  if (first === 0) return 0
  return Math.round(((last - first) / first) * 100)
})
</script>
