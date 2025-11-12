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
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
            <nav class="space-y-1">
              <router-link
                to="/account"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 bg-gray-100 font-medium transition-all"
              >
                <i class="fal fa-user-circle text-lg"></i>
                <span>Thông tin tài khoản</span>
              </router-link>
              <router-link
                to="/orders"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
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
        <main class="lg:col-span-3 space-y-6">
          <!-- Profile Information -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="text-xl font-bold text-gray-900">Thông tin cá nhân</div>
              <q-btn
                v-if="!isEditing"
                label="Chỉnh sửa"
                flat
                color="primary"
                icon="fal fa-edit"
                @click="isEditing = true"
              />
            </div>

            <form @submit.prevent="handleSaveProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Avatar -->
                <div class="md:col-span-2 flex items-center gap-6">
                  <div class="relative">
                    <div
                      class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        v-if="profile.avatar"
                        :src="profile.avatar"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="fal fa-user text-4xl text-gray-400"></i>
                    </div>
                    <button
                      v-if="isEditing"
                      type="button"
                      class="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all"
                    >
                      <i class="fal fa-camera text-sm"></i>
                    </button>
                  </div>
                  <div>
                    <div class="text-lg font-semibold text-gray-900">{{ profile.fullName }}</div>
                    <p class="text-sm text-gray-500">{{ profile.email }}</p>
                  </div>
                </div>

                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <q-input v-model="profile.fullName" outlined dense :readonly="!isEditing" />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <q-input v-model="profile.phone" outlined dense :readonly="!isEditing" />
                </div>

                <!-- Email -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <q-input v-model="profile.email" outlined dense readonly />
                </div>

                <!-- Birthday -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <q-input
                    v-model="profile.birthday"
                    outlined
                    dense
                    type="date"
                    :readonly="!isEditing"
                  />
                </div>

                <!-- Gender -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <q-select
                    v-model="profile.gender"
                    :options="genderOptions"
                    outlined
                    dense
                    :readonly="!isEditing"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="isEditing" class="flex gap-3 mt-6">
                <q-btn
                  label="Lưu thay đổi"
                  type="submit"
                  color="primary"
                  unelevated
                  :loading="isSaving"
                />
                <q-btn label="Hủy" flat @click="cancelEdit" />
              </div>
            </form>
          </div>

          <!-- Address Book -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="text-xl font-bold text-gray-900">Địa chỉ giao hàng</div>
              <q-btn label="Thêm địa chỉ" flat color="primary" icon="fal fa-plus" />
            </div>

            <div class="space-y-4">
              <div
                v-for="(address, index) in addresses"
                :key="index"
                class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-semibold text-gray-900">{{ address.name }}</span>
                      <span
                        v-if="address.isDefault"
                        class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded"
                      >
                        Mặc định
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ address.phone }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ address.fullAddress }}</p>
                  </div>
                  <div class="flex gap-2">
                    <q-btn flat round dense icon="fal fa-edit" color="primary" size="sm" />
                    <q-btn flat round dense icon="fal fa-trash" color="negative" size="sm" />
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="addresses.length === 0" class="text-center py-8 text-gray-500">
                <i class="fal fa-map-marker-alt text-4xl mb-3"></i>
                <p>Chưa có địa chỉ nào</p>
              </div>
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
                <q-input v-model="passwordForm.current" type="password" outlined dense />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <q-input v-model="passwordForm.new" type="password" outlined dense />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Xác nhận mật khẩu mới</label
                >
                <q-input v-model="passwordForm.confirm" type="password" outlined dense />
              </div>
              <q-btn
                label="Đổi mật khẩu"
                type="submit"
                color="primary"
                unelevated
                :loading="isChangingPassword"
              />
            </form>
          </div>
        </main>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// State
const isEditing = ref(false)
const isSaving = ref(false)
const isChangingPassword = ref(false)

const profile = ref({
  fullName: 'Nguyễn Văn A',
  phone: '0123456789',
  email: 'nguyenvana@email.com',
  birthday: '1990-01-01',
  gender: 'Nam',
  avatar: '',
})

const originalProfile = ref({ ...profile.value })

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const genderOptions = ['Nam', 'Nữ', 'Khác']

const addresses = ref([
  {
    name: 'Nhà riêng',
    phone: '0123456789',
    fullAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    isDefault: true,
  },
  {
    name: 'Văn phòng',
    phone: '0987654321',
    fullAddress: '456 Đường DEF, Phường GHI, Quận 3, TP.HCM',
    isDefault: false,
  },
])

// Methods
const handleSaveProfile = async () => {
  isSaving.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    originalProfile.value = { ...profile.value }
    isEditing.value = false
    $q.notify({
      type: 'positive',
      message: 'Cập nhật thông tin thành công!',
      position: 'top-right',
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Cập nhật thất bại. Vui lòng thử lại.',
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

const handleChangePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    $q.notify({
      type: 'negative',
      message: 'Mật khẩu xác nhận không khớp',
      position: 'top-right',
    })
    return
  }

  isChangingPassword.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    passwordForm.value = { current: '', new: '', confirm: '' }
    $q.notify({
      type: 'positive',
      message: 'Đổi mật khẩu thành công!',
      position: 'top-right',
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
      position: 'top-right',
    })
  } finally {
    isChangingPassword.value = false
  }
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
