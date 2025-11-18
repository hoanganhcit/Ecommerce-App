<template>
  <!-- Left Sidebar Menu - Fixed Icon Only (Hidden on mobile) -->
  <aside
    class="hidden md:!flex fixed border-r border-gray-200 bg-white top-0 left-0 h-full w-20 z-50 flex-col"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-20">
      <img :src="settingsStore.storeLogo || '/favicon.ico'" class="w-10" alt="Logo" />
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 space-y-2 overflow-y-auto">
      <ul>
        <li
          class="h-20 flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 transition-all group"
        >
          <button
            @click="$emit('toggle-menu', true)"
            class=""
            active-class="!text-white !bg-gray-800"
          >
            <i class="fal fa-home text-xl mb-1"></i>
          </button>
        </li>
        <li
          class="h-20 flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 transition-all group"
        >
          <button
            @click="$emit('toggle-cart', true)"
            class="relative"
            active-class="!text-white !bg-gray-800"
          >
            <i class="fal fa-shopping-bag text-xl mb-1"></i>
            <span
              v-if="totalItems > 0"
              class="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ totalItems }}
            </span>
          </button>
        </li>
        <li
          class="h-20 flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 transition-all group"
        >
          <button @click="toggleSearch" class="relative" active-class="!text-white !bg-gray-800">
            <i class="fal fa-search text-xl mb-1"></i>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Bottom Items -->
    <div class="py-4 space-y-2">
      <!-- Login -->
      <router-link
        to="/login"
        class="flex flex-col items-center justify-center py-4 px-2 text-gray-400 transition-all group"
      >
        <i class="fal fa-user text-xl mb-1"></i>
      </router-link>
    </div>
  </aside>

  <!-- Mobile Bottom Navigation -->
  <nav class="md:!hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex items-center justify-around h-16">
      <button
        @click="$emit('toggle-menu', true)"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all"
      >
        <i class="fal fa-home text-xl mb-1"></i>
        <span class="text-xs">Home</span>
      </button>

      <router-link
        to="/shop"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all"
      >
        <i class="fal fa-store text-xl mb-1"></i>
        <span class="text-xs">Shop</span>
      </router-link>

      <button
        @click="$emit('toggle-cart', true)"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all relative"
      >
        <i class="fal fa-shopping-bag text-xl mb-1"></i>
        <span class="text-xs">Cart</span>
        <span
          v-if="totalItems > 0"
          class="absolute top-0 right-6 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ totalItems }}
        </span>
      </button>

      <router-link
        to="/login"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all"
      >
        <i class="fal fa-user text-xl mb-1"></i>
        <span class="text-xs">Account</span>
      </router-link>
    </div>
  </nav>

  <!-- Search Overlay -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showSearch" class="fixed inset-0 bg-black/10 z-50" @click="toggleSearch">
      <div class="fixed top-0 bottom-0 right-0 left-20 bg-white shadow-2xl" @click.stop>
        <div class="h-full flex flex-col">
          <!-- Search Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="text-2xl font-bold text-gray-800">Tìm Kiếm Sản Phẩm</div>
            <button
              @click="toggleSearch"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <i class="fal fa-times text-xl text-gray-600"></i>
            </button>
          </div>

          <!-- Search Input -->
          <div class="p-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                @keyup.enter="performSearch"
              />
              <i class="fal fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- Search Results -->
          <div class="flex-1 overflow-y-auto px-6 pb-6">
            <div v-if="searchQuery.length === 0" class="text-center py-12 text-gray-500">
              <i class="fal fa-search text-6xl mb-4 text-gray-300"></i>
              <p class="text-lg">Bắt đầu nhập để tìm kiếm sản phẩm</p>
            </div>

            <!-- Loading -->
            <div v-else-if="isSearching" class="flex items-center flex-col justify-center py-12">
              <q-spinner color="primary" size="48px" />
              <p class="mt-6 text-gray-600">Đang tìm kiếm...</p>
            </div>

            <!-- Results -->
            <div v-else-if="searchResults.length > 0" class="space-y-4">
              <p class="text-sm text-gray-600 mb-4">
                Tìm thấy {{ searchResults.length }} sản phẩm cho "{{ searchQuery }}"
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <router-link
                  v-for="product in searchResults"
                  :key="product._id"
                  :to="`/product/${product.slug || product._id}`"
                  @click="toggleSearch"
                  class="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    :src="product.thumbnail || product.images[0]"
                    :alt="product.name"
                    class="w-20 h-20 object-cover rounded"
                  />
                  <div class="flex-1">
                    <div class="font-semibold text-gray-800 line-clamp-2">{{ product.name }}</div>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-lg font-bold text-gray-900">{{
                        formatPrice(product.price)
                      }}</span>
                      <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                        {{ formatPrice(product.originalPrice) }}
                      </span>
                    </div>
                    <div v-if="product.discount" class="mt-1">
                      <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        -{{ product.discount }}%
                      </span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- No Results -->
            <div v-else class="text-center py-12 text-gray-500">
              <i class="fal fa-inbox text-6xl mb-4 text-gray-300"></i>
              <p class="text-lg">No products found for "{{ searchQuery }}"</p>
              <p class="text-sm mt-2">Try different keywords</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSettingsStore } from 'src/stores/useSettingsStore'
import axios from 'axios'

// Props
defineProps({
  totalItems: {
    type: Number,
    default: 0,
  },
})

// Emits
defineEmits(['toggle-menu', 'toggle-cart'])

// Settings store
const settingsStore = useSettingsStore()

// Search state
const showSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

// Toggle search overlay
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
    searchResults.value = []
  }
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

// Perform search
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const response = await axios.get('http://localhost:5000/api/products', {
      params: {
        search: searchQuery.value.trim(),
        limit: 20,
      },
    })

    if (response.data.success) {
      searchResults.value = response.data.data
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Watch search query for auto-search
let searchTimeout = null
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (newValue.trim().length >= 2) {
    searchTimeout = setTimeout(() => {
      performSearch()
    }, 500) // Debounce 500ms
  } else {
    searchResults.value = []
  }
})

onMounted(() => {
  settingsStore.fetchPublicSettings()
})
</script>
