<template>
  <q-page class="product-detail-page bg-white">
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

    <!-- Product Detail -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <!-- 1. Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center gap-2 text-sm">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-gray-900 transition-colors">
              Trang chủ
            </router-link>
          </li>
          <li class="text-gray-400">
            <i class="fal fa-chevron-right text-xs"></i>
          </li>
          <li>
            <router-link to="/shop" class="text-gray-500 hover:text-gray-900 transition-colors">
              Sản phẩm
            </router-link>
          </li>
          <li class="text-gray-400">
            <i class="fal fa-chevron-right text-xs"></i>
          </li>
          <li class="text-gray-900 font-medium">{{ product.name }}</li>
        </ol>
      </nav>

      <!-- 2. Product Section - 2 Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <!-- Left: Images Grid (2 columns) -->
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(img, index) in productImages"
            :key="index"
            class="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            @click="openImageModal(index)"
          >
            <img
              :src="img"
              :alt="`${product.name} ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Right: Product Info (Sticky) -->
        <div class="lg:sticky lg:top-24 lg:self-start">
          <div class="space-y-6">
            <!-- Title -->
            <div class="text-xl text-uppercase font-bold text-gray-900 mb-2">
              {{ product.name }}
            </div>

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
            <div class="mb-4">
              <p class="text-gray-600 text-sm leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Size Selection -->
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-900 mb-3 uppercase">Kích thước</label>
              <div class="flex gap-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="availableSizesForColor.has(size) && (selectedSize = size)"
                  :disabled="!availableSizesForColor.has(size)"
                  :class="[
                    'px-3 text-sm py-1 border-1 rounded font-semibold transition-all',
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : availableSizesForColor.has(size)
                        ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50',
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Color Selection -->
            <div class="mb-4">
              <label class="block text-sm font-bold text-gray-900 mb-3 uppercase">Màu sắc</label>
              <div class="flex gap-3">
                <button
                  v-for="color in availableColorsForSize"
                  :key="color.name"
                  @click="color.available && (selectedColor = color.name)"
                  :disabled="!color.available"
                  class="flex flex-col items-center gap-1"
                >
                  <div
                    :class="[
                      'w-8 h-8 rounded-full border-2 transition-all relative',
                      selectedColor === color.name
                        ? 'border-black scale-110'
                        : color.available
                          ? 'border-gray-200 hover:border-gray-400'
                          : 'border-gray-200 opacity-40',
                      !color.available && 'cursor-not-allowed',
                    ]"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                  >
                    <!-- X mark for unavailable colors -->
                    <div
                      v-if="!color.available"
                      class="absolute inset-0 flex items-center justify-center"
                    ></div>
                  </div>
                  <span :class="['text-xs', color.available ? 'text-gray-600' : 'text-gray-400']">
                    {{ color.name }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="space-y-4">
              <!-- Quantity -->
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-3 uppercase">Số lượng</label>
                <div class="flex items-center gap-4">
                  <div
                    class="flex items-center border-1 border-gray-300 rounded-lg overflow-hidden"
                  >
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
                  <span class="text-sm text-gray-600"
                    >Còn {{ availableStock || product.stock || 99 }} sản phẩm</span
                  >
                </div>
              </div>
              <!-- Add to Cart Button -->
              <button
                @click="addToCart"
                :disabled="isAddingToCart || !selectedSize || !selectedColor"
                class="w-full bg-black text-white py-5 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i
                  :class="[
                    'text-xl',
                    isAddingToCart ? 'fal fa-spinner-third fa-spin' : 'fal fa-shopping-cart',
                  ]"
                ></i>
                {{ isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
              </button>
            </div>

            <!-- Additional Info -->
            <div class="border-t pt-6 space-y-4">
              <div class="flex items-center gap-3 text-gray-600 text-sm">
                <i class="fal fa-truck text-lg"></i>
                <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
              </div>
              <div class="flex items-center gap-3 text-gray-600 text-sm">
                <i class="fal fa-undo text-lg"></i>
                <span>Đổi trả trong vòng 30 ngày</span>
              </div>
              <div class="flex items-center gap-3 text-gray-600 text-sm">
                <i class="fal fa-shield-check text-lg"></i>
                <span>Bảo hành chính hãng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Related Products Section -->
      <div v-if="relatedProducts.length > 0" class="mt-16 border-t pt-12">
        <div class="text-2xl font-bold text-gray-900 mb-8">Những sản phẩm có thể bạn sẽ thích</div>
        <ProductsList :products="relatedProducts" @product-click="goToProduct" />
      </div>
    </div>

    <!-- Image Modal -->
    <q-dialog v-model="showImageModal">
      <q-card class="bg-transparent shadow-none" style="max-width: 90vw">
        <q-carousel
          v-model="currentImageIndex"
          animated
          infinite
          control-color="white"
          class="bg-black rounded-lg"
          height="80vh"
        >
          <q-carousel-slide
            v-for="(img, index) in productImages"
            :key="index"
            :name="index"
            class="flex items-center justify-center p-0"
          >
            <img
              :src="img"
              :alt="`${product.name} ${index + 1}`"
              class="max-w-full max-h-full object-contain"
            />
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStoreData } from 'src/composables/useStoreData'
import { useCartStore } from 'src/stores/useCartStore'
import ProductsList from 'src/components/home/ProductsList.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { products } = useStoreData()
const cartStore = useCartStore()

// State
const loading = ref(true)
const product = ref(null)
const quantity = ref(1)
const selectedSize = ref(null)
const selectedColor = ref(null)
const isAddingToCart = ref(false)
const showImageModal = ref(false)
const currentImageIndex = ref(0)
// Variations - Computed from product data
const sizes = computed(() => {
  if (!product.value?.variants) return []
  return [...new Set(product.value.variants.map((v) => v.size))]
})

const colors = computed(() => {
  if (!product.value?.variants) return []
  return [
    ...new Map(
      product.value.variants.map((v) => [v.color, { name: v.color, value: v.colorCode }]),
    ).values(),
  ]
})

// Get available sizes for selected color
const availableSizesForColor = computed(() => {
  if (!product.value || !selectedColor.value) return new Set(sizes.value)

  const availableSizes = new Set()
  product.value.variants?.forEach((variant) => {
    if (variant.color === selectedColor.value && variant.stock > 0) {
      availableSizes.add(variant.size)
    }
  })
  return availableSizes
})

// Get available colors for selected size
const availableColorsForSize = computed(() => {
  if (!product.value || !selectedSize.value) {
    // If no size selected, show all colors but mark which are available
    return colors.value.map((color) => ({
      ...color,
      available:
        product.value?.variants?.some((v) => v.color === color.name && v.stock > 0) || false,
    }))
  }

  const availableColorNames = new Set()
  product.value.variants?.forEach((variant) => {
    if (variant.size === selectedSize.value && variant.stock > 0) {
      availableColorNames.add(variant.color)
    }
  })

  return colors.value.map((color) => ({
    ...color,
    available: availableColorNames.has(color.name),
  }))
})

// Selected variant
const selectedVariant = computed(() => {
  if (!product.value?.variants || !selectedSize.value || !selectedColor.value) return null
  return product.value.variants.find(
    (v) => v.size === selectedSize.value && v.color === selectedColor.value,
  )
})

// Available stock for selected variant
const availableStock = computed(() => {
  return selectedVariant.value?.stock || 0
})

// Computed
const productImages = computed(() => {
  if (!product.value) return []
  // Use product images from JSON
  return product.value.images || []
})

// Related products - same category, exclude current product
const relatedProducts = computed(() => {
  if (!product.value) return []
  return products.value
    .filter((p) => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const increaseQuantity = () => {
  const maxStock = availableStock.value || 99
  if (quantity.value < maxStock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const openImageModal = (index) => {
  currentImageIndex.value = index
  showImageModal.value = true
}

const goToProduct = (prod) => {
  const slug = `${prod.name.toLowerCase().replace(/\s+/g, '-')}-${prod.id}`
  router.push(`/shop/product/${slug}`)
  // Scroll to top after navigation
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const addToCart = () => {
  // Validation
  if (!selectedSize.value) {
    $q.notify({
      message: 'Vui lòng chọn kích thước',
      color: 'warning',
      icon: 'warning',
      position: 'top-right',
    })
    return
  }

  if (!selectedColor.value) {
    $q.notify({
      message: 'Vui lòng chọn màu sắc',
      color: 'warning',
      icon: 'warning',
      position: 'top-right',
    })
    return
  }

  if (!selectedVariant.value) {
    $q.notify({
      message: 'Biến thể không tồn tại',
      color: 'negative',
      icon: 'error',
      position: 'top-right',
    })
    return
  }

  if (selectedVariant.value.stock < quantity.value) {
    $q.notify({
      message: 'Số lượng vượt quá tồn kho',
      color: 'warning',
      icon: 'warning',
      position: 'top-right',
    })
    return
  }

  // Add to cart
  isAddingToCart.value = true

  setTimeout(() => {
    cartStore.addToCart(product.value, selectedVariant.value, quantity.value)

    $q.notify({
      message: `Đã thêm "${product.value.name}" vào giỏ hàng`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right',
    })

    isAddingToCart.value = false
  }, 100)
}

const loadProduct = () => {
  loading.value = true

  // Extract product ID from slug (format: slug-name-123)
  const slug = route.params.slug
  const productId = parseInt(slug.split('-').pop())

  // Simulate API call
  setTimeout(() => {
    product.value = products.value.find((p) => p.id === productId)

    if (product.value) {
      // Set default selections to first available variant
      const firstVariant = product.value.variants?.[0]
      if (firstVariant) {
        selectedSize.value = firstVariant.size
        selectedColor.value = firstVariant.color
      }
    }

    loading.value = false
  }, 500)
}

// Watch for selection changes to validate combinations
watch([selectedSize, selectedColor], () => {
  if (selectedSize.value && selectedColor.value && product.value) {
    const isValidCombination = product.value.variants?.some(
      (v) => v.size === selectedSize.value && v.color === selectedColor.value && v.stock > 0,
    )
    if (!isValidCombination) {
      $q.notify({
        message: 'Kết hợp size và màu này không có sẵn',
        color: 'warning',
        icon: 'warning',
        position: 'top-right',
      })
    }
  }
})

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
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
