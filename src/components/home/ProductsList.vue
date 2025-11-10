<template>
  <!-- Products Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <div v-for="product in products" :key="product.id" class="product-card bg-white">
      <!-- Product Image -->
      <div
        class="relative overflow-hidden group product-image-wrapper h-98 cursor-pointer"
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
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  products: {
    type: Array,
    required: true,
  },
})

// Emits
const emit = defineEmits(['product-click', 'add-to-cart', 'toggle-favorite'])

// State
const addingToCart = ref(null)

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
  addingToCart.value = product.id

  // Emit event to parent
  emit('add-to-cart', product)

  // Reset loading state after delay
  setTimeout(() => {
    addingToCart.value = null
  }, 800)
}

const handleToggleFavorite = (product) => {
  emit('toggle-favorite', product)
}
</script>

<style scoped></style>
