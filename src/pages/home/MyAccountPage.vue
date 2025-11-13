<template>
  <q-page class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="text-3xl font-bold text-gray-900">Tài khoản của tôi</div>
        <p class="text-gray-600 mt-2">Quản lý thông tin cá nhân và bảo mật</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar Menu -->
        <AccountSidebar />

        <!-- Main Content -->
        <main class="lg:col-span-3 space-y-6">
          <!-- Profile Information -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="text-xl font-bold text-gray-900">Thông tin cá nhân</div>
              <q-btn
                v-if="!isEditing"
                flat
                color="primary"
                @click="isEditing = true"
                class=""
                no-caps
              >
                <i class="fal fa-edit mr-2"></i>
                <span>Chỉnh sửa</span>
              </q-btn>
            </div>

            <form @submit.prevent="handleSaveProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Avatar -->
                <div class="md:col-span-2 flex items-center gap-6">
                  <div class="relative">
                    <div
                      class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300"
                    >
                      <img
                        v-if="profile.avatar"
                        :src="profile.avatar"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="fal fa-user text-4xl text-gray-400"></i>
                    </div>
                    <input
                      ref="avatarInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarUpload"
                      :disabled="isUploadingAvatar"
                    />
                    <button
                      v-if="isEditing && !isUploadingAvatar"
                      type="button"
                      @click="$refs.avatarInput.click()"
                      class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
                    >
                      <i class="fal fa-camera text-sm"></i>
                    </button>
                    <!-- Loading spinner when uploading -->
                    <div
                      v-if="isUploadingAvatar"
                      class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <q-spinner color="white" size="20px" />
                    </div>
                  </div>
                  <div>
                    <div class="text-lg font-semibold text-gray-900">
                      {{ profile.fullName || 'Chưa cập nhật' }}
                    </div>
                    <p class="text-sm text-gray-500">{{ profile.email }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                      Mã KH: {{ customer?.customerId || 'N/A' }}
                    </p>
                  </div>
                </div>

                <!-- Full Name -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input
                    v-model="profile.fullName"
                    type="text"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                    :class="{ 'bg-gray-50': !isEditing }"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    v-model="profile.phone"
                    type="tel"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                    :class="{ 'bg-gray-50': !isEditing }"
                  />
                </div>

                <!-- Email (readonly) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    v-model="profile.email"
                    type="email"
                    readonly
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="isEditing" class="flex gap-3 mt-6">
                <q-btn
                  label="Lưu thay đổi"
                  type="submit"
                  class="!bg-gray-900 text-white hover:!bg-gray-800"
                  unelevated
                  :loading="isSaving"
                  no-caps
                />
                <q-btn label="Hủy" no-caps flat @click="cancelEdit" />
              </div>
            </form>
          </div>

          <!-- Address Management -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="text-xl font-bold text-gray-900">Địa chỉ giao hàng</div>
              <q-btn
                flat
                color="primary"
                no-caps
                @click="
                  () => {
                    editingAddress = null
                    addressForm = {
                      label: '',
                      receiverName: customer?.fullName || '',
                      phone: customer?.phone || '',
                      fullAddress: '',
                      isDefault: addresses.length === 0,
                    }
                    showAddressDialog = true
                  }
                "
              >
                <i class="fal fa-plus mr-2"></i>
                <span>Thêm địa chỉ</span>
              </q-btn>
            </div>

            <!-- Addresses List -->
            <div v-if="addresses.length > 0" class="space-y-4">
              <div
                v-for="(address, index) in addresses"
                :key="address._id || index"
                class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
                :class="{ 'border-blue-500 bg-blue-50': address.isDefault }"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-semibold text-gray-900">{{ address.label }}</span>
                      <span
                        v-if="address.isDefault"
                        class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium"
                      >
                        Mặc định
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ address.receiverName }}</p>
                    <p class="text-sm text-gray-600">{{ address.phone }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ address.fullAddress }}</p>
                  </div>
                  <div class="flex gap-2">
                    <q-btn
                      v-if="!address.isDefault"
                      flat
                      round
                      dense
                      icon="fal fa-check"
                      color="positive"
                      size="sm"
                      @click="setDefaultAddress(address._id)"
                    >
                      <q-tooltip>Đặt làm mặc định</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="fal fa-edit"
                      color="primary"
                      size="sm"
                      @click="editAddress(address)"
                    >
                      <q-tooltip>Chỉnh sửa</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="fal fa-trash"
                      color="negative"
                      size="sm"
                      @click="deleteAddress(address._id)"
                    >
                      <q-tooltip>Xóa</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 text-gray-500">
              <i class="fal fa-map-marker-alt text-5xl mb-3 text-gray-300"></i>
              <p class="text-lg">Chưa có địa chỉ nào</p>
              <p class="text-sm mt-1">Thêm địa chỉ giao hàng để tiện cho việc đặt hàng</p>
            </div>
          </div>

          <!-- Change Password -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</div>
            <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Mật khẩu hiện tại</label
                >
                <input
                  v-model="passwordForm.current"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <input
                  v-model="passwordForm.new"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Xác nhận mật khẩu mới</label
                >
                <input
                  v-model="passwordForm.confirm"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <q-btn
                label="Đổi mật khẩu"
                type="submit"
                class="!bg-gray-900 text-white hover:!bg-gray-800"
                no-caps
                unelevated
                :loading="isChangingPassword"
              />
            </form>
          </div>
        </main>
      </div>
    </div>

    <!-- Add/Edit Address Dialog -->
    <q-dialog v-model="showAddressDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <form @submit.prevent="handleSaveAddress" class="space-y-4">
            <!-- Label -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nhãn địa chỉ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="addressForm.label"
                type="text"
                placeholder="Ví dụ: Nhà riêng, Văn phòng..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <!-- Receiver Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Người nhận <span class="text-red-500">*</span>
              </label>
              <input
                v-model="addressForm.receiverName"
                type="text"
                placeholder="Họ và tên người nhận"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span class="text-red-500">*</span>
              </label>
              <input
                v-model="addressForm.phone"
                type="tel"
                placeholder="0123456789"
                pattern="[0-9]{10,11}"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <!-- Full Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ đầy đủ <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="addressForm.fullAddress"
                rows="3"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              ></textarea>
            </div>

            <!-- Set as Default -->
            <div class="flex items-center gap-2">
              <input
                v-model="addressForm.isDefault"
                type="checkbox"
                id="setDefault"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label for="setDefault" class="text-sm text-gray-700 cursor-pointer">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </form>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Hủy" color="grey-7" @click="closeAddressDialog" />
          <q-btn
            unelevated
            label="Lưu"
            color="primary"
            :loading="isSavingAddress"
            @click="handleSaveAddress"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/useAuthStore'
import axios from 'axios'
import AccountSidebar from 'src/components/home/AccountSidebar.vue'

const router = useRouter()
const $q = useQuasar()
const { customer, updateCustomer, getAuthHeader } = useAuthStore()

// State
const isEditing = ref(false)
const isSaving = ref(false)
const isChangingPassword = ref(false)
const avatarInput = ref(null)
const isUploadingAvatar = ref(false)

// Address management state
const showAddressDialog = ref(false)
const isSavingAddress = ref(false)
const editingAddress = ref(null)
const addresses = ref([])

const profile = ref({
  fullName: '',
  phone: '',
  email: '',
  avatar: '',
})

const originalProfile = ref({ ...profile.value })

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const addressForm = ref({
  label: '',
  receiverName: '',
  phone: '',
  fullAddress: '',
  isDefault: false,
})

// Load customer data and addresses on mount
onMounted(async () => {
  if (customer.value) {
    profile.value = {
      fullName: customer.value.fullName || '',
      phone: customer.value.phone || '',
      email: customer.value.email || '',
      avatar: customer.value.avatar || '',
    }
    originalProfile.value = { ...profile.value }

    // Load addresses
    await loadAddresses()
  } else {
    // Redirect to login if not authenticated
    router.push('/login')
  }
})

// Load addresses
const loadAddresses = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/customers/addresses', {
      headers: getAuthHeader(),
    })

    if (response.data.success) {
      addresses.value = response.data.data || []
    }
  } catch (error) {
    console.error('Load addresses error:', error)
    // Silently fail - addresses will be empty array
  }
}

// Edit address
const editAddress = (address) => {
  editingAddress.value = address
  addressForm.value = {
    label: address.label,
    receiverName: address.receiverName,
    phone: address.phone,
    fullAddress: address.fullAddress,
    isDefault: address.isDefault,
  }
  showAddressDialog.value = true
}

// Close dialog
const closeAddressDialog = () => {
  showAddressDialog.value = false
  editingAddress.value = null
  addressForm.value = {
    label: '',
    receiverName: '',
    phone: '',
    fullAddress: '',
    isDefault: false,
  }
}

// Save address (add or update)
const handleSaveAddress = async () => {
  isSavingAddress.value = true
  try {
    let response
    if (editingAddress.value) {
      // Update existing address
      response = await axios.put(
        `http://localhost:5000/api/customers/addresses/${editingAddress.value._id}`,
        addressForm.value,
        { headers: getAuthHeader() },
      )
    } else {
      // Add new address
      response = await axios.post(
        'http://localhost:5000/api/customers/addresses',
        addressForm.value,
        { headers: getAuthHeader() },
      )
    }

    if (response.data.success) {
      await loadAddresses()
      closeAddressDialog()
      $q.notify({
        type: 'positive',
        message: editingAddress.value
          ? 'Cập nhật địa chỉ thành công!'
          : 'Thêm địa chỉ mới thành công!',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('Save address error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Lưu địa chỉ thất bại. Vui lòng thử lại.',
      position: 'top-right',
    })
  } finally {
    isSavingAddress.value = false
  }
}

// Set default address
const setDefaultAddress = async (addressId) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/customers/addresses/${addressId}/set-default`,
      {},
      { headers: getAuthHeader() },
    )

    if (response.data.success) {
      await loadAddresses()
      $q.notify({
        type: 'positive',
        message: 'Đã đặt làm địa chỉ mặc định',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('Set default address error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể đặt địa chỉ mặc định',
      position: 'top-right',
    })
  }
}

// Delete address
const deleteAddress = async (addressId) => {
  $q.dialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/customers/addresses/${addressId}`,
        { headers: getAuthHeader() },
      )

      if (response.data.success) {
        await loadAddresses()
        $q.notify({
          type: 'positive',
          message: 'Đã xóa địa chỉ',
          position: 'top-right',
        })
      }
    } catch (error) {
      console.error('Delete address error:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Xóa địa chỉ thất bại',
        position: 'top-right',
      })
    }
  })
}

// Avatar upload handler
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    $q.notify({
      type: 'negative',
      message: 'Vui lòng chọn file ảnh',
      position: 'top-right',
    })
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    $q.notify({
      type: 'negative',
      message: 'Kích thước ảnh không được vượt quá 5MB',
      position: 'top-right',
    })
    return
  }

  isUploadingAvatar.value = true

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    // Upload to server
    // Note: Don't set Content-Type header manually for FormData
    // Browser will automatically set it with boundary
    const response = await axios.post(
      'http://localhost:5000/api/customers/upload-avatar',
      formData,
      {
        headers: getAuthHeader(), // Only send Authorization header
      },
    )

    if (response.data.success) {
      profile.value.avatar = response.data.data.avatar
      updateCustomer(response.data.data)

      $q.notify({
        type: 'positive',
        message: 'Cập nhật ảnh đại diện thành công!',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('Upload avatar error:', error)
    console.error('Error response:', error.response)

    let errorMessage = 'Tải lên ảnh thất bại. Vui lòng thử lại.'

    if (error.response) {
      // Server responded with error
      errorMessage = error.response.data?.message || errorMessage
      console.error('Server error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối.'
      console.error('No response from server')
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message)
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right',
      timeout: 5000,
    })
  } finally {
    isUploadingAvatar.value = false
  }
}

// Save profile
const handleSaveProfile = async () => {
  isSaving.value = true
  try {
    const response = await axios.put(
      'http://localhost:5000/api/customers/profile',
      {
        fullName: profile.value.fullName,
        phone: profile.value.phone,
      },
      {
        headers: getAuthHeader(),
      },
    )

    if (response.data.success) {
      updateCustomer(response.data.data)
      originalProfile.value = { ...profile.value }
      isEditing.value = false

      $q.notify({
        type: 'positive',
        message: 'Cập nhật thông tin thành công!',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('Update profile error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.',
      position: 'top-right',
    })
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  profile.value = { ...originalProfile.value }
  isEditing.value = false
}

// Change password
const handleChangePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    $q.notify({
      type: 'negative',
      message: 'Mật khẩu xác nhận không khớp',
      position: 'top-right',
    })
    return
  }

  if (passwordForm.value.new.length < 6) {
    $q.notify({
      type: 'negative',
      message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      position: 'top-right',
    })
    return
  }

  isChangingPassword.value = true
  try {
    const response = await axios.put(
      'http://localhost:5000/api/customers/change-password',
      {
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.new,
      },
      {
        headers: getAuthHeader(),
      },
    )

    if (response.data.success) {
      passwordForm.value = { current: '', new: '', confirm: '' }
      $q.notify({
        type: 'positive',
        message: 'Đổi mật khẩu thành công!',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('Change password error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
      position: 'top-right',
    })
  } finally {
    isChangingPassword.value = false
  }
}
</script>
