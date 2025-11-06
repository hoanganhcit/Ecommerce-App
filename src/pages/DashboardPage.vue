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
            <div class="text-3xl font-bold text-gray-900">2,847</div>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <q-icon name="trending_up" size="16px" class="mr-1" />
              +18.3% from last month
            </p>
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
            <div class="text-3xl font-bold text-gray-900">$52,340</div>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <q-icon name="trending_up" size="16px" class="mr-1" />
              +14.7% from last month
            </p>
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
            <div class="text-3xl font-bold text-gray-900">342</div>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <q-icon name="trending_up" size="16px" class="mr-1" />
              +23 new items
            </p>
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
            <div class="text-3xl font-bold text-gray-900">1,567</div>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <q-icon name="trending_up" size="16px" class="mr-1" />
              +21.5% from last month
            </p>
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
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
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
                class="flex-1 flex flex-col items-center justify-end group"
              >
                <div class="relative w-full flex flex-col items-center justify-end h-full">
                  <!-- Tooltip -->
                  <div
                    class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10"
                  >
                    ${{ month.amount.toLocaleString() }}
                  </div>
                  <!-- Bar -->
                  <div
                    class="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 ease-out hover:from-green-600 hover:to-green-500 cursor-pointer"
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
                <p class="text-xl font-bold text-green-600">${{ totalRevenue.toLocaleString() }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-600 mb-1">Average</p>
                <p class="text-xl font-bold text-blue-600">
                  ${{ averageRevenue.toLocaleString() }}
                </p>
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
                  <!-- Men's Clothing segment (45%) -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="12"
                    stroke-dasharray="113.1 251.2"
                    transform="rotate(-90 50 50)"
                    class="transition-all duration-500"
                  ></circle>
                  <!-- Women's Clothing segment (40%) -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ec4899"
                    stroke-width="12"
                    stroke-dasharray="100.48 251.2"
                    stroke-dashoffset="-113.1"
                    transform="rotate(-90 50 50)"
                    class="transition-all duration-500"
                  ></circle>
                  <!-- Accessories segment (15%) -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    stroke-width="12"
                    stroke-dasharray="37.68 251.2"
                    stroke-dashoffset="-213.58"
                    transform="rotate(-90 50 50)"
                    class="transition-all duration-500"
                  ></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center flex-col">
                  <p class="text-2xl font-bold text-gray-900">$52,340</p>
                  <p class="text-xs text-gray-600">Total Earnings</p>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span class="text-sm text-gray-700">Men's Clothing</span>
                </div>
                <div class="text-sm font-semibold text-gray-900">$23,553 (45%)</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span class="text-sm text-gray-700">Women's Clothing</span>
                </div>
                <div class="text-sm font-semibold text-gray-900">$20,936 (40%)</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span class="text-sm text-gray-700">Accessories</span>
                </div>
                <div class="text-sm font-semibold text-gray-900">$7,851 (15%)</div>
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
                  <span class="text-sm font-semibold text-gray-900"
                    >${{ order.amount.toFixed(2) }}</span
                  >
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
              class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Product Image/Icon -->
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                :class="product.bgColor"
              >
                {{ product.name.charAt(0) }}
              </div>
              <!-- Product Info -->
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <div class="text-sm font-semibold text-gray-900">{{ product.name }}</div>
                  <span class="text-sm font-bold text-gray-900"
                    >${{ product.price.toFixed(2) }}</span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-600">{{ product.sold }} sold</p>
                  <!-- Progress Bar -->
                  <div class="flex-1 max-w-[100px] ml-4">
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        class="h-1.5 rounded-full transition-all duration-500"
                        :class="product.progressColor"
                        :style="{ width: product.percentage + '%' }"
                      ></div>
                    </div>
                  </div>
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
import { ref, computed } from 'vue'

const recentOrders = ref([
  { id: '#1234', customer: 'Sarah Johnson', amount: 189.99, status: 'Completed' },
  { id: '#1235', customer: 'Michael Chen', amount: 245.5, status: 'Processing' },
  { id: '#1236', customer: 'Emily Davis', amount: 129.99, status: 'Completed' },
  { id: '#1237', customer: 'James Wilson', amount: 310.0, status: 'Pending' },
  { id: '#1238', customer: 'Lisa Anderson', amount: 167.75, status: 'Completed' },
])

// Popular Products Data
const popularProducts = ref([
  {
    name: 'Classic Denim Jacket',
    price: 89.99,
    sold: 1543,
    percentage: 95,
    bgColor: 'bg-blue-600',
    progressColor: 'bg-blue-600',
  },
  {
    name: 'Summer Floral Dress',
    price: 129.99,
    sold: 1287,
    percentage: 85,
    bgColor: 'bg-pink-500',
    progressColor: 'bg-pink-500',
  },
  {
    name: 'Slim Fit Chinos',
    price: 79.99,
    sold: 1095,
    percentage: 72,
    bgColor: 'bg-amber-600',
    progressColor: 'bg-amber-600',
  },
  {
    name: 'Cotton T-Shirt Pack',
    price: 49.99,
    sold: 892,
    percentage: 60,
    bgColor: 'bg-gray-700',
    progressColor: 'bg-gray-700',
  },
  {
    name: 'Leather Ankle Boots',
    price: 159.99,
    sold: 654,
    percentage: 45,
    bgColor: 'bg-stone-800',
    progressColor: 'bg-stone-800',
  },
])

// Revenue Report Data
const revenueFilter = ref('6months')

const revenueDataSets = {
  '6months': [
    { month: 'Jun', amount: 38500 },
    { month: 'Jul', amount: 42800 },
    { month: 'Aug', amount: 45200 },
    { month: 'Sep', amount: 48900 },
    { month: 'Oct', amount: 51300 },
    { month: 'Nov', amount: 52340 },
  ],
  '12months': [
    { month: 'Jan', amount: 28500 },
    { month: 'Feb', amount: 31200 },
    { month: 'Mar', amount: 35000 },
    { month: 'Apr', amount: 33500 },
    { month: 'May', amount: 36800 },
    { month: 'Jun', amount: 38500 },
    { month: 'Jul', amount: 42800 },
    { month: 'Aug', amount: 45200 },
    { month: 'Sep', amount: 48900 },
    { month: 'Oct', amount: 51300 },
    { month: 'Nov', amount: 52340 },
    { month: 'Dec', amount: 48000 },
  ],
  year: [
    { month: 'Jan', amount: 28500 },
    { month: 'Feb', amount: 31200 },
    { month: 'Mar', amount: 35000 },
    { month: 'Apr', amount: 33500 },
    { month: 'May', amount: 36800 },
    { month: 'Jun', amount: 38500 },
    { month: 'Jul', amount: 42800 },
    { month: 'Aug', amount: 45200 },
    { month: 'Sep', amount: 48900 },
    { month: 'Oct', amount: 51300 },
    { month: 'Nov', amount: 52340 },
    { month: 'Dec', amount: 0 },
  ],
}

// Computed properties for Revenue Report
const revenueData = computed(() => {
  const data = revenueDataSets[revenueFilter.value]
  const maxAmount = Math.max(...data.map((d) => d.amount))
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
