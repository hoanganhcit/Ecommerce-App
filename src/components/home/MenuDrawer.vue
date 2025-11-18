<template>
  <aside
    :class="[
      'fixed top-0 h-full w-80 bg-gray-900 z-40  transform transition-all duration-300 ease-in-out',
      'md:left-20 left-0',
      showMenuDrawer ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <div class="text-xl font-light tracking-widest text-uppercase text-gray-100">
          {{ settingsStore.storeName || 'Louie Store' }}
        </div>
        <button
          @click="toggleMenuDrawer(false)"
          class="w-8 h-8 flex items-center justify-center text-gray-100 hover:text-gray-100 hover:bg-gray-800 rounded-full transition-all"
        >
          <i class="fal fa-times text-xl"></i>
        </button>
      </div>

      <!-- Menu List -->
      <nav class="flex-1 overflow-y-auto p-6">
        <div class="space-y-2">
          <router-link
            to="/"
            @click="toggleMenuDrawer(false)"
            class="block px-4 py-3 text-uppercase text-gray-100 hover:bg-gray-800 hover:text-gray-100 rounded-lg transition-all font-light tracking-widest"
          >
            <i class="fal fa-home mr-3 text-gray-100"></i>
            Trang Chủ
          </router-link>

          <router-link
            to="/shop"
            @click="toggleMenuDrawer(false)"
            class="block px-4 py-3 text-uppercase text-gray-100 hover:bg-gray-800 hover:text-gray-100 rounded-lg transition-all font-light tracking-widest"
          >
            <i class="fal fa-box-open mr-3 text-gray-100"></i>
            Sản Phẩm
          </router-link>

          <a
            @click="handleAccountClick"
            class="block px-4 py-3 text-uppercase text-gray-100 hover:bg-gray-800 hover:text-gray-100 rounded-lg transition-all font-light tracking-widest cursor-pointer"
          >
            <i class="fal fa-user-circle mr-3 text-gray-100"></i>
            Tài Khoản
          </a>

          <a
            @click="handleOrdersClick"
            class="block px-4 py-3 text-uppercase text-gray-100 hover:bg-gray-800 hover:text-gray-100 rounded-lg transition-all font-light tracking-widest cursor-pointer"
          >
            <i class="fal fa-clipboard-list mr-3 text-gray-100"></i>
            Đơn Hàng
          </a>
        </div>
      </nav>

      <!-- Footer - User Info -->
      <div class="border-t border-gray-200 p-6">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="isAuthenticated && userAvatar"
              :src="userAvatar"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <i v-else class="fal fa-user text-gray-600"></i>
          </div>
          <div class="flex-1">
            <div class="text-sm font-semibold text-gray-100 mb-1">
              {{ userName || 'Khách' }}
            </div>
            <div v-if="!isAuthenticated" class="flex gap-2">
              <q-btn
                label="Đăng Nhập"
                color="primary"
                no-caps
                rounded
                size="sm"
                @click="handleLogin"
              />
              <q-btn
                label="Đăng ký"
                color="secondary"
                no-caps
                rounded
                size="sm"
                @click="handleRegister"
              />
            </div>
            <button
              v-else
              @click="handleLogout"
              class="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/useAuthStore'
import { useSettingsStore } from 'src/stores/useSettingsStore'

const router = useRouter()
const $q = useQuasar()
const { isAuthenticated, userName, userAvatar, logout } = useAuthStore()
const settingsStore = useSettingsStore()
// Props
defineProps({
  showMenuDrawer: {
    type: Boolean,
    default: false,
  },
  toggleMenuDrawer: {
    type: Function,
    required: true,
  },
})

// Handle login button click
const handleLogin = () => {
  router.push('/home/login')
}

// Handle register button click
const handleRegister = () => {
  router.push('/home/register')
}

// Handle account click - check authentication
const handleAccountClick = () => {
  if (isAuthenticated.value) {
    router.push('/account')
  } else {
    router.push('/home/login')
  }
}

// Handle orders click - check authentication
const handleOrdersClick = () => {
  if (isAuthenticated.value) {
    router.push('/orders')
  } else {
    router.push('/home/login')
  }
}

// Handle logout
const handleLogout = () => {
  $q.dialog({
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn muốn đăng xuất?',
    cancel: {
      label: 'Hủy',
      flat: true,
    },
    ok: {
      label: 'Đăng xuất',
      color: 'negative',
    },
  }).onOk(() => {
    logout()
    $q.notify({
      type: 'positive',
      message: 'Đăng xuất thành công',
      position: 'top',
    })
    router.push('/')
  })
}
</script>
