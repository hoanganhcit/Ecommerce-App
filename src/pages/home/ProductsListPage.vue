<template>
  <q-page class="py-20">
    <div class="mx-auto px-8 py-8">
      <!-- Categories Tabs -->
      <div class="mb-8">
        <q-tabs
          v-model="selectedCategory"
          dense
          class="text-grey-8"
          active-color="gray-900"
          indicator-color="gray-900"
          align="center"
          narrow-indicator
        >
          <q-tab
            v-for="category in categories"
            :key="category.id"
            :name="category.id"
            :label="category.name"
            class="text-base font-medium"
          />
        </q-tabs>
      </div>

      <!-- Products Grid -->
      <div
        v-if="loading && currentProducts.length === 0"
        class="flex justify-center items-center py-20"
      >
        <q-spinner color="gray-900" size="50px" />
      </div>

      <div v-else>
        <q-tab-panels v-model="selectedCategory" animated>
          <q-tab-panel
            v-for="category in categories"
            :key="category.id"
            :name="category.id"
            class="p-0"
          >
            <!-- Products List Component -->
            <ProductsList
              :products="currentProducts"
              @product-click="goToProductDetail"
              @add-to-cart="addToCart"
              @toggle-favorite="toggleFavorite"
            />

            <!-- No Products Message -->
            <div v-if="currentProducts.length === 0 && !loading" class="text-center py-20">
              <q-icon name="inventory_2" size="80px" color="grey-5" />
              <p class="text-gray-500 mt-4 text-lg">Không có sản phẩm nào trong danh mục này</p>
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
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import ProductsList from 'src/components/home/ProductsList.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

// State
const selectedCategory = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const displayedCount = ref(12)

// Categories
const categories = ref([
  { id: 0, name: 'Tất cả sản phẩm', slug: 'all' },
  { id: 1, name: 'Thời trang Nam', slug: 'men' },
  { id: 2, name: 'Thời trang Nữ', slug: 'women' },
  { id: 3, name: 'Phụ kiện', slug: 'accessories' },
  { id: 4, name: 'Giày dép', slug: 'shoes' },
  { id: 5, name: 'Túi xách', slug: 'bags' },
])

// Mock products data - Replace with API call
const allProducts = ref([
  {
    id: 1,
    name: 'Áo sơ mi nam cao cấp',
    description: 'Áo sơ mi nam chất liệu cotton 100%, thoáng mát',
    price: 450000,
    originalPrice: 650000,
    discount: 30,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 1, // Thời trang Nam
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Váy đầm nữ thanh lịch',
    description: 'Váy đầm nữ thiết kế hiện đại, phù hợp đi làm',
    price: 580000,
    originalPrice: 780000,
    discount: 25,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 2, // Thời trang Nữ
    rating: 4.8,
    reviews: 95,
  },
  {
    id: 3,
    name: 'Túi xách da cao cấp',
    description: 'Túi xách da thật, thiết kế sang trọng',
    price: 1200000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 5, // Túi xách
    rating: 4.7,
    reviews: 64,
  },
  {
    id: 4,
    name: 'Giày thể thao nam',
    description: 'Giày thể thao êm ái, phù hợp chơi thể thao',
    price: 890000,
    originalPrice: 1200000,
    discount: 26,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 4, // Giày dép
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 5,
    name: 'Đồng hồ thời trang',
    description: 'Đồng hồ thời trang cao cấp, chống nước',
    price: 2500000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 3, // Phụ kiện
    rating: 4.9,
    reviews: 87,
  },
  {
    id: 6,
    name: 'Quần jeans nam',
    description: 'Quần jeans nam co giãn, form dáng hiện đại',
    price: 520000,
    originalPrice: 720000,
    discount: 28,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 1, // Thời trang Nam
    rating: 4.4,
    reviews: 112,
  },
  {
    id: 7,
    name: 'Áo thun nữ',
    description: 'Áo thun nữ cotton cao cấp, nhiều màu sắc',
    price: 280000,
    originalPrice: 380000,
    discount: 26,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 2, // Thời trang Nữ
    rating: 4.3,
    reviews: 203,
  },
  {
    id: 8,
    name: 'Kính mát thời trang',
    description: 'Kính mát chống UV, thiết kế trendy',
    price: 450000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 3, // Phụ kiện
    rating: 4.5,
    reviews: 73,
  },
  {
    id: 9,
    name: 'Giày cao gót nữ',
    description: 'Giày cao gót nữ thanh lịch, êm chân',
    price: 680000,
    originalPrice: 890000,
    discount: 24,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 4, // Giày dép
    rating: 4.7,
    reviews: 91,
  },
  {
    id: 10,
    name: 'Balo da cao cấp',
    description: 'Balo da thật, nhiều ngăn tiện dụng',
    price: 980000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 5, // Túi xách
    rating: 4.8,
    reviews: 58,
  },
  {
    id: 11,
    name: 'Áo khoác nam',
    description: 'Áo khoác nam mùa đông, ấm áp',
    price: 850000,
    originalPrice: 1150000,
    discount: 26,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 1, // Thời trang Nam
    rating: 4.6,
    reviews: 142,
  },
  {
    id: 12,
    name: 'Chân váy nữ',
    description: 'Chân váy nữ công sở, dễ phối đồ',
    price: 380000,
    originalPrice: 480000,
    discount: 21,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 2, // Thời trang Nữ
    rating: 4.4,
    reviews: 167,
  },
  {
    id: 13,
    name: 'Thắt lưng da nam',
    description: 'Thắt lưng da thật, khóa kim loại cao cấp',
    price: 420000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 3, // Phụ kiện
    rating: 4.5,
    reviews: 81,
  },
  {
    id: 14,
    name: 'Sandal nữ thời trang',
    description: 'Sandal nữ êm chân, phù hợp mùa hè',
    price: 320000,
    originalPrice: 420000,
    discount: 24,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 4, // Giày dép
    rating: 4.3,
    reviews: 124,
  },
  {
    id: 15,
    name: 'Clutch sang trọng',
    description: 'Clutch dự tiệc, thiết kế sang trọng',
    price: 560000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 5, // Túi xách
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 16,
    name: 'Quần short nam',
    description: 'Quần short nam thể thao, thoải mái',
    price: 280000,
    originalPrice: 380000,
    discount: 26,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 1, // Thời trang Nam
    rating: 4.4,
    reviews: 198,
  },
  {
    id: 17,
    name: 'Blazer nữ công sở',
    description: 'Blazer nữ thanh lịch, phù hợp công sở',
    price: 720000,
    originalPrice: 950000,
    discount: 24,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 2, // Thời trang Nữ
    rating: 4.8,
    reviews: 76,
  },
  {
    id: 18,
    name: 'Nhẫn bạc cao cấp',
    description: 'Nhẫn bạc 925, thiết kế tinh xảo',
    price: 650000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 3, // Phụ kiện
    rating: 4.9,
    reviews: 52,
  },
  {
    id: 19,
    name: 'Giày boot nữ',
    description: 'Giày boot nữ cổ cao, phong cách Hàn Quốc',
    price: 890000,
    originalPrice: 1190000,
    discount: 25,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 4, // Giày dép
    rating: 4.7,
    reviews: 103,
  },
  {
    id: 20,
    name: 'Ví cầm tay nam',
    description: 'Ví cầm tay nam da thật, nhiều ngăn',
    price: 480000,
    originalPrice: null,
    discount: null,
    image: '/product-1.png',
    imageHover: '/product-2.png',
    category: 5, // Túi xách
    rating: 4.6,
    reviews: 89,
  },
])

// Computed
const filteredProducts = computed(() => {
  if (selectedCategory.value === 0) {
    return allProducts.value
  }
  return allProducts.value.filter((product) => product.category === selectedCategory.value)
})

const currentProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredProducts.value.length
})

// Methods
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
  const slug = createSlug(product.name)
  router.push(`/product/${slug}-${product.id}`)
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
  // Show success notification
  $q.notify({
    message: `Đã thêm "${product.name}" vào giỏ hàng`,
    color: 'positive',
    icon: 'check_circle',
    position: 'top-right',
  })
}

const toggleFavorite = (product) => {
  $q.notify({
    message: `Đã thêm "${product.name}" vào danh sách yêu thích`,
    color: 'pink',
    icon: 'favorite',
    position: 'top-right',
  })
}

// Helper function to find category by slug
const getCategoryBySlug = (slug) => {
  return categories.value.find((cat) => cat.slug === slug)
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

// Watch category changes to reset displayed count
watch(selectedCategory, () => {
  displayedCount.value = 12
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

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
