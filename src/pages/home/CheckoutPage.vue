<template>
  <q-page class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Title -->
      <div class="mb-8">
        <div class="text-3xl font-bold text-gray-900">Thanh toán</div>
        <p class="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
      </div>

      <!-- Empty Cart -->
      <div v-if="isEmpty" class="text-center py-16">
        <i class="fal fa-shopping-cart text-gray-300 text-8xl mb-6"></i>
        <div class="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</div>
        <p class="text-gray-600 mb-8">Thêm sản phẩm vào giỏ hàng để tiếp tục</p>
        <q-btn
          label="Tiếp tục mua sắm"
          unelevated
          class="!px-8 !rounded-xl !py-3 text-white !bg-gray-900 hover:!bg-gray-800"
          no-caps
          @click="$router.push('/shop')"
        />
      </div>

      <!-- Checkout Form -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side - Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Information -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-xl font-bold text-gray-900 mb-6">Thông tin khách hàng</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="form.fullName"
                  outlined
                  dense
                  placeholder="Nhập họ và tên"
                  :rules="[(val) => !!val || 'Vui lòng nhập họ và tên']"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="form.phone"
                  outlined
                  dense
                  placeholder="Nhập số điện thoại"
                  :rules="[(val) => !!val || 'Vui lòng nhập số điện thoại']"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="form.email"
                  outlined
                  dense
                  type="email"
                  placeholder="Nhập email"
                  :rules="[(val) => !!val || 'Vui lòng nhập email']"
                />
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-xl font-bold text-gray-900 mb-6">Địa chỉ giao hàng</div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="form.address"
                  outlined
                  dense
                  placeholder="Số nhà, tên đường"
                  :rules="[(val) => !!val || 'Vui lòng nhập địa chỉ']"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span class="text-red-500">*</span>
                  </label>
                  <q-select
                    v-model="form.city"
                    :options="provinces"
                    outlined
                    dense
                    placeholder="Chọn tỉnh/thành"
                    :rules="[(val) => !!val || 'Vui lòng chọn tỉnh/thành']"
                    emit-value
                    map-options
                    option-label="label"
                    option-value="value"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện <span class="text-red-500">*</span>
                  </label>
                  <q-select
                    v-model="form.district"
                    :options="districts"
                    outlined
                    dense
                    placeholder="Chọn quận/huyện"
                    :rules="[(val) => !!val || 'Vui lòng chọn quận/huyện']"
                    :disable="!form.city || isLoadingDistricts"
                    :loading="isLoadingDistricts"
                    emit-value
                    map-options
                    option-label="label"
                    option-value="value"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã <span class="text-red-500">*</span>
                  </label>
                  <q-select
                    v-model="form.ward"
                    :options="wards"
                    outlined
                    dense
                    placeholder="Chọn phường/xã"
                    :rules="[(val) => !!val || 'Vui lòng chọn phường/xã']"
                    :disable="!form.district || isLoadingWards"
                    :loading="isLoadingWards"
                    emit-value
                    map-options
                    option-label="label"
                    option-value="value"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <q-input
                  v-model="form.note"
                  outlined
                  type="textarea"
                  rows="3"
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</div>
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="
                  form.paymentMethod === method.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  :value="method.value"
                  v-model="form.paymentMethod"
                  class="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                />
                <i :class="[method.icon, 'text-xl text-gray-600']"></i>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ method.label }}</div>
                  <div class="text-sm text-gray-500">{{ method.description }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Right Side - Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <div class="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</div>

            <!-- Cart Items -->
            <div class="space-y-4 mb-6 max-h-80 overflow-y-auto">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-3 pb-4 border-b border-gray-100"
              >
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 text-sm line-clamp-2">
                    {{ item.product.name }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    <span v-if="item.variant?.size">Size: {{ item.variant.size }}</span>
                    <span v-if="item.variant?.color" class="ml-2"
                      >Màu: {{ item.variant.color }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-sm text-gray-600">SL: {{ item.quantity }}</span>
                    <span class="font-semibold text-gray-900 text-sm">{{
                      formatPrice(item.product.price * item.quantity)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Voucher Section -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
              <div class="flex gap-2">
                <q-input
                  v-model="voucherCode"
                  outlined
                  dense
                  placeholder="Nhập mã giảm giá"
                  class="flex-1"
                  :disable="appliedVoucher !== null"
                />
                <q-btn
                  v-if="!appliedVoucher"
                  label="Áp dụng"
                  color="black"
                  unelevated
                  class="!px-4"
                  no-caps
                  dense
                  @click="applyVoucher"
                  :disable="!voucherCode"
                />
                <q-btn
                  v-else
                  label="Hủy"
                  color="negative"
                  unelevated
                  no-caps
                  class="!px-4"
                  dense
                  @click="removeVoucher"
                />
              </div>
              <!-- Applied Voucher -->
              <div
                v-if="appliedVoucher"
                class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div class="flex items-start gap-2">
                  <i class="fal fa-check-circle text-green-600 text-lg mt-0.5"></i>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-green-800">
                      {{ appliedVoucher.code }}
                    </div>
                    <div class="text-xs text-green-700 mt-1">
                      {{ appliedVoucher.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span
                  class="font-medium"
                  :class="shippingFee === 0 ? 'text-green-600' : 'text-gray-900'"
                >
                  <span v-if="shippingFee === 0 && appliedVoucher?.type === 'freeship'">
                    <s class="text-gray-400">{{ formatPrice(30000) }}</s>
                    {{ formatPrice(0) }}
                  </span>
                  <span v-else>{{ formatPrice(shippingFee) }}</span>
                </span>
              </div>
              <!-- Discount Row -->
              <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
                <span>Giảm giá ({{ appliedVoucher.code }})</span>
                <span class="font-medium">-{{ formatPrice(discount) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between">
                  <span class="text-base font-semibold text-gray-900">Tổng cộng</span>
                  <span class="text-xl font-bold text-gray-900">{{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>

            <!-- Place Order Button -->
            <q-btn
              label="Đặt Hàng"
              no-caps
              unelevated
              class="w-full !px-8 !rounded-xl !py-3 text-white !bg-gray-900 hover:!bg-gray-800"
              :loading="isSubmitting"
              @click="handlePlaceOrder"
            />

            <!-- Security Info -->
            <div class="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <i class="fal fa-lock"></i>
              <span>Thông tin thanh toán được bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/useCartStore'
import { useStoreData } from 'src/composables/useStoreData'
import { useAuthStore } from 'src/stores/useAuthStore'
import axios from 'axios'

const router = useRouter()
const $q = useQuasar()
const { cartItems, totalPrice, clearCart } = useCartStore()
const { formatPrice } = useStoreData()
const { customer, getAuthHeader } = useAuthStore()

// State
const isSubmitting = ref(false)
const voucherCode = ref('')
const appliedVoucher = ref(null)
const form = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: null,
  district: null,
  ward: null,
  note: '',
  paymentMethod: 'cod',
})

// Address data from API
const provinces = ref([])
const districts = ref([])
const wards = ref([])
const isLoadingDistricts = ref(false)
const isLoadingWards = ref(false)

// Fetch provinces on mount
const fetchProvinces = async () => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/p/')
    provinces.value = response.data.map((p) => ({
      label: p.name,
      value: p.code,
      name: p.name,
    }))
  } catch (error) {
    console.error('Error fetching provinces:', error)
    $q.notify({
      type: 'negative',
      message: 'Không thể tải danh sách tỉnh/thành',
      position: 'top-right',
    })
  }
}

// Fetch districts when province changes
const fetchDistricts = async (provinceCode) => {
  if (!provinceCode) {
    districts.value = []
    return
  }

  isLoadingDistricts.value = true
  try {
    const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
    districts.value = response.data.districts.map((d) => ({
      label: d.name,
      value: d.code,
      name: d.name,
    }))
  } catch (error) {
    console.error('Error fetching districts:', error)
    $q.notify({
      type: 'negative',
      message: 'Không thể tải danh sách quận/huyện',
      position: 'top-right',
    })
  } finally {
    isLoadingDistricts.value = false
  }
}

// Fetch wards when district changes
const fetchWards = async (districtCode) => {
  if (!districtCode) {
    wards.value = []
    return
  }

  isLoadingWards.value = true
  try {
    const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
    wards.value = response.data.wards.map((w) => ({
      label: w.name,
      value: w.code,
      name: w.name,
    }))
  } catch (error) {
    console.error('Error fetching wards:', error)
    $q.notify({
      type: 'negative',
      message: 'Không thể tải danh sách phường/xã',
      position: 'top-right',
    })
  } finally {
    isLoadingWards.value = false
  }
}

// Watch for city/district changes
watch(
  () => form.value.city,
  (newCity) => {
    form.value.district = null
    form.value.ward = null
    districts.value = []
    wards.value = []
    if (newCity) {
      fetchDistricts(newCity)
    }
  },
)

watch(
  () => form.value.district,
  (newDistrict) => {
    form.value.ward = null
    wards.value = []
    if (newDistrict) {
      fetchWards(newDistrict)
    }
  },
)

// Load customer data on mount
onMounted(async () => {
  await fetchProvinces()

  if (customer.value) {
    form.value.fullName = customer.value.fullName || ''
    form.value.phone = customer.value.phone || ''
    form.value.email = customer.value.email || ''

    const defaultAddress = customer.value.addresses?.find((addr) => addr.isDefault)
    if (defaultAddress) {
      form.value.address = defaultAddress.fullAddress || ''
    }
  }
})

// Available vouchers (mock data)
const availableVouchers = [
  {
    code: 'FREESHIP',
    type: 'freeship',
    description: 'Miễn phí vận chuyển',
    value: 0,
  },
  {
    code: 'DISCOUNT10',
    type: 'percent',
    description: 'Giảm 10% tổng đơn hàng',
    value: 10,
  },
  {
    code: 'DISCOUNT20',
    type: 'percent',
    description: 'Giảm 20% tổng đơn hàng',
    value: 20,
  },
  {
    code: 'SAVE50K',
    type: 'fixed',
    description: 'Giảm 50,000đ',
    value: 50000,
  },
]

// Payment methods
const paymentMethods = [
  {
    value: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: 'fal fa-money-bill-wave',
  },
  {
    value: 'bank',
    label: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản qua Internet Banking hoặc ATM',
    icon: 'fal fa-university',
  },
  {
    value: 'momo',
    label: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: 'fal fa-wallet',
  },
  {
    value: 'card',
    label: 'Thẻ tín dụng/Ghi nợ',
    description: 'Visa, Mastercard, JCB',
    icon: 'fal fa-credit-card',
  },
]

// Computed
const isEmpty = computed(() => cartItems.value.length === 0)

const subtotal = computed(() => totalPrice.value)

const shippingFee = computed(() => {
  // Check if freeship voucher is applied
  if (appliedVoucher.value?.type === 'freeship') {
    return 0
  }
  // Default shipping fee
  return 30000
})

const discount = computed(() => {
  if (!appliedVoucher.value) return 0

  if (appliedVoucher.value.type === 'percent') {
    return Math.floor((subtotal.value * appliedVoucher.value.value) / 100)
  } else if (appliedVoucher.value.type === 'fixed') {
    return appliedVoucher.value.value
  }
  return 0
})

const total = computed(() => {
  const totalBeforeDiscount = subtotal.value + shippingFee.value
  return totalBeforeDiscount - discount.value
})

// Methods
const applyVoucher = () => {
  const voucher = availableVouchers.find(
    (v) => v.code.toUpperCase() === voucherCode.value.toUpperCase(),
  )

  if (voucher) {
    appliedVoucher.value = voucher
    $q.notify({
      type: 'positive',
      message: 'Áp dụng mã giảm giá thành công!',
      caption: voucher.description,
      position: 'top-right',
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'Mã giảm giá không hợp lệ',
      position: 'top-right',
    })
  }
}

const removeVoucher = () => {
  appliedVoucher.value = null
  voucherCode.value = ''
  $q.notify({
    type: 'info',
    message: 'Đã hủy mã giảm giá',
    position: 'top-right',
  })
}

const validateForm = () => {
  const requiredFields = [
    { field: 'fullName', label: 'Họ và tên' },
    { field: 'phone', label: 'Số điện thoại' },
    { field: 'email', label: 'Email' },
    { field: 'address', label: 'Địa chỉ' },
    { field: 'city', label: 'Tỉnh/Thành phố' },
    { field: 'district', label: 'Quận/Huyện' },
    { field: 'ward', label: 'Phường/Xã' },
  ]

  for (const { field, label } of requiredFields) {
    if (!form.value[field]) {
      $q.notify({
        type: 'negative',
        message: `Vui lòng nhập ${label}`,
        position: 'top-right',
      })
      return false
    }
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    $q.notify({
      type: 'negative',
      message: 'Email không hợp lệ',
      position: 'top-right',
    })
    return false
  }

  // Validate phone
  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(form.value.phone.replace(/\s/g, ''))) {
    $q.notify({
      type: 'negative',
      message: 'Số điện thoại không hợp lệ',
      position: 'top-right',
    })
    return false
  }

  return true
}

const handlePlaceOrder = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Prepare order items with full details
    const orderItems = cartItems.value.map((item) => ({
      productId: item.product.id || item.product._id,
      quantity: item.quantity,
      size: item.variant?.size,
      color: item.variant?.color,
    }))

    // Prepare order data matching backend schema
    const orderData = {
      items: orderItems,
      customerInfo: {
        fullName: form.value.fullName,
        phone: form.value.phone,
        email: form.value.email,
      },
      shippingAddress: {
        address: form.value.address,
        city: provinces.value.find((p) => p.value === form.value.city)?.name || form.value.city,
        district:
          districts.value.find((d) => d.value === form.value.district)?.name || form.value.district,
        ward: wards.value.find((w) => w.value === form.value.ward)?.name || form.value.ward,
      },
      paymentMethod: form.value.paymentMethod,
      notes: form.value.note,
      voucher: appliedVoucher.value
        ? {
            code: appliedVoucher.value.code,
            type: appliedVoucher.value.type,
            value: appliedVoucher.value.value,
          }
        : undefined,
    }

    // Call API to create order
    const response = await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: getAuthHeader(),
    })

    if (response.data.success) {
      console.log('Order created:', response.data.data)

      // Clear cart
      clearCart()

      // Show success message
      $q.notify({
        type: 'positive',
        message: 'Đặt hàng thành công!',
        caption: `Mã đơn hàng: ${response.data.data.orderId}`,
        position: 'top-right',
        timeout: 3000,
      })

      // Redirect to orders page
      setTimeout(() => {
        router.push('/orders')
      }, 2000)
    }
  } catch (error) {
    console.error('Order error:', error)
    $q.notify({
      type: 'negative',
      message: 'Đặt hàng thất bại',
      caption: error.response?.data?.message || 'Vui lòng thử lại sau',
      position: 'top-right',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
