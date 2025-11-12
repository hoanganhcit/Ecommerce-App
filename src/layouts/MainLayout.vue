<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <!-- Mobile Header với Menu Button -->
    <q-header class="lg:!hidden bg-navy text-gray-800 shadow-sm">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-base font-semibold"> Ecommerce Admin </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="256"
      :breakpoint="1024"
      class="bg-white"
    >
      <div class="flex flex-col justify-between h-full">
        <div>
          <!-- Logo -->
          <div class="flex items-center gap-2 p-4">
            <img src="/favicon.ico" alt="Logo" class="h-10 w-10 object-contain" />
            <span class="text-lg font-semibold text-gray-800"> Ecommerce Admin </span>
          </div>

          <!-- Menu chính -->
          <nav class="px-3 mt-2 border-t border-gray-200 pt-4">
            <ul class="space-y-1">
              <li v-for="item in mainMenu" :key="item.label">
                <!-- Menu có submenu -->
                <div v-if="item.children">
                  <q-expansion-item
                    :icon="item.icon"
                    :label="item.label"
                    class="menu-expansion min-h-auto"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon :name="item.icon" size="14px" />
                      </q-item-section>
                      <q-item-section>
                        <span>{{ item.label }}</span>
                      </q-item-section>
                    </template>

                    <ul class="ml-4 mt-1 space-y-1">
                      <li v-for="child in item.children" :key="child.label">
                        <RouterLink
                          :to="child.to"
                          @click="handleMenuClick"
                          class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition text-sm"
                          active-class="bg-blue-100 text-blue-700 font-semibold"
                        >
                          <q-icon :name="child.icon" size="14px" />
                          <span>{{ child.label }}</span>
                        </RouterLink>
                      </li>
                    </ul>
                  </q-expansion-item>
                </div>

                <!-- Menu thường -->
                <RouterLink
                  v-else
                  :to="item.to"
                  @click="handleMenuClick"
                  class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-800 transition"
                  active-class="bg-blue-100 text-blue-700 font-semibold"
                >
                  <q-icon :name="item.icon" size="14px" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Footer -->
        <div class="px-3 pb-4 space-y-2 text-sm border-t border-gray-200 pt-3">
          <q-btn-dropdown flat no-caps class="w-full p-0" dropdown-icon="expand_less">
            <template v-slot:label>
              <div class="flex items-center justify-between gap-2 w-full p-2 rounded-md">
                <q-avatar size="32px" color="blue-6" text-color="white">
                  <q-icon name="person" />
                </q-avatar>
                <div class="flex-1 text-left">
                  <p class="text-gray-800 font-medium text-capitalize leading-none">
                    {{ currentUser?.username || 'Admin' }}
                  </p>
                </div>
              </div>
            </template>

            <q-list class="min-w-[200px]">
              <q-item clickable v-close-popup @click="goToSettings">
                <q-item-section avatar>
                  <q-icon name="settings" size="20px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Settings</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleSignOut">
                <q-item-section avatar>
                  <q-icon name="logout" size="20px" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-red-600">Sign Out</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </q-drawer>

    <!-- MAIN CONTENT -->
    <div class="flex flex-1 flex-col pb-2 lg:min-w-0 pt-2 p-2">
      <q-page-container>
        <div class="grow border border-gray-200 rounded-lg bg-gray-50 p-4">
          <router-view />
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const pageTitle = ref('Home')
const userDataKey = ref(0) // Key để force re-render
const leftDrawerOpen = ref(false)

// Toggle drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Handle menu click - đóng drawer trên mobile
const handleMenuClick = () => {
  // Chỉ đóng drawer khi màn hình < 1024px (mobile/tablet)
  if (window.innerWidth < 1024) {
    leftDrawerOpen.value = false
  }
}

// Lấy thông tin user hiện tại
const currentUser = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const _ = userDataKey.value // Force reactivity
  const userData = localStorage.getItem('currentUser')
  return userData ? JSON.parse(userData) : null
})

// Lắng nghe sự kiện cập nhật user
const handleUserUpdate = () => {
  userDataKey.value++ // Trigger re-compute
}

onMounted(() => {
  window.addEventListener('user-updated', handleUserUpdate)
})

onUnmounted(() => {
  window.removeEventListener('user-updated', handleUserUpdate)
})

// Theo dõi tiêu đề trang hiện tại
watch(
  () => route.name,
  (val) => (pageTitle.value = val || 'Home'),
  { immediate: true },
)

const mainMenu = [
  { label: 'Dashboard', icon: 'fal fa-tachometer-alt', to: '/admin/dashboard' },
  {
    label: 'Products',
    icon: 'fal fa-box-alt',
    children: [
      { label: 'All Products', icon: 'fal fa-list', to: '/admin/products' },
      { label: 'Categories', icon: 'fal fa-tags', to: '/admin/products/categories' },
    ],
  },
  { label: 'Orders', icon: 'fal fa-shopping-cart', to: '/admin/orders' },
  { label: 'Customers', icon: 'fal fa-users', to: '/admin/customers' },
  { label: 'Analytics', icon: 'fal fa-chart-line', to: '/admin/analytics' },
  { label: 'Settings', icon: 'fal fa-cog', to: '/admin/settings' },
]

// Chuyển đến trang Settings
const goToSettings = () => {
  router.push('/admin/settings')
}

// Xử lý Sign Out
const handleSignOut = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to sign out?',
    cancel: {
      label: 'Cancel',
      color: 'grey',
      flat: true,
    },
    ok: {
      label: 'Sign Out',
      color: 'red',
    },
    persistent: false,
  }).onOk(() => {
    // Xóa session/token
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    sessionStorage.clear()

    // Notify user
    $q.notify({
      message: 'Signed out successfully',
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
      timeout: 2000,
    })

    // Redirect to login
    router.push('/login')
  })
}
</script>

<style scoped>
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

/* Style cho q-expansion-item giống menu thường */
:deep(.menu-expansion .q-item) {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: #374151;
  transition: all 0.2s;
}

:deep(.menu-expansion .q-item:hover) {
  background-color: #e5e7eb;
  color: #1f2937;
}

:deep(.menu-expansion .q-expansion-item__container) {
  margin-bottom: 0.25rem;
}

:deep(.menu-expansion .q-item__section--avatar) {
  min-width: auto;
  padding-right: 0.75rem;
}

:deep(.menu-expansion .q-icon) {
  font-size: 20px;
}
</style>
