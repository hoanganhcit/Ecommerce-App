<template>
  <q-page class="py-20">
    <div class="mx-auto px-4 sm:px-8 py-8">
      <!-- 2 Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Sidebar - Filters -->
        <ProductFilter
          :categories="categories"
          v-model:selectedCategory="selectedCategory"
          v-model:priceRange="priceRange"
          :minPrice="minPrice"
          :maxPrice="maxPrice"
          :selectedSizes="selectedSizes"
          :selectedColors="selectedColors"
          :selectedCollections="selectedCollections"
          :availableSizes="availableSizes"
          :availableColors="availableColors"
          :collections="collections"
          :formatPrice="formatPrice"
          :isLoading="isLoadingData"
          @toggle-size="toggleSize"
          @toggle-color="toggleColor"
          @toggle-collection="toggleCollection"
          @clear-filters="clearFilters"
        />

        <!-- Right Content - Products -->
        <main class="lg:col-span-9 space-y-4">
          <!-- Active Filters Summary -->
          <div v-if="hasActiveFilters" class="bg-gray-50 rounded-lg p-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-gray-600 font-medium">Đang lọc:</span>
              <q-chip
                v-for="size in selectedSizes"
                :key="`size-${size}`"
                removable
                color="gray-900"
                text-color="white"
                size="sm"
                @remove="toggleSize(size)"
              >
                Size: {{ size }}
              </q-chip>
              <q-chip
                v-for="color in selectedColors"
                :key="`color-${color}`"
                removable
                color="gray-900"
                text-color="white"
                size="sm"
                @remove="toggleColor(color)"
              >
                Màu: {{ color }}
              </q-chip>
              <q-chip
                v-for="collectionId in selectedCollections"
                :key="`collection-${collectionId}`"
                removable
                color="gray-900"
                text-color="white"
                size="sm"
                @remove="removeCollection(collectionId)"
              >
                {{ getCollectionName(collectionId) }}
              </q-chip>
              <q-chip
                v-if="priceRange.min !== minPrice || priceRange.max !== maxPrice"
                removable
                color="gray-900"
                text-color="white"
                size="sm"
                @remove="resetPriceRange"
              >
                {{ formatPrice(priceRange.min) }} - {{ formatPrice(priceRange.max) }}
              </q-chip>
            </div>
          </div>

          <!-- Result Count -->
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Tìm thấy <strong class="text-gray-900">{{ filteredProducts.length }}</strong> sản phẩm
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="isLoadingData && currentProducts.length === 0">
            <ProductsList :products="[]" :isLoading="true" />
          </div>

          <div v-else>
            <!-- Products List Component -->
            <ProductsList
              :products="currentProducts"
              :isLoading="false"
              @product-click="goToProductDetail"
              @add-to-cart="addToCart"
              @toggle-favorite="toggleFavorite"
            />

            <!-- No Products Message -->
            <div v-if="currentProducts.length === 0 && !loading" class="text-center py-20">
              <q-icon name="inventory_2" size="80px" color="grey-5" />
              <p class="text-gray-500 mt-4 text-lg">Không có sản phẩm nào phù hợp với bộ lọc</p>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore && currentProducts.length > 0" class="flex justify-center mt-8">
              <q-btn
                outline
                color="gray-900"
                label="Xem thêm sản phẩm"
                icon-right="expand_more"
                size="md"
                class="px-8"
                no-caps
                :loading="loadingMore"
                @click="loadMore"
              />
            </div>

            <!-- End Message -->
            <div
              v-if="!hasMore && currentProducts.length > 0"
              class="text-center mt-8 text-gray-500"
            >
              <p>Đã hiển thị tất cả sản phẩm</p>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Cart Drawer -->
    <CartDrawer />
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import ProductFilter from 'src/components/home/ProductFilter.vue'
import ProductsList from 'src/components/home/ProductsList.vue'
import CartDrawer from 'src/components/home/CartDrawer.vue'
import { useStoreData } from 'src/composables/useStoreData'
import { useCartStore } from 'src/stores/useCartStore'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const {
  categories,
  products,
  collections: allCollections,
  getCategoryBySlug,
  formatPrice,
  isLoading: isLoadingData,
} = useStoreData()

const { addToCart: addToCartStore } = useCartStore()

// State
const selectedCategory = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const displayedCount = ref(12)

// Filter states
const priceRange = ref({ min: 0, max: 10000000 })
const userHasChangedPrice = ref(false)
const isInitialLoad = ref(true)
const selectedSizes = ref([])
const selectedColors = ref([])
const selectedCollections = ref([])

// All products from composable
const allProducts = products

// Calculate min and max price from all products
const minPrice = computed(() => {
  if (allProducts.value.length === 0) return 0
  const prices = allProducts.value.map((p) => p.price)
  return Math.floor(Math.min(...prices) / 50000) * 50000
})

const maxPrice = computed(() => {
  if (allProducts.value.length === 0) return 10000000
  const prices = allProducts.value.map((p) => p.price)
  return Math.ceil(Math.max(...prices) / 50000) * 50000
})

// Get all available sizes from products (cached)
const availableSizes = computed(() => {
  if (allProducts.value.length === 0) return []
  const sizes = new Set()
  for (const product of allProducts.value) {
    if (product.sizes) {
      for (const size of product.sizes) {
        sizes.add(size)
      }
    }
  }
  return [...sizes]
})

// Get all available colors from products (cached)
const availableColors = computed(() => {
  if (allProducts.value.length === 0) return []
  const colorsMap = new Map()
  for (const product of allProducts.value) {
    if (product.colors) {
      for (const color of product.colors) {
        if (!colorsMap.has(color.hex)) {
          colorsMap.set(color.hex, {
            name: color.name,
            value: color.hex,
          })
        }
      }
    }
  }
  return [...colorsMap.values()]
})

// Collections for select
const collections = computed(() => allCollections.value)

// Check if any filter is active
const hasActiveFilters = computed(() => {
  const isPriceChanged =
    userHasChangedPrice.value &&
    (priceRange.value.min !== minPrice.value || priceRange.value.max !== maxPrice.value)

  return (
    selectedSizes.value.length > 0 ||
    selectedColors.value.length > 0 ||
    selectedCollections.value.length > 0 ||
    isPriceChanged
  )
})

// Computed - Optimized filtering
const filteredProducts = computed(() => {
  let products = allProducts.value

  // Early return if no products
  if (products.length === 0) return []

  // Filter by category
  if (selectedCategory.value !== 0) {
    products = products.filter((product) => product.category === selectedCategory.value)
  }

  // Filter by price range - only if user has manually changed it
  if (userHasChangedPrice.value) {
    const minP = priceRange.value.min
    const maxP = priceRange.value.max
    products = products.filter((product) => product.price >= minP && product.price <= maxP)
  }

  // Filter by size - use Set for O(1) lookup
  if (selectedSizes.value.length > 0) {
    const sizeSet = new Set(selectedSizes.value)
    products = products.filter((product) => product.sizes?.some((size) => sizeSet.has(size)))
  }

  // Filter by color - use Set for O(1) lookup
  if (selectedColors.value.length > 0) {
    const colorSet = new Set(selectedColors.value)
    products = products.filter((product) =>
      product.colors?.some((color) => colorSet.has(color.name)),
    )
  }

  // Filter by collection - use Set for O(1) lookup
  if (selectedCollections.value.length > 0) {
    const collectionSet = new Set(selectedCollections.value)
    products = products.filter((product) =>
      product.collections?.some((collection) => collectionSet.has(collection)),
    )
  }

  return products
})

const currentProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredProducts.value.length
})

// Methods
const toggleSize = (size) => {
  const index = selectedSizes.value.indexOf(size)
  if (index > -1) {
    selectedSizes.value.splice(index, 1)
  } else {
    selectedSizes.value.push(size)
  }
  displayedCount.value = 12
}

const toggleColor = (color) => {
  const index = selectedColors.value.indexOf(color)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(color)
  }
  displayedCount.value = 12
}

const toggleCollection = (collectionId) => {
  const index = selectedCollections.value.indexOf(collectionId)
  if (index > -1) {
    selectedCollections.value.splice(index, 1)
  } else {
    selectedCollections.value.push(collectionId)
  }
  displayedCount.value = 12
}

const removeCollection = (collectionId) => {
  const index = selectedCollections.value.indexOf(collectionId)
  if (index > -1) {
    selectedCollections.value.splice(index, 1)
  }
  displayedCount.value = 12
}

const resetPriceRange = () => {
  userHasChangedPrice.value = false
  priceRange.value = { min: minPrice.value, max: maxPrice.value }
  displayedCount.value = 12
}

const clearFilters = () => {
  selectedSizes.value = []
  selectedColors.value = []
  selectedCollections.value = []
  userHasChangedPrice.value = false
  priceRange.value = { min: minPrice.value, max: maxPrice.value }
  displayedCount.value = 12
}

const getCollectionName = (collectionId) => {
  const collection = collections.value.find((c) => c.id === collectionId)
  return collection ? collection.name : ''
}

const createSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim()
}

const goToProductDetail = (product) => {
  // Use slug from backend if available, otherwise create one
  const slug = product.slug || createSlug(product.name)
  router.push(`/product/${slug}`)
}

const loadMore = () => {
  loadingMore.value = true
  // Simulate API call
  setTimeout(() => {
    displayedCount.value += 8
    loadingMore.value = false
  }, 500)
}

const addToCart = (product) => {
  // Add to cart store
  addToCartStore(product)

  // Show success notification
  $q.notify({
    message: `Đã thêm "${product.name}" vào giỏ hàng`,
    color: 'positive',
    icon: 'check_circle',
    position: 'top-right',
  })
}

// Watch for products load - update price range to match actual products
watch(
  () => allProducts.value.length,
  (newLength) => {
    if (newLength > 0) {
      console.log('Products loaded:', newLength)

      // Update price range to match actual product prices WITHOUT triggering filter
      // This must happen BEFORE isInitialLoad becomes false
      priceRange.value = {
        min: minPrice.value,
        max: maxPrice.value,
      }

      // Mark initial load as complete after price range is set
      setTimeout(() => {
        isInitialLoad.value = false
      }, 100)
    }
  },
  { immediate: true },
)

// Watch for price range changes by user - ignore initial load
watch(
  priceRange,
  (newVal, oldVal) => {
    // Only set flag if not initial load and values actually changed
    if (
      !isInitialLoad.value &&
      oldVal &&
      (newVal.min !== oldVal.min || newVal.max !== oldVal.max)
    ) {
      userHasChangedPrice.value = true
    }
  },
  { deep: true },
)

const toggleFavorite = (product) => {
  $q.notify({
    message: `Đã thêm "${product.name}" vào danh sách yêu thích`,
    color: 'pink',
    icon: 'favorite',
    position: 'top-right',
  })
}

// Helper function to get slug by id
const getSlugById = (id) => {
  const category = categories.value.find((cat) => cat.id === id)
  return category ? category.slug : 'all'
}

// Watch route params to update category
watch(
  () => route.params.category,
  (categorySlug) => {
    if (categorySlug) {
      const category = getCategoryBySlug(categorySlug)
      selectedCategory.value = category ? category.id : 0
    } else {
      selectedCategory.value = 0
    }
  },
  { immediate: true },
)

// Watch category changes to reset displayed count and filters
watch(selectedCategory, () => {
  displayedCount.value = 12
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Watch price changes to reset displayed count
watch([priceRange, selectedSizes, selectedColors, selectedCollections], () => {
  displayedCount.value = 12
})

// Initialize price range
watch(
  [minPrice, maxPrice],
  () => {
    if (priceRange.value.min === 0 && priceRange.value.max === 5000000) {
      priceRange.value = { min: minPrice.value, max: maxPrice.value }
    }
  },
  { immediate: true },
)

// Watch category tab change to update URL
watch(selectedCategory, (newCategoryId) => {
  const slug = getSlugById(newCategoryId)

  if (newCategoryId === 0) {
    if (route.path !== '/shop') {
      router.push('/shop')
    }
  } else {
    if (route.params.category !== slug) {
      router.push(`/shop/${slug}`)
    }
  }
})
</script>

<style scoped></style>
