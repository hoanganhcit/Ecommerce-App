<template>
  <q-page class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="text-3xl font-bold text-gray-900">Đơn hàng của tôi</div>
        <p class="text-gray-600 mt-2">Quản lý và theo dõi đơn hàng</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar Menu -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
            <nav class="space-y-1">
              <router-link
                to="/account"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                <i class="fal fa-user-circle text-lg"></i>
                <span>Thông tin tài khoản</span>
              </router-link>
              <router-link
                to="/orders"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 bg-gray-100 font-medium transition-all"
              >
                <i class="fal fa-clipboard-list text-lg"></i>
                <span>Đơn hàng của tôi</span>
              </router-link>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              >
                <i class="fal fa-sign-out text-lg"></i>
                <span>Đăng xuất</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-3">
          <!-- Filter Tabs -->
          <div class="bg-white rounded-lg border border-gray-200 mb-6">
            <div class="flex overflow-x-auto">
              <button
                v-for="status in orderStatuses"
                :key="status.value"
                @click="selectedStatus = status.value"
                :class="[
                  'flex-1 min-w-fit px-6 py-4 text-sm font-medium border-b-2 transition-all',
                  selectedStatus === status.value
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
              >
                {{ status.label }}
                <span
                  v-if="getOrderCountByStatus(status.value) > 0"
                  class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-900 text-xs rounded-full"
                >
                  {{ getOrderCountByStatus(status.value) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Orders List -->
          <div class="space-y-4">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Order Header -->
              <div class="p-4 bg-gray-50 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div>
                      <span class="text-xs text-gray-500">Mã đơn hàng:</span>
                      <span class="ml-2 font-semibold text-gray-900">#{{ order.id }}</span>
                    </div>
                    <div class="h-4 w-px bg-gray-300"></div>
                    <div>
                      <span class="text-xs text-gray-500">{{ order.date }}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded-full',
                        getStatusClass(order.status),
                      ]"
                    >
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="p-4">
                <div class="space-y-3">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="flex gap-4 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-20 h-20 object-cover rounded"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-gray-900 line-clamp-2">{{ item.name }}</div>
                      <p class="text-sm text-gray-500 mt-1">
                        <span v-if="item.size">Size: {{ item.size }}</span>
                        <span v-if="item.color" class="ml-2">Màu: {{ item.color }}</span>
                      </p>
                      <div class="flex items-center justify-between mt-2">
                        <span class="text-sm text-gray-600">x{{ item.quantity }}</span>
                        <span class="font-semibold text-gray-900">{{
                          formatPrice(item.price)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Footer -->
              <div class="p-4 bg-gray-50 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <i class="fal fa-box text-gray-400"></i>
                    <span class="text-sm text-gray-600">{{ order.items.length }} sản phẩm</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <div class="text-xs text-gray-500">Tổng tiền:</div>
                      <div class="text-lg font-bold text-gray-900">
                        {{ formatPrice(order.total) }}
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <q-btn
                        label="Xem chi tiết"
                        outline
                        color="primary"
                        size="sm"
                        @click="viewOrderDetail(order.id)"
                      />
                      <q-btn
                        v-if="order.status === 'delivered'"
                        label="Mua lại"
                        unelevated
                        color="primary"
                        size="sm"
                        @click="reorder(order.id)"
                      />
                      <q-btn
                        v-if="order.status === 'pending'"
                        label="Hủy đơn"
                        outline
                        color="negative"
                        size="sm"
                        @click="cancelOrder(order.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="filteredOrders.length === 0"
              class="bg-white rounded-lg border border-gray-200 p-12 text-center"
            >
              <i class="fal fa-clipboard-list text-gray-300 text-6xl mb-4"></i>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h3>
              <p class="text-gray-500 mb-6">
                {{ getEmptyMessage() }}
              </p>
              <q-btn
                label="Tiếp tục mua sắm"
                color="primary"
                unelevated
                @click="$router.push('/shop')"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import ordersData from 'src/data/ordersData.json'

const router = useRouter()
const $q = useQuasar()

// State
const selectedStatus = ref('all')
const orders = ref([])

// Order Statuses
const orderStatuses = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
]

// Load orders from JSON
onMounted(() => {
  orders.value = ordersData.orders
})

// Computed
const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.status === selectedStatus.value)
})

// Methods
const getOrderCountByStatus = (status) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter((order) => order.status === status).length
}

const getStatusLabel = (status) => {
  const statusObj = orderStatuses.find((s) => s.value === status)
  return statusObj ? statusObj.label : status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getEmptyMessage = () => {
  const messages = {
    all: 'Bạn chưa có đơn hàng nào',
    pending: 'Không có đơn hàng chờ xác nhận',
    processing: 'Không có đơn hàng đang xử lý',
    shipping: 'Không có đơn hàng đang giao',
    delivered: 'Không có đơn hàng đã giao',
    cancelled: 'Không có đơn hàng đã hủy',
  }
  return messages[selectedStatus.value] || 'Không có đơn hàng'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const viewOrderDetail = (orderId) => {
  router.push(`/orders/${orderId}`)
}

const reorder = () => {
  $q.notify({
    type: 'positive',
    message: 'Đã thêm sản phẩm vào giỏ hàng',
    position: 'top-right',
  })
}

const cancelOrder = (orderId) => {
  $q.dialog({
    title: 'Hủy đơn hàng',
    message: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'cancelled'
      $q.notify({
        type: 'positive',
        message: 'Hủy đơn hàng thành công',
        position: 'top-right',
      })
    }
  })
}

const handleLogout = () => {
  $q.dialog({
    title: 'Đăng xuất',
    message: 'Bạn có chắc chắn muốn đăng xuất?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    router.push('/login')
  })
}
</script>
