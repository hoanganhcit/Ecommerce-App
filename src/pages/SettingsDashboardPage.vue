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
                    class="w-24 h-24 border-1 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50"
                  >
                    <img
                      v-if="settings.general.storeLogo"
                      :src="settings.general.storeLogo"
                      alt="Store Logo"
                      class="w-full h-full object-contain"
                    />
                    <i v-else class="fal fa-image text-3xl text-gray-400"></i>
                  </div>
                  <div class="flex flex-col gap-2">
                    <div class="flex gap-2">
                      <q-btn
                        label="Tải lên logo"
                        outline
                        color="primary"
                        icon="upload"
                        no-caps
                        @click="triggerLogoUpload"
                      />
                      <q-btn
                        v-if="settings.general.storeLogo"
                        label="Xóa logo"
                        outline
                        color="negative"
                        icon="delete"
                        no-caps
                        @click="removeLogo"
                      />
                      <input
                        ref="logoInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleLogoUpload"
                      />
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG (tối đa 2MB)</p>
                  </div>
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
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ zone.name }}</div>
                  <div class="text-sm text-gray-500">Phí: {{ formatPrice(zone.fee) }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <q-input
                    v-model.number="zone.fee"
                    outlined
                    dense
                    type="number"
                    label="Phí vận chuyển"
                    style="width: 150px"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="edit"
                    size="sm"
                    color="blue-grey"
                    @click="editShippingZone(zone)"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    size="sm"
                    color="red"
                    @click="deleteShippingZone(zone.id)"
                  />
                </div>
              </div>
              <q-btn
                label="Thêm khu vực"
                outline
                color="primary"
                class="w-full"
                @click="addShippingZone"
              />
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
            <div class="gap-2 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2">
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
            <div class="gap-2 grid grid-cols-1 md:grid-cols-3">
              <q-toggle
                v-model="settings.security.twoFactorAuth"
                label="Bật xác thực 2 yếu tố"
                color="primary"
                class="!mb-0"
              />
              <q-toggle
                v-model="settings.security.sessionTimeout"
                label="Tự động đăng xuất sau 30 phút"
                color="primary"
                class="!mb-0"
              />
              <q-toggle
                v-model="settings.security.ipRestriction"
                label="Giới hạn IP đăng nhập"
                color="primary"
                class="!mb-0"
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
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/useSettingsStore'
import axios from 'axios'

const $q = useQuasar()
const settingsStore = useSettingsStore()

// State
const activeSection = ref('general')
const loading = ref(false)
const logoInput = ref(null)

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
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeHotline: '',
    storeAddress: '',
    storeDescription: '',
    storeLogo: '',
    primaryColor: '',
    secondaryColor: '',
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
        name: 'VNPay',
        description: 'Thanh toán bằng VNPay',
        icon: 'fal fa-credit-card',
        enabled: false,
      },
    ],
    bankAccount: '',
    bankName: '',
    accountHolder: '',
    momoNumber: '',
  },
  shipping: {
    defaultFee: 30000,
    freeShippingThreshold: 500000,
    enableFreeShipping: true,
    zones: [],
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

// Fetch settings from API
const fetchSettings = async () => {
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

    const response = await axios.get('http://localhost:5000/api/settings', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.data.success && response.data.data) {
      // Merge fetched data with default values to ensure all fields exist
      const fetchedSettings = response.data.data

      settings.value = {
        general: { ...settings.value.general, ...fetchedSettings.general },
        payment: {
          ...settings.value.payment,
          ...fetchedSettings.payment,
          methods: fetchedSettings.payment?.methods || settings.value.payment.methods,
        },
        shipping: {
          ...settings.value.shipping,
          ...fetchedSettings.shipping,
          zones: fetchedSettings.shipping?.zones || settings.value.shipping.zones,
        },
        notification: { ...settings.value.notification, ...fetchedSettings.notification },
        security: { ...settings.value.security, ...fetchedSettings.security },
      }
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể tải cài đặt',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchSettings()
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const saveSettings = async () => {
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

    const response = await axios.put('http://localhost:5000/api/settings', settings.value, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.data.success) {
      // Update global settings store for real-time updates
      settingsStore.updateSettings({
        storeName: settings.value.general.storeName,
        storeLogo: settings.value.general.storeLogo,
        primaryColor: settings.value.general.primaryColor,
        secondaryColor: settings.value.general.secondaryColor,
      })

      $q.notify({
        type: 'positive',
        message: response.data.message || 'Lưu cài đặt thành công',
        position: 'top',
      })
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể lưu cài đặt',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    $q.notify({
      type: 'warning',
      message: 'Vui lòng điền đầy đủ thông tin',
      position: 'top',
    })
    return
  }

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    $q.notify({
      type: 'negative',
      message: 'Mật khẩu xác nhận không khớp',
      position: 'top',
    })
    return
  }

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

    const response = await axios.put(
      'http://localhost:5000/api/settings/change-password',
      {
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.new,
        confirmPassword: passwordForm.value.confirm,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: response.data.message || 'Đổi mật khẩu thành công',
        position: 'top',
      })
      passwordForm.value = { current: '', new: '', confirm: '' }
    }
  } catch (error) {
    console.error('Error changing password:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể đổi mật khẩu',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
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
      position: 'top',
    })
  })
}

// Add shipping zone
const addShippingZone = () => {
  $q.dialog({
    title: 'Thêm khu vực giao hàng',
    message: 'Nhập thông tin khu vực',
    prompt: {
      model: '',
      type: 'text',
      label: 'Tên khu vực',
    },
    cancel: true,
  }).onOk((zoneName) => {
    if (zoneName) {
      const newZone = {
        id: Date.now(),
        name: zoneName,
        fee: 30000,
      }
      settings.value.shipping.zones.push(newZone)
      $q.notify({
        type: 'positive',
        message: 'Đã thêm khu vực mới',
        position: 'top',
      })
    }
  })
}

// Edit shipping zone
const editShippingZone = (zone) => {
  $q.dialog({
    title: 'Chỉnh sửa khu vực',
    message: 'Nhập tên khu vực mới',
    prompt: {
      model: zone.name,
      type: 'text',
    },
    cancel: true,
  }).onOk((newName) => {
    zone.name = newName
    $q.notify({
      type: 'positive',
      message: 'Đã cập nhật khu vực',
      position: 'top',
    })
  })
}

// Delete shipping zone
const deleteShippingZone = (zoneId) => {
  $q.dialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa khu vực này?',
    cancel: true,
  }).onOk(() => {
    const index = settings.value.shipping.zones.findIndex((z) => z.id === zoneId)
    if (index > -1) {
      settings.value.shipping.zones.splice(index, 1)
      $q.notify({
        type: 'positive',
        message: 'Đã xóa khu vực',
        position: 'top',
      })
    }
  })
}

// Logo upload functions
const triggerLogoUpload = () => {
  logoInput.value.click()
}

const handleLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    $q.notify({
      type: 'negative',
      message: 'Kích thước file không được vượt quá 2MB',
      position: 'top',
    })
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    $q.notify({
      type: 'negative',
      message: 'Vui lòng chọn file ảnh (PNG, JPG, JPEG)',
      position: 'top',
    })
    return
  }

  try {
    loading.value = true

    // Convert to base64 for preview (or upload to server)
    const reader = new FileReader()
    reader.onload = (e) => {
      settings.value.general.storeLogo = e.target.result
      $q.notify({
        type: 'positive',
        message: 'Tải lên logo thành công',
        position: 'top',
      })
    }
    reader.readAsDataURL(file)

    // TODO: Upload to server if needed
    // const formData = new FormData()
    // formData.append('logo', file)
    // const token = localStorage.getItem('adminToken')
    // const response = await axios.post('http://localhost:5000/api/settings/upload-logo', formData, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    // settings.value.general.storeLogo = response.data.logoUrl
  } catch (error) {
    console.error('Error uploading logo:', error)
    $q.notify({
      type: 'negative',
      message: 'Không thể tải lên logo',
      position: 'top',
    })
  } finally {
    loading.value = false
    // Reset input
    event.target.value = ''
  }
}

const removeLogo = () => {
  $q.dialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa logo?',
    cancel: true,
  }).onOk(() => {
    settings.value.general.storeLogo = ''
    $q.notify({
      type: 'positive',
      message: 'Đã xóa logo',
      position: 'top',
    })
  })
}
</script>
