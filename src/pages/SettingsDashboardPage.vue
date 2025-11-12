<template>
  <q-page class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-gray-900">Cài đặt hệ thống</div>
      <p class="text-gray-600 mt-1">Quản lý cấu hình và thiết lập cửa hàng</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings Menu -->
      <aside class="lg:col-span-1">
        <div class="bg-white rounded-lg border border-gray-200 sticky top-6">
          <nav class="p-2">
            <button
              v-for="menu in settingsMenu"
              :key="menu.id"
              @click="activeSection = menu.id"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
                activeSection === menu.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <i :class="[menu.icon, 'text-lg']"></i>
              <span>{{ menu.label }}</span>
            </button>
          </nav>
        </div>
      </aside>

      <!-- Settings Content -->
      <main class="lg:col-span-3">
        <!-- General Settings -->
        <div v-show="activeSection === 'general'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Thông tin cửa hàng</div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <q-input v-model="settings.general.storeName" outlined label="Tên cửa hàng" />
                <q-input
                  v-model="settings.general.storeEmail"
                  outlined
                  label="Email"
                  type="email"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <q-input v-model="settings.general.storePhone" outlined label="Số điện thoại" />
                <q-input v-model="settings.general.storeHotline" outlined label="Hotline" />
              </div>
              <q-input
                v-model="settings.general.storeAddress"
                outlined
                label="Địa chỉ"
                type="textarea"
                rows="2"
              />
              <q-input
                v-model="settings.general.storeDescription"
                outlined
                label="Mô tả"
                type="textarea"
                rows="3"
              />
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Logo & Branding</div>
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-700 mb-2 block">Logo cửa hàng</label>
                <div class="flex items-center gap-4">
                  <div
                    class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                  >
                    <i class="fal fa-image text-3xl text-gray-400"></i>
                  </div>
                  <q-btn label="Tải lên logo" outline color="primary" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-700 mb-2 block">Màu chủ đạo</label>
                  <q-input v-model="settings.general.primaryColor" outlined type="color" />
                </div>
                <div>
                  <label class="text-sm text-gray-700 mb-2 block">Màu phụ</label>
                  <q-input v-model="settings.general.secondaryColor" outlined type="color" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <q-btn label="Hủy" outline color="grey" />
            <q-btn label="Lưu thay đổi" color="primary" unelevated @click="saveSettings" />
          </div>
        </div>

        <!-- Payment Settings -->
        <div v-show="activeSection === 'payment'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</div>
            <div class="space-y-4">
              <div
                v-for="method in settings.payment.methods"
                :key="method.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <i :class="[method.icon, 'text-2xl text-gray-600']"></i>
                  <div>
                    <div class="font-medium text-gray-900">{{ method.name }}</div>
                    <div class="text-sm text-gray-500">{{ method.description }}</div>
                  </div>
                </div>
                <q-toggle v-model="method.enabled" color="primary" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Cấu hình thanh toán</div>
            <div class="space-y-4">
              <q-input
                v-model="settings.payment.bankAccount"
                outlined
                label="Số tài khoản ngân hàng"
              />
              <q-input v-model="settings.payment.bankName" outlined label="Tên ngân hàng" />
              <q-input v-model="settings.payment.accountHolder" outlined label="Chủ tài khoản" />
              <q-input v-model="settings.payment.momoNumber" outlined label="Số điện thoại MoMo" />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <q-btn label="Hủy" outline color="grey" />
            <q-btn label="Lưu thay đổi" color="primary" unelevated @click="saveSettings" />
          </div>
        </div>

        <!-- Shipping Settings -->
        <div v-show="activeSection === 'shipping'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Phí vận chuyển</div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <q-input
                  v-model.number="settings.shipping.defaultFee"
                  outlined
                  label="Phí mặc định (VNĐ)"
                  type="number"
                />
                <q-input
                  v-model.number="settings.shipping.freeShippingThreshold"
                  outlined
                  label="Miễn phí từ (VNĐ)"
                  type="number"
                />
              </div>
              <q-toggle
                v-model="settings.shipping.enableFreeShipping"
                label="Bật miễn phí vận chuyển"
                color="primary"
              />
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Khu vực giao hàng</div>
            <div class="space-y-3">
              <div
                v-for="zone in settings.shipping.zones"
                :key="zone.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div class="font-medium text-gray-900">{{ zone.name }}</div>
                  <div class="text-sm text-gray-500">Phí: {{ formatPrice(zone.fee) }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <q-btn flat dense round icon="edit" size="sm" color="blue-grey" />
                  <q-btn flat dense round icon="delete" size="sm" color="red" />
                </div>
              </div>
              <q-btn label="Thêm khu vực" outline color="primary" class="w-full" />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <q-btn label="Hủy" outline color="grey" />
            <q-btn label="Lưu thay đổi" color="primary" unelevated @click="saveSettings" />
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-show="activeSection === 'notification'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Email thông báo</div>
            <div class="space-y-4">
              <q-toggle
                v-model="settings.notification.orderConfirmation"
                label="Gửi email xác nhận đơn hàng"
                color="primary"
              />
              <q-toggle
                v-model="settings.notification.orderStatus"
                label="Thông báo cập nhật trạng thái"
                color="primary"
              />
              <q-toggle
                v-model="settings.notification.newCustomer"
                label="Thông báo khách hàng mới"
                color="primary"
              />
              <q-toggle
                v-model="settings.notification.lowStock"
                label="Cảnh báo sắp hết hàng"
                color="primary"
              />
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Cấu hình SMTP</div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <q-input v-model="settings.notification.smtpHost" outlined label="SMTP Host" />
                <q-input
                  v-model="settings.notification.smtpPort"
                  outlined
                  label="SMTP Port"
                  type="number"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <q-input v-model="settings.notification.smtpUsername" outlined label="Username" />
                <q-input
                  v-model="settings.notification.smtpPassword"
                  outlined
                  label="Password"
                  type="password"
                />
              </div>
              <q-input
                v-model="settings.notification.fromEmail"
                outlined
                label="Email gửi"
                type="email"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <q-btn label="Hủy" outline color="grey" />
            <q-btn label="Lưu thay đổi" color="primary" unelevated @click="saveSettings" />
          </div>
        </div>

        <!-- Security Settings -->
        <div v-show="activeSection === 'security'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Bảo mật tài khoản</div>
            <div class="space-y-4">
              <q-toggle
                v-model="settings.security.twoFactorAuth"
                label="Bật xác thực 2 yếu tố"
                color="primary"
              />
              <q-toggle
                v-model="settings.security.sessionTimeout"
                label="Tự động đăng xuất sau 30 phút"
                color="primary"
              />
              <q-toggle
                v-model="settings.security.ipRestriction"
                label="Giới hạn IP đăng nhập"
                color="primary"
              />
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</div>
            <div class="space-y-4">
              <q-input
                v-model="passwordForm.current"
                outlined
                label="Mật khẩu hiện tại"
                type="password"
              />
              <q-input v-model="passwordForm.new" outlined label="Mật khẩu mới" type="password" />
              <q-input
                v-model="passwordForm.confirm"
                outlined
                label="Xác nhận mật khẩu mới"
                type="password"
              />
              <q-btn label="Đổi mật khẩu" color="primary" unelevated @click="changePassword" />
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-semibold text-gray-900 mb-4 text-red-600">Vùng nguy hiểm</div>
            <div class="space-y-3">
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="font-medium text-red-900 mb-2">Xóa tất cả dữ liệu</div>
                <p class="text-sm text-red-700 mb-3">
                  Hành động này sẽ xóa toàn bộ dữ liệu và không thể khôi phục.
                </p>
                <q-btn label="Xóa dữ liệu" color="red" outline @click="confirmDeleteData" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <q-btn label="Hủy" outline color="grey" />
            <q-btn label="Lưu thay đổi" color="primary" unelevated @click="saveSettings" />
          </div>
        </div>
      </main>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const activeSection = ref('general')

// Settings Menu
const settingsMenu = [
  { id: 'general', label: 'Cài đặt chung', icon: 'fal fa-cog' },
  { id: 'payment', label: 'Thanh toán', icon: 'fal fa-credit-card' },
  { id: 'shipping', label: 'Vận chuyển', icon: 'fal fa-truck' },
  { id: 'notification', label: 'Thông báo', icon: 'fal fa-bell' },
  { id: 'security', label: 'Bảo mật', icon: 'fal fa-shield-alt' },
]

// Settings Data
const settings = ref({
  general: {
    storeName: 'Ecommerce Store',
    storeEmail: 'info@ecommerce.com',
    storePhone: '0901234567',
    storeHotline: '1900xxxx',
    storeAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    storeDescription: 'Cửa hàng thời trang uy tín chất lượng',
    primaryColor: '#1976D2',
    secondaryColor: '#26A69A',
  },
  payment: {
    methods: [
      {
        id: 'cod',
        name: 'Thanh toán khi nhận hàng (COD)',
        description: 'Khách hàng thanh toán tiền mặt khi nhận hàng',
        icon: 'fal fa-money-bill',
        enabled: true,
      },
      {
        id: 'bank',
        name: 'Chuyển khoản ngân hàng',
        description: 'Chuyển khoản qua tài khoản ngân hàng',
        icon: 'fal fa-university',
        enabled: true,
      },
      {
        id: 'momo',
        name: 'Ví điện tử MoMo',
        description: 'Thanh toán qua ví MoMo',
        icon: 'fal fa-wallet',
        enabled: true,
      },
      {
        id: 'card',
        name: 'Thẻ tín dụng/Ghi nợ',
        description: 'Thanh toán bằng thẻ quốc tế',
        icon: 'fal fa-credit-card',
        enabled: false,
      },
    ],
    bankAccount: '0123456789',
    bankName: 'Vietcombank',
    accountHolder: 'NGUYEN VAN A',
    momoNumber: '0901234567',
  },
  shipping: {
    defaultFee: 30000,
    freeShippingThreshold: 500000,
    enableFreeShipping: true,
    zones: [
      { id: 1, name: 'Nội thành TP.HCM', fee: 30000 },
      { id: 2, name: 'Ngoại thành TP.HCM', fee: 50000 },
      { id: 3, name: 'Các tỉnh lân cận', fee: 70000 },
      { id: 4, name: 'Miền Trung', fee: 100000 },
      { id: 5, name: 'Miền Bắc', fee: 120000 },
    ],
  },
  notification: {
    orderConfirmation: true,
    orderStatus: true,
    newCustomer: true,
    lowStock: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@ecommerce.com',
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: true,
    ipRestriction: false,
  },
})

// Password Form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const saveSettings = () => {
  $q.notify({
    type: 'positive',
    message: 'Lưu cài đặt thành công',
    position: 'top-right',
  })
}

const changePassword = () => {
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    $q.notify({
      type: 'warning',
      message: 'Vui lòng điền đầy đủ thông tin',
      position: 'top-right',
    })
    return
  }

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    $q.notify({
      type: 'negative',
      message: 'Mật khẩu xác nhận không khớp',
      position: 'top-right',
    })
    return
  }

  $q.notify({
    type: 'positive',
    message: 'Đổi mật khẩu thành công',
    position: 'top-right',
  })

  passwordForm.value = { current: '', new: '', confirm: '' }
}

const confirmDeleteData = () => {
  $q.dialog({
    title: 'Xác nhận xóa dữ liệu',
    message: 'Bạn có chắc chắn muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác.',
    cancel: {
      label: 'Hủy',
      color: 'grey',
      flat: true,
    },
    ok: {
      label: 'Xóa',
      color: 'red',
    },
    persistent: true,
  }).onOk(() => {
    $q.notify({
      type: 'negative',
      message: 'Đã xóa toàn bộ dữ liệu',
      position: 'top-right',
    })
  })
}
</script>
