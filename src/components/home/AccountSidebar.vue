<template>
  <aside class="lg:col-span-1">
    <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
      <nav class="space-y-1">
        <router-link
          to="/account"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
          :class="
            $route.path === '/account'
              ? 'text-gray-900 bg-gray-100 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          <i class="fal fa-user-circle text-lg"></i>
          <span>Thông tin tài khoản</span>
        </router-link>
        <router-link
          to="/orders"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
          :class="
            $route.path === '/orders'
              ? 'text-gray-900 bg-gray-100 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          "
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
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/useAuthStore'

const router = useRouter()
const $q = useQuasar()
const { logout } = useAuthStore()

const handleLogout = () => {
  $q.dialog({
    title: 'Đăng xuất',
    message: 'Bạn có chắc chắn muốn đăng xuất?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    logout()
    $q.notify({
      type: 'positive',
      message: 'Đã đăng xuất',
      position: 'top',
    })
    router.push('/')
  })
}
</script>
