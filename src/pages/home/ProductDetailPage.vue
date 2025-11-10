<template>
  <q-page class="product-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <q-spinner color="primary" size="50px" />
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <q-icon name="error_outline" size="80px" color="grey-5" />
        <div class="text-2xl font-bold text-gray-700 mt-4">Không tìm thấy sản phẩm</div>
        <q-btn
          color="primary"
          label="Quay lại cửa hàng"
          class="mt-6"
          @click="$router.push('/shop')"
        />
      </div>
    </div>

    <!-- Product Detail - Full Height Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <!-- Left: Image Carousel - Full Height -->
      <div class="h-full bg-gray-100">
        <q-option-group v-model="navPos" :options="navigationPositions" color="purple" inline />
        <q-carousel
          v-model="slide"
          animated
          infinite
          control-color="white"
          control-type="flat"
          class="h-full"
          height="100%"
          :navigation-position="navPos"
          navigation
        >
          <q-carousel-slide
            v-for="(img, index) in productImages"
            :key="index"
            :name="index"
            class="flex items-center justify-center !p-0"
          >
            <img
              :src="img"
              :alt="`${product.name} ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </q-carousel-slide>
        </q-carousel>
      </div>

      <!-- Right: Product Info Card -->
      <div class="h-full flex items-center overflow-y-auto bg-white">
        <div class="p-8 lg:p-12 max-w-2xl w-full mx-auto">
          <!-- Title -->
          <div class="text-xl text-uppercase font-bold text-gray-900 mb-4">{{ product.name }}</div>

          <!-- Price -->
          <div class="mb-2">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xl font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </span>
              <span v-if="product.originalPrice" class="text-xl text-gray-400 line-through">
                {{ formatPrice(product.originalPrice) }}
              </span>
              <div
                v-if="product.discount"
                class="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
              >
                Giảm {{ product.discount }}%
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <p class="text-gray-600 text-sm leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Size Selection -->
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-900 mb-3 uppercase">Kích thước</label>
            <div class="flex gap-2">
              <button
                v-for="size in sizes"
                :key="size"
                @click="selectedSize = size"
                :class="[
                  'px-3 text-sm py-1 border-1 rounded font-semibold transition-all',
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400',
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Color Selection -->
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-900 mb-3 uppercase">Màu sắc</label>
            <div class="flex gap-3">
              <button
                v-for="color in colors"
                :key="color.name"
                @click="selectedColor = color.name"
                :class="[
                  'w-6 h-6 rounded-full border-2 transition-all',
                  selectedColor === color.name ? 'border-black scale-110' : 'border-gray-200',
                ]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              />
            </div>
          </div>

          <!-- Quantity & Add to Cart -->
          <div class="space-y-4">
            <!-- Quantity -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-3 uppercase">Số lượng</label>
              <div class="flex items-center gap-4">
                <div class="flex items-center border-1 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    @click="decreaseQuantity"
                    class="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
                  >
                    <q-icon name="remove" size="18px" />
                  </button>
                  <div
                    class="w-20 h-10 flex items-center justify-center text-xl font-bold bg-white border-x-2 border-gray-300"
                  >
                    {{ quantity }}
                  </div>
                  <button
                    @click="increaseQuantity"
                    class="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
                  >
                    <q-icon name="add" size="18px" />
                  </button>
                </div>
                <span class="text-sm text-gray-600">Còn {{ product.stock || 99 }} sản phẩm</span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="addToCart"
              class="w-full bg-black text-white py-5 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
            >
              <i class="fal fa-shopping-cart text-xl"></i>
              Thêm vào giỏ hàng
            </button>
          </div>

          <!-- Additional Info -->
          <div class="mt-8 pt-8 border-t space-y-4">
            <div class="flex items-center gap-3 text-gray-600">
              <i class="fal fa-truck text-xl"></i>
              <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <i class="fal fa-undo text-xl"></i>
              <span>Đổi trả trong vòng 30 ngày</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <i class="fal fa-shield-check text-xl"></i>
              <span>Bảo hành chính hãng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

// State
const loading = ref(true)
const product = ref(null)
const quantity = ref(1)
const slide = ref(0)
const selectedSize = ref('M')
const selectedColor = ref('Đen')
const navPos = ref('right')
// Variations
const sizes = ref(['S', 'M', 'L', 'XL', 'XXL'])
const colors = ref([
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Xám', value: '#9CA3AF' },
  { name: 'Xanh Navy', value: '#1E3A8A' },
  { name: 'Be', value: '#D4A574' },
])

// Mock products data - Replace with API call
const allProducts = [
  {
    id: 1,
    name: 'Áo sơ mi nam cao cấp',
    description: 'Áo sơ mi nam chất liệu cotton 100%, thoáng mát',
    price: 450000,
    originalPrice: 650000,
    discount: 30,
    image: '/product-2.jpg',
    category: 'men',
    rating: 4.5,
    reviews: 128,
    stock: 45,
  },
  {
    id: 2,
    name: 'Váy đầm nữ thanh lịch',
    description: 'Váy đầm nữ thiết kế hiện đại, phù hợp đi làm',
    price: 580000,
    originalPrice: 780000,
    discount: 25,
    image: '/product-2.jpg',
    category: 'women',
    rating: 4.8,
    reviews: 95,
    stock: 32,
  },
  // Add more products as needed
]

// Computed
const productImages = computed(() => {
  if (!product.value) return []
  // Generate multiple images for demo
  return [product.value.image, `/product.jpg`, `/product-2.jpg`, `/product-3.jpg`]
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const increaseQuantity = () => {
  if (quantity.value < (product.value?.stock || 99)) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  $q.notify({
    message: `Đã thêm ${quantity.value} sản phẩm "${product.value.name}" (${selectedSize.value} - ${selectedColor.value}) vào giỏ hàng`,
    color: 'positive',
    icon: 'check_circle',
    position: 'top-right',
  })
}

const loadProduct = () => {
  loading.value = true

  // Extract product ID from slug (format: slug-name-123)
  const slug = route.params.slug
  const productId = parseInt(slug.split('-').pop())

  // Simulate API call
  setTimeout(() => {
    product.value = allProducts.find((p) => p.id === productId)
    if (product.value) {
      slide.value = 0
    }
    loading.value = false
  }, 500)
}

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-page img {
  height: 100vh;
}

/* Custom scrollbar for right panel */
.product-detail-page :deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 8px;
}

.product-detail-page :deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.product-detail-page :deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.product-detail-page :deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
