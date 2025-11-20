<template>
  <q-page class="flex flex-center py-20">
    <div class="max-w-2xl mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center">
        <q-spinner color="primary" size="64px" class="mb-6" />
        <div class="text-xl font-semibold text-gray-700">Đang xác nhận thanh toán...</div>
        <p class="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentStatus === 'success'" class="text-center">
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <i class="fal fa-check text-6xl text-green-600"></i>
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-4">Thanh toán thành công!</div>
        <p class="text-gray-600 mb-2">Cảm ơn bạn đã đặt hàng</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div class="text-sm text-gray-700">
            <div class="mb-2">
              <span class="font-semibold">Mã đơn hàng:</span>
              <span class="ml-2 font-mono text-green-700">{{ orderInfo.orderId }}</span>
            </div>
            <div class="mb-2">
              <span class="font-semibold">Số tiền:</span>
              <span class="ml-2 text-green-700">{{ formatPrice(orderInfo.amount) }}</span>
            </div>
            <div v-if="orderInfo.transactionId">
              <span class="font-semibold">Mã giao dịch:</span>
              <span class="ml-2 font-mono text-xs">{{ orderInfo.transactionId }}</span>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <q-btn
            v-if="customer"
            label="Xem đơn hàng"
            unelevated
            no-caps
            color="primary"
            class="w-full !px-8 !py-3"
            @click="$router.push('/orders')"
          />
          <q-btn
            label="Tiếp tục mua sắm"
            outline
            no-caps
            color="primary"
            class="w-full !px-8 !py-3"
            @click="$router.push('/shop')"
          />
        </div>
      </div>

      <!-- Failed State -->
      <div v-else-if="paymentStatus === 'failed'" class="text-center">
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <i class="fal fa-times text-6xl text-red-600"></i>
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-4">Thanh toán thất bại</div>
        <p class="text-gray-600 mb-2">{{ errorMessage || 'Đã có lỗi xảy ra' }}</p>
        <div v-if="orderInfo.orderId" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="text-sm text-gray-700">
            <div class="mb-2">
              <span class="font-semibold">Mã đơn hàng:</span>
              <span class="ml-2 font-mono text-red-700">{{ orderInfo.orderId }}</span>
            </div>
            <div>
              <span class="font-semibold">Số tiền:</span>
              <span class="ml-2 text-red-700">{{ formatPrice(orderInfo.amount) }}</span>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <q-btn
              label="Thử lại"
              unelevated
              no-caps
              color="primary"
              class="w-full !px-8 !py-3"
              @click="$router.push('/checkout')"
            />
            <q-btn
              label="Về trang chủ"
              outline
              no-caps
              color="primary"
              class="w-full !px-8 !py-3"
              @click="$router.push('/shop')"
            />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center">
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <i class="fal fa-exclamation-triangle text-6xl text-gray-400"></i>
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin</div>
        <p class="text-gray-600 mb-6">Không tìm thấy thông tin thanh toán</p>
        <q-btn
          label="Về trang chủ"
          unelevated
          no-caps
          color="primary"
          class="w-full !px-8 !py-3"
          @click="$router.push('/shop')"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/useAuthStore'
import { useStoreData } from 'src/composables/useStoreData'
import axios from 'axios'

const route = useRoute()
const { customer } = useAuthStore()
const { formatPrice } = useStoreData()

// State
const isLoading = ref(true)
const paymentStatus = ref(null) // 'success' | 'failed' | null
const errorMessage = ref('')
const orderInfo = ref({
  orderId: '',
  amount: 0,
  transactionId: '',
})

// VNPay response codes mapping
const getVNPayMessage = (code) => {
  const messages = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    75: 'Ngân hàng thanh toán đang bảo trì.',
    79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
  }
  return messages[code] || 'Giao dịch không thành công'
}

// Check payment result from URL params
onMounted(async () => {
  try {
    // MoMo returns: partnerCode, orderId, requestId, amount, orderInfo, orderType,
    // transId, resultCode, message, payType, responseTime, extraData, signature

    // VNPay returns: vnp_Amount, vnp_BankCode, vnp_BankTranNo, vnp_CardType,
    // vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo,
    // vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHash

    const queryParams = route.query
    console.log('Payment callback params:', queryParams)

    // Detect payment gateway type
    const isVNPay = queryParams.vnp_TxnRef !== undefined
    const isMoMo = queryParams.partnerCode !== undefined

    let orderId, resultCode, message, transId

    if (isVNPay) {
      // VNPay params
      orderId = queryParams.vnp_TxnRef
      resultCode = queryParams.vnp_ResponseCode // '00' means success
      transId = queryParams.vnp_TransactionNo || queryParams.vnp_BankTranNo
      message = getVNPayMessage(resultCode)
    } else if (isMoMo) {
      // MoMo params
      orderId = queryParams.orderId
      resultCode = queryParams.resultCode // '0' means success
      transId = queryParams.transId
      message = queryParams.message
    } else {
      paymentStatus.value = null
      isLoading.value = false
      return
    }

    if (!orderId) {
      paymentStatus.value = null
      isLoading.value = false
      return
    }

    orderInfo.value.transactionId = transId || ''

    // Check success: MoMo uses '0', VNPay uses '00'
    const isSuccess = (isVNPay && resultCode === '00') || (isMoMo && resultCode === '0')

    if (isSuccess) {
      // Payment successful - create order from sessionStorage
      const pendingOrderData = sessionStorage.getItem('pendingOrderData')

      if (pendingOrderData) {
        try {
          const orderData = JSON.parse(pendingOrderData)

          // Create order
          const response = await axios.post('http://localhost:5000/api/orders', orderData)

          if (response.data.success) {
            const createdOrder = response.data.data

            // Update order with payment info
            orderInfo.value.orderId = createdOrder.orderId
            orderInfo.value.amount = createdOrder.total

            // Update order payment status
            await axios.put(
              `http://localhost:5000/api/orders/${createdOrder._id}`,
              {
                paymentStatus: 'paid',
                trackingNumber: transId,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )

            // Clear sessionStorage
            sessionStorage.removeItem('pendingOrderData')
            sessionStorage.removeItem('pendingOrderTotal')

            // Clear cart from localStorage
            localStorage.removeItem('cart')

            paymentStatus.value = 'success'
          } else {
            throw new Error('Failed to create order')
          }
        } catch (orderError) {
          console.error('Error creating order:', orderError)
          paymentStatus.value = 'failed'
          errorMessage.value =
            'Thanh toán thành công nhưng không thể tạo đơn hàng. Vui lòng liên hệ hỗ trợ.'
        }
      } else {
        // No pending order data - payment was successful but no order to create
        paymentStatus.value = 'failed'
        errorMessage.value = 'Không tìm thấy thông tin đơn hàng'
      }
    } else {
      // Payment failed
      paymentStatus.value = 'failed'
      errorMessage.value = message || 'Thanh toán không thành công'

      // Clear pending order data
      sessionStorage.removeItem('pendingOrderData')
      sessionStorage.removeItem('pendingOrderTotal')
    }
  } catch (error) {
    console.error('Error processing payment result:', error)
    paymentStatus.value = 'failed'
    errorMessage.value = 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
  } finally {
    isLoading.value = false
  }
})
</script>
