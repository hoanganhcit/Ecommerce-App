<template>
  <q-page class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Order Detail Content -->
      <div v-else-if="order" class="space-y-6">
        <!-- Back Button & Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <q-btn
              icon="fas fa-arrow-left"
              flat
              round
              @click="$router.push('/orders')"
              class="text-gray-600"
            />
            <div>
              <div class="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</div>
              <p class="text-sm text-gray-500 mt-1">
                Mã đơn: <span class="font-semibold">#{{ order.orderId || order._id }}</span>
              </p>
            </div>
          </div>
          <div>
            <span
              :class="['px-4 py-2 text-sm font-medium rounded-full', getStatusClass(order.status)]"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
        </div>

        <!-- Order Status Timeline -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="text-lg font-semibold text-gray-900 mb-6">Trạng thái đơn hàng</div>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div class="space-y-6">
              <div
                v-for="(history, index) in order.statusHistory || []"
                :key="index"
                class="relative flex gap-4"
              >
                <div
                  :class="[
                    'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
                    index === 0 ? 'bg-green-500 border-green-500' : 'bg-gray-100 border-gray-300',
                  ]"
                >
                  <i
                    :class="[
                      'fas text-xs',
                      index === 0 ? 'fa-check text-white' : 'fa-circle text-gray-400',
                    ]"
                  ></i>
                </div>
                <div class="flex-1 pb-6">
                  <div class="flex items-center justify-between">
                    <div class="font-medium text-gray-900">
                      {{ getStatusLabel(history.status) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDateTime(history.timestamp || history.createdAt) }}
                    </div>
                  </div>
                  <p v-if="history.note" class="text-sm text-gray-600 mt-1">{{ history.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Order Items & Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Order Items -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</div>
              <div class="space-y-4">
                <div
                  v-for="item in order.items"
                  :key="item._id"
                  class="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <img
                    :src="item.image || item.product?.images?.[0] || '/placeholder.jpg'"
                    :alt="item.name || item.product?.name"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 mb-1">
                      {{ item.name || item.product?.name || 'Sản phẩm' }}
                    </div>
                    <div class="text-sm text-gray-500 space-y-1">
                      <p v-if="item.size || item.color">
                        <span v-if="item.size">Size: {{ item.size }}</span>
                        <span v-if="item.color" class="ml-3">Màu: {{ item.color }}</span>
                      </p>
                      <p>Số lượng: {{ item.quantity }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-sm text-gray-600">{{ formatPrice(item.price) }}</span>
                      <span class="font-semibold text-gray-900">{{
                        formatPrice(item.subtotal || item.price * item.quantity)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</div>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <i class="fal fa-user text-gray-400 mt-1"></i>
                  <div>
                    <div class="text-xs text-gray-500">Họ và tên</div>
                    <div class="font-medium text-gray-900">
                      {{ order.customerInfo?.fullName || 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fal fa-phone text-gray-400 mt-1"></i>
                  <div>
                    <div class="text-xs text-gray-500">Số điện thoại</div>
                    <div class="font-medium text-gray-900">
                      {{ order.customerInfo?.phone || 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fal fa-envelope text-gray-400 mt-1"></i>
                  <div>
                    <div class="text-xs text-gray-500">Email</div>
                    <div class="font-medium text-gray-900">
                      {{ order.customerInfo?.email || 'N/A' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="text-lg font-semibold text-gray-900 mb-4">Địa chỉ giao hàng</div>
              <div class="flex items-start gap-3">
                <i class="fal fa-map-marker-alt text-gray-400 mt-1"></i>
                <div class="font-medium text-gray-900">
                  <p>{{ order.shippingAddress?.address }}</p>
                  <p class="text-gray-600 mt-1">
                    {{ order.shippingAddress?.ward }}, {{ order.shippingAddress?.district }},
                    {{ order.shippingAddress?.city }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Payment & Notes -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán</div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <i class="fal fa-credit-card text-gray-400"></i>
                  <div>
                    <div class="text-xs text-gray-500">Phương thức thanh toán</div>
                    <div class="font-medium text-gray-900">
                      {{ getPaymentMethodLabel(order.paymentMethod) }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <i class="fal fa-circle text-gray-400"></i>
                  <div>
                    <div class="text-xs text-gray-500">Trạng thái thanh toán</div>
                    <div class="font-medium text-gray-900">
                      <span
                        :class="[
                          'px-2 py-1 text-xs rounded',
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800',
                        ]"
                      >
                        {{ order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-if="order.notes" class="flex items-start gap-3 pt-3 border-t">
                  <i class="fal fa-sticky-note text-gray-400 mt-1"></i>
                  <div>
                    <div class="text-xs text-gray-500">Ghi chú</div>
                    <div class="text-gray-900">{{ order.notes }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Order Summary & Actions -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 space-y-6">
              <!-- Order Summary -->
              <div>
                <div class="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</div>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tạm tính</span>
                    <span class="font-medium text-gray-900">{{
                      formatPrice(order.subtotal || 0)
                    }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Phí vận chuyển</span>
                    <span class="font-medium text-gray-900">{{
                      formatPrice(order.shippingFee || 0)
                    }}</span>
                  </div>
                  <div v-if="order.discount > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">
                      Giảm giá
                      <span v-if="order.voucher?.code" class="text-xs"
                        >({{ order.voucher.code }})</span
                      >
                    </span>
                    <span class="font-medium text-green-600"
                      >-{{ formatPrice(order.discount) }}</span
                    >
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between">
                      <span class="font-semibold text-gray-900">Tổng cộng</span>
                      <span class="text-xl font-bold text-gray-900">{{
                        formatPrice(order.total || 0)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-2 pt-4 grid grid-cols-2 gap-4 border-t border-gray-200">
                <q-btn
                  v-if="order.status === 'pending'"
                  label="Hủy đơn hàng"
                  outline
                  color="negative"
                  class="w-full"
                  no-caps
                  @click="cancelOrder"
                />
                <q-btn
                  v-if="order.status === 'delivered'"
                  label="Mua lại"
                  unelevated
                  color="primary"
                  class="w-full"
                  no-caps
                  @click="reorder"
                />
                <q-btn
                  label="Quay lại danh sách"
                  outline
                  color="grey-7"
                  class="w-full"
                  no-caps
                  @click="$router.push('/orders')"
                />
              </div>

              <!-- Order Info -->
              <div class="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-2">
                <p>
                  <i class="fal fa-calendar-alt mr-2"></i>
                  Ngày đặt: {{ formatDate(order.createdAt) }}
                </p>
                <p v-if="order.updatedAt">
                  <i class="fal fa-clock mr-2"></i>
                  Cập nhật: {{ formatDate(order.updatedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-16">
        <i class="fal fa-exclamation-triangle text-gray-300 text-6xl mb-4"></i>
        <div class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</div>
        <p class="text-gray-500 mb-6">Đơn hàng không tồn tại hoặc đã bị xóa</p>
        <q-btn
          label="Quay lại danh sách"
          unelevated
          class="!bg-gray-900 text-white"
          no-caps
          @click="$router.push('/orders')"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/useAuthStore'
import { useCartStore } from 'src/stores/useCartStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { getAuthHeader } = useAuthStore()
const cartStore = useCartStore()
const { addToCart } = cartStore

// State
const order = ref(null)
const isLoading = ref(false)

// Order Statuses
const orderStatuses = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'cancelled', label: 'Đã hủy' },
]

const paymentMethods = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
  { value: 'bank', label: 'Chuyển khoản ngân hàng' },
  { value: 'momo', label: 'Ví MoMo' },
  { value: 'card', label: 'Thẻ tín dụng/Ghi nợ' },
]

// Load order detail
const loadOrderDetail = async () => {
  isLoading.value = true
  try {
    const orderId = route.params.id
    const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
      headers: getAuthHeader(),
    })

    if (response.data.success) {
      order.value = response.data.data
    }
  } catch (error) {
    console.error('Load order detail error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể tải thông tin đơn hàng',
      position: 'top-right',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadOrderDetail()
})

// Methods
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

const getPaymentMethodLabel = (method) => {
  const methodObj = paymentMethods.find((m) => m.value === method)
  return methodObj ? methodObj.label : method
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const cancelOrder = () => {
  $q.dialog({
    title: 'Hủy đơn hàng',
    message: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
    cancel: {
      label: 'Không',
      flat: true,
    },
    ok: {
      label: 'Hủy đơn',
      color: 'negative',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${order.value._id}/cancel`,
        {},
        { headers: getAuthHeader() },
      )

      if (response.data.success) {
        // Reload order
        await loadOrderDetail()
        $q.notify({
          type: 'positive',
          message: 'Hủy đơn hàng thành công',
          position: 'top-right',
        })
      }
    } catch (error) {
      console.error('Cancel order error:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Không thể hủy đơn hàng',
        position: 'top-right',
      })
    }
  })
}

const reorder = () => {
  if (!order.value?.items || order.value.items.length === 0) return

  order.value.items.forEach((item) => {
    const product = item.product || {
      _id: item.product,
      name: item.name,
      images: [item.image],
      price: item.price,
    }

    addToCart(product, {
      quantity: item.quantity,
      variant: {
        size: item.size,
        color: item.color,
      },
    })
  })

  $q.notify({
    type: 'positive',
    message: 'Đã thêm sản phẩm vào giỏ hàng',
    position: 'top-right',
  })

  router.push('/cart')
}
</script>
