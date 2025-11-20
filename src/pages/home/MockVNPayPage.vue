<template>
  <q-page class="flex flex-center bg-white">
    <div class="max-w-md w-full p-8">
      <div class="text-center mb-8">
        <div class="text-2xl font-bold text-blue-600 mb-2">VNPay Sandbox (Mock)</div>
        <p class="text-gray-600">Đây là trang test thanh toán VNPay</p>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <div class="text-lg font-semibold mb-4">Thông tin giao dịch</div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Mã đơn hàng:</span>
            <span class="font-medium">{{ orderId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Số tiền:</span>
            <span class="font-medium text-blue-600">{{ formatPrice(amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Nội dung:</span>
            <span class="font-medium">{{ orderInfo }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <q-btn
          label="Thanh toán thành công"
          unelevated
          color="positive"
          class="w-full"
          @click="simulateSuccess"
        />
        <q-btn
          label="Thanh toán thất bại"
          unelevated
          color="negative"
          class="w-full"
          @click="simulateFailed"
        />
        <q-btn label="Hủy giao dịch" outline color="grey" class="w-full" @click="simulateCancel" />
      </div>

      <div class="mt-6 text-xs text-gray-500 text-center">
        <p>⚠️ Đây là môi trường test</p>
        <p>Để sử dụng VNPay thật, cần đăng ký tại sandbox.vnpayment.vn</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStoreData } from 'src/composables/useStoreData'

const route = useRoute()
const { formatPrice } = useStoreData()

const orderId = ref('')
const amount = ref(0)
const orderInfo = ref('')

onMounted(() => {
  // Parse VNPay URL params
  orderId.value = route.query.vnp_TxnRef || 'N/A'
  amount.value = parseInt(route.query.vnp_Amount || '0') / 100 // VNPay amount is in cents
  orderInfo.value = route.query.vnp_OrderInfo || 'N/A'
})

const simulateSuccess = () => {
  // Simulate successful VNPay callback
  const returnUrl = route.query.vnp_ReturnUrl || 'http://localhost:5173/payment-result'

  const params = new URLSearchParams({
    vnp_TxnRef: orderId.value,
    vnp_ResponseCode: '00', // Success code
    vnp_TransactionNo: `VNP${Date.now()}`,
    vnp_BankTranNo: `BANK${Date.now()}`,
    vnp_Amount: (amount.value * 100).toString(),
    vnp_OrderInfo: orderInfo.value,
    vnp_PayDate: new Date().toISOString().replace(/[-:]/g, '').slice(0, 14),
    vnp_TransactionStatus: '00',
  })

  window.location.href = `${returnUrl}?${params.toString()}`
}

const simulateFailed = () => {
  const returnUrl = route.query.vnp_ReturnUrl || 'http://localhost:5173/payment-result'

  const params = new URLSearchParams({
    vnp_TxnRef: orderId.value,
    vnp_ResponseCode: '24', // User cancelled
    vnp_Amount: (amount.value * 100).toString(),
    vnp_OrderInfo: orderInfo.value,
    vnp_PayDate: new Date().toISOString().replace(/[-:]/g, '').slice(0, 14),
    vnp_TransactionStatus: '02',
  })

  window.location.href = `${returnUrl}?${params.toString()}`
}

const simulateCancel = () => {
  const returnUrl = route.query.vnp_ReturnUrl || 'http://localhost:5173/payment-result'

  const params = new URLSearchParams({
    vnp_TxnRef: orderId.value,
    vnp_ResponseCode: '24', // Cancelled
    vnp_Amount: (amount.value * 100).toString(),
    vnp_OrderInfo: orderInfo.value,
    vnp_PayDate: new Date().toISOString().replace(/[-:]/g, '').slice(0, 14),
  })

  window.location.href = `${returnUrl}?${params.toString()}`
}
</script>
