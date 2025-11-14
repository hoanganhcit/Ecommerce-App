<template>
  <!-- Skeleton Loading -->
  <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
    <div
      v-for="i in 12"
      :key="i"
      class="bg-white rounded-lg overflow-hidden border border-gray-200"
    >
      <q-skeleton height="300px" square />
      <div class="p-4 space-y-3">
        <q-skeleton type="text" width="60%" />
        <q-skeleton type="text" width="40%" />
        <div class="flex items-center justify-between">
          <q-skeleton type="text" width="30%" />
          <q-skeleton type="circle" size="24px" />
        </div>
      </div>
    </div>
  </div>

  <!-- Products Grid -->
  <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
    <div v-for="product in products" :key="product.id" class="product-card bg-white">
      <!-- Product Image -->
      <div
        class="relative overflow-hidden group product-image-wrapper cursor-pointer"
        @click="handleProductClick(product)"
      >
        <!-- Main Image -->
        <img
          :src="product.image"
          :alt="product.name"
          class="product-image product-image-main w-full object-cover absolute inset-0"
        />

        <!-- Hover Image -->
        <img
          v-if="product.imageHover"
          :src="product.imageHover"
          :alt="`${product.name} - hover`"
          class="product-image product-image-hover w-full object-cover absolute inset-0 opacity-0"
        />

        <!-- Discount Badge -->
        <div
          v-if="product.discount"
          class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10"
        >
          -{{ product.discount }}%
        </div>

        <!-- Add to Cart Button - Center of Image -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
        >
          <button
            @click.stop="handleAddToCart(product)"
            :disabled="addingToCart === product.id"
            class="add-to-cart-btn bg-black text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:!bg-gray-800 transition-all duration-300"
          >
            <i
              :class="[
                addingToCart === product.id ? 'fal fa-spinner spin' : 'fal fa-shopping-cart',
              ]"
            ></i>
            {{ addingToCart === product.id ? 'Đang thêm ...' : 'Thêm vào giỏ hàng' }}
          </button>
        </div>

        <!-- Favorite Button - Top Left on Hover -->
        <div
          class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
        >
          <button class="no-shadow" @click.stop="handleToggleFavorite(product)">
            <i class="fal fa-heart text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <div
          class="text-sm font-semibold text-uppercase mb-2 cursor-pointer hover:text-primary text-center transition-colors"
          @click="handleProductClick(product)"
        >
          {{ product.name }}
        </div>

        <!-- Price -->
        <div class="flex items-center justify-center gap-2">
          <span class="text-sm font-bold text-gray-900">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Add Modal -->
  <q-dialog v-model="showQuickAdd" :maximized="false">
    <q-card class="quick-add-card" style="min-width: 500px; max-width: 600px">
      <q-card-section class="row items-center border-b border-gray-200">
        <div class="text-h6 font-bold">Tùy chọn sản phẩm</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="selectedProduct" class="q-pt-md">
        <!-- Product Preview -->
        <div class="flex gap-4 mb-6 pb-6 border-b border-gray-200">
          <img
            :src="selectedProduct.images[0]"
            :alt="selectedProduct.name"
            class="w-24 h-24 object-cover rounded-lg"
          />
          <div class="flex-1">
            <div class="text-base font-bold text-gray-900 mb-2">
              {{ selectedProduct.name }}
            </div>
            <div class="text-lg font-bold text-gray-900">
              {{ formatPrice(selectedProduct.price) }}
            </div>
          </div>
        </div>

        <!-- Size Selection -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-3">
            Kích thước <span class="text-red-500">*</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              @click="availableSizesForColor.has(size) && (selectedSize = size)"
              :disabled="!availableSizesForColor.has(size)"
              :class="[
                'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all',
                selectedSize === size
                  ? 'border-gray-900 bg-gray-900 text-white'
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
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-3">
            Màu sắc <span class="text-red-500">*</span>
          </label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in availableColorsForSize"
              :key="color.name"
              @click="color.available && (selectedColor = color.name)"
              :disabled="!color.available"
              class="flex flex-col items-center gap-2"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full border-2 transition-all relative',
                  selectedColor === color.name
                    ? 'border-gray-900 scale-110'
                    : color.available
                      ? 'border-gray-200 hover:border-gray-400'
                      : 'border-gray-200 opacity-40',
                  !color.available && 'cursor-not-allowed',
                ]"
                :style="{ backgroundColor: color.value }"
              >
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

        <!-- Quantity Selection -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-3">Số lượng</label>
          <div class="flex items-center gap-4">
            <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
              <button
                @click="decreaseQuantity"
                class="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
              >
                <i class="fal fa-minus"></i>
              </button>
              <div class="w-16 h-8 flex items-center justify-center text-base font-bold bg-white">
                {{ quantity }}
              </div>
              <button
                @click="increaseQuantity"
                class="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
              >
                <i class="fal fa-plus"></i>
              </button>
            </div>
            <span v-if="selectedVariantStock !== null" class="text-sm text-gray-600">
              Còn {{ selectedVariantStock }} sản phẩm
            </span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="q-px-md q-pb-md border-t border-gray-200">
        <q-btn
          flat
          label="Hủy"
          color="grey-7"
          v-close-popup
          class="flex-1 !rounded-2xl"
          no-caps
          size="md"
        />
        <q-btn
          label="Thêm vào giỏ hàng"
          color="grey-10"
          @click="confirmAddToCart"
          :loading="isAdding"
          :disable="!selectedSize || !selectedColor"
          class="flex-1 !rounded-2xl"
          no-caps
          size="md"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCartStore } from 'src/stores/useCartStore'
import { useQuasar } from 'quasar'

// Props
defineProps({
  products: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['product-click', 'add-to-cart', 'toggle-favorite'])

const $q = useQuasar()
const cartStore = useCartStore()

// State
const addingToCart = ref(null)
const showQuickAdd = ref(false)
const selectedProduct = ref(null)
const selectedSize = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)
const isAdding = ref(false)

// Computed
const availableSizes = computed(() => {
  if (!selectedProduct.value) return []
  // Get sizes directly from product.sizes array
  return selectedProduct.value.sizes || []
})

const availableColors = computed(() => {
  if (!selectedProduct.value) return []
  // Get colors from product.colors array and format them
  return (selectedProduct.value.colors || []).map((color) => ({
    name: color.name,
    value: color.hex,
  }))
})

// Get available sizes for selected color (all sizes available in new model)
const availableSizesForColor = computed(() => {
  return new Set(availableSizes.value)
})

// Get available colors for selected size (all colors available in new model)
const availableColorsForSize = computed(() => {
  return availableColors.value.map((color) => ({
    ...color,
    available: true,
  }))
})

const selectedVariantStock = computed(() => {
  if (!selectedProduct.value) return null
  // Use product total stock in new model
  return selectedProduct.value.stock || 0
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const handleProductClick = (product) => {
  emit('product-click', product)
}

const handleAddToCart = (product) => {
  selectedProduct.value = product
  selectedSize.value = null
  selectedColor.value = null
  quantity.value = 1
  showQuickAdd.value = true
}

const handleToggleFavorite = (product) => {
  emit('toggle-favorite', product)
}

// Watch for selection changes to validate combinations
watch([selectedSize, selectedColor], () => {
  if (selectedSize.value && selectedColor.value && selectedProduct.value) {
    // In new model, all size/color combinations are valid if product has stock
    if (selectedProduct.value.stock <= 0) {
      $q.notify({
        message: 'Sản phẩm hiện đã hết hàng',
        color: 'warning',
        icon: 'warning',
        position: 'top-right',
      })
    }
  }
})

const increaseQuantity = () => {
  if (selectedVariantStock.value && quantity.value < selectedVariantStock.value) {
    quantity.value++
  } else if (!selectedVariantStock.value) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const confirmAddToCart = () => {
  if (!selectedSize.value || !selectedColor.value) {
    $q.notify({
      message: 'Vui lòng chọn kích thước và màu sắc',
      color: 'warning',
      icon: 'warning',
      position: 'top-right',
    })
    return
  }

  // Check stock availability
  if (selectedProduct.value.stock < quantity.value) {
    $q.notify({
      message: `Chỉ còn ${selectedProduct.value.stock} sản phẩm trong kho`,
      color: 'warning',
      icon: 'warning',
      position: 'top-right',
    })
    return
  }

  isAdding.value = true

  setTimeout(() => {
    // Create variant object for cart (new model)
    const variant = {
      size: selectedSize.value,
      color: selectedColor.value,
      colorCode:
        availableColors.value.find((c) => c.name === selectedColor.value)?.value || '#000000',
    }

    // Add to cart store
    cartStore.addToCart(selectedProduct.value, variant, quantity.value)

    // Show success notification
    $q.notify({
      message: `Đã thêm ${quantity.value} sản phẩm vào giỏ hàng`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right',
    })

    // Close modal
    showQuickAdd.value = false
    isAdding.value = false

    // Reset
    selectedProduct.value = null
    selectedSize.value = null
    selectedColor.value = null
    quantity.value = 1
  }, 500)
}
</script>

<style scoped></style>
