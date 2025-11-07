<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <!-- Transparent Fixed Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div
        :class="[
          'flex items-center justify-between px-6 py-4 transition-all duration-300 ease-in-out',
          drawer ? 'ml-72' : 'ml-0',
        ]"
      >
        <!-- Left: Menu Icon (Hamburger to X) -->
        <button
          @click="drawer = !drawer"
          class="relative w-8 h-8 flex flex-col justify-center items-center group"
        >
          <span
            :class="[
              'block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out',
              drawer ? '!rotate-45 translate-y-1.5' : 'translate-y-0',
            ]"
          ></span>
          <span
            :class="[
              'block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out my-1',
              drawer ? 'opacity-0' : 'opacity-100',
            ]"
          ></span>
          <span
            :class="[
              'block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out',
              drawer ? '-rotate-45 -translate-y-1.5' : 'translate-y-0',
            ]"
          ></span>
        </button>

        <!-- Right: Cart Text -->
        <div
          @click="cartDrawer = !cartDrawer"
          class="text-white font-medium cursor-pointer hover:text-gray-200 transition-colors"
        >
          Giỏ Hàng ({{ cartCount }})
        </div>
      </div>
    </header>

    <!-- Overlay -->
    <div
      v-if="drawer || cartDrawer"
      @click="((drawer = false), (cartDrawer = false))"
      class="fixed inset-0 z-40 transition-opacity duration-300"
    ></div>

    <!-- Left Sidebar Menu -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
        drawer ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col overflow-y-auto">
        <!-- Menu Header with Close Button -->
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <div class="text-2xl font-bold text-gray-900">Menu</div>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 p-6 space-y-4">
          <router-link
            to="/"
            @click="drawer = false"
            class="block text-xs text-gray-700 hover:text-gray-900 transition-colors py-2 text-uppercase font-medium"
          >
            Trang Chủ
          </router-link>

          <!-- Shop with Expandable Categories -->
          <div class="space-y-2">
            <button
              @click="shopExpanded = !shopExpanded"
              class="w-full flex items-center justify-between !text-xs text-gray-700 hover:text-gray-900 transition-colors py-2 text-uppercase font-medium"
            >
              <span>Danh Mục Sản Phẩm</span>
              <span v-if="!shopExpanded" class="fal fa-plus"></span>
              <span v-else class="fal fa-minus"></span>
            </button>

            <!-- Categories -->
            <div v-if="shopExpanded" class="ml-4 space-y-2 mt-2">
              <div v-for="category in categories" :key="category.id">
                <button
                  @click="toggleCategory(category.id)"
                  class="w-full flex items-center justify-between !text-xs text-uppercase text-gray-600 hover:text-gray-900 transition-colors py-1"
                >
                  <span>{{ category.name }}</span>
                  <span v-if="!category.expanded" class="fal fa-plus"></span>
                  <span v-else class="fal fa-minus"></span>
                </button>
                <div v-if="category.expanded" class="ml-3 mt-1 space-y-2">
                  <router-link
                    v-for="item in category.items"
                    :key="item.slug"
                    :to="`/shop/${category.slug}/${item.slug}`"
                    @click="drawer = false"
                    class="block text-xs text-gray-500 hover:text-gray-900 py-0.5"
                  >
                    {{ item.name }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <router-link
            to="/collections"
            @click="drawer = false"
            class="block text-xs text-gray-700 hover:text-gray-900 transition-colors py-2 text-uppercase font-medium"
          >
            Bộ Sưu Tập
          </router-link>
          <router-link
            to="/contact"
            @click="drawer = false"
            class="block text-xs text-gray-700 hover:text-gray-900 transition-colors py-2 text-uppercase font-medium"
          >
            Liên Hệ
          </router-link>
          <router-link
            to="/login"
            @click="drawer = false"
            class="block text-xs text-gray-700 hover:text-gray-900 transition-colors py-2 text-uppercase font-medium"
          >
            Đăng Nhập
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Right Cart Sidebar -->
    <aside
      :class="[
        'fixed top-0 right-0 h-full w-96 bg-white  z-50 transform transition-transform duration-300 ease-in-out',
        cartDrawer ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <div class="text-2xl font-bold text-gray-900">Giỏ Hàng</div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-3">
          <div v-if="cartItems.length === 0" class="text-center py-12">
            <svg
              class="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p class="text-gray-500 text-lg">Giỏ hàng trống</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-4 p-4">
              <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded" />
              <div class="flex-1">
                <div class="font-semibold text-gray-900 mb-1">{{ item.name }}</div>
                <p v-if="item.size" class="text-sm text-gray-500 !mb-0">Size: {{ item.size }}</p>

                <div class="flex items-center justify-between mt-3">
                  <!-- Quantity Controls - Rectangle Style -->
                  <div class="flex items-center border border-gray-300 overflow-hidden">
                    <button
                      @click="updateQuantity(item, -1)"
                      class="w-7 h-7 flex items-center justify-center bg-white"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <div
                      class="w-9 h-7 flex items-center justify-center text-xs font-medium bg-white"
                    >
                      {{ item.quantity }}
                    </div>
                    <button
                      @click="updateQuantity(item, 1)"
                      class="w-7 h-7 flex items-center justify-center bg-white"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Price -->
                  <div class="text-right">
                    <p class="font-bold text-black text-lg !mb-0">
                      {{ (item.price * item.quantity).toLocaleString('vi-VN') }}₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div v-if="cartItems.length > 0" class="p-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-700 font-medium">Tổng cộng:</span>
            <span class="text-2xl font-bold text-gray-900"
              >{{ cartTotal.toLocaleString('vi-VN') }}₫</span
            >
          </div>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              @click="checkout"
              class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors mb-2"
            >
              Thanh Toán
            </button>
            <button
              @click="cartDrawer = false"
              class="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)
const cartDrawer = ref(false)

// Menu expansion states
const shopExpanded = ref(false)

// Categories data
const categories = ref([
  {
    id: 'men',
    name: 'Nam',
    slug: 'men',
    expanded: false,
    items: [
      { name: 'Áo Sơ Mi', slug: 'shirts' },
      { name: 'Áo Polo', slug: 'polo' },
      { name: 'Áo Thun', slug: 'tshirts' },
      { name: 'Áo Khoác', slug: 'jackets' },
      { name: 'Quần Jeans', slug: 'jeans' },
    ],
  },
  {
    id: 'women',
    name: 'Nữ',
    slug: 'women',
    expanded: false,
    items: [
      { name: 'Váy Đầm', slug: 'dresses' },
      { name: 'Áo Sơ Mi', slug: 'blouses' },
      { name: 'Áo Thun', slug: 'tshirts' },
      { name: 'Áo Khoác', slug: 'jackets' },
      { name: 'Chân Váy', slug: 'skirts' },
    ],
  },
  {
    id: 'accessories',
    name: 'Phụ Kiện',
    slug: 'accessories',
    expanded: false,
    items: [
      { name: 'Túi Xách', slug: 'bags' },
      { name: 'Thắt Lưng', slug: 'belts' },
      { name: 'Đồng Hồ', slug: 'watches' },
      { name: 'Kính Mát', slug: 'sunglasses' },
    ],
  },
])

const toggleCategory = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}

// Sample cart items
const cartItems = ref([
  {
    id: 1,
    name: 'Áo Thun Trắng Basic',
    price: 199000,
    quantity: 2,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100',
  },
  {
    id: 2,
    name: 'Quần Jeans Slimfit',
    price: 450000,
    quantity: 1,
    size: 'L',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100',
  },
])

const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const updateQuantity = (item, change) => {
  const index = cartItems.value.findIndex((i) => i.id === item.id)
  if (index > -1) {
    const newQuantity = cartItems.value[index].quantity + change
    if (newQuantity > 0) {
      cartItems.value[index].quantity = newQuantity
    } else {
      removeFromCart(item)
    }
  }
}

const removeFromCart = (item) => {
  const index = cartItems.value.findIndex((i) => i.id === item.id)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const checkout = () => {
  cartDrawer.value = false
  router.push('/checkout')
}
</script>
