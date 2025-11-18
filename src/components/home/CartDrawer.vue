<template>
  <aside
    :class="[
      'fixed top-0 h-full w-96 bg-white z-40  transform transition-all duration-300 ease-in-out',
      'md:left-20 left-0',
      showCartDrawer ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Cart Header -->
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <div class="text-2xl font-bold text-gray-900">Giỏ Hàng</div>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-3">
        <div v-if="isEmpty" class="text-center py-12">
          <img src="/bag.svg" alt="Empty Cart" class="mx-auto w-24 h-24 mb-4" />
          <p class="text-gray-500 text-lg font-bold !mb-0">Giỏ hàng của bạn đang trống</p>
          <p class="text-gray-500">Bắt đầu bằng cách thêm sản phẩm vào đó!</p>
          <q-btn
            label="Tiếp tục mua sắm"
            unelevated
            class="!px-8 !rounded-xl !py-3 text-white !bg-gray-900 hover:!bg-gray-800"
            no-caps
            @click="$router.push('/shop')"
          />
        </div>

        <div v-else class="space-y-4">
          <div v-for="item in cartItems" :key="item.id" class="flex gap-4 p-4">
            <img
              :src="item.product.images[0]"
              :alt="item.product.name"
              class="w-20 h-20 object-cover rounded"
            />
            <div class="flex-1">
              <div class="font-semibold text-gray-900 mb-1">{{ item.product.name }}</div>
              <p v-if="item.variant?.size" class="text-sm text-gray-500 !mb-0">
                Size: {{ item.variant.size }}
              </p>
              <p v-if="item.variant?.color" class="text-sm text-gray-500 !mb-0">
                Màu: {{ item.variant.color }}
              </p>

              <div class="flex items-center justify-between mt-3">
                <!-- Quantity Controls - Rectangle Style -->
                <div class="flex items-center border border-gray-300 overflow-hidden">
                  <button
                    @click="updateQuantity(item.id, item.quantity - 1)"
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
                    @click="updateQuantity(item.id, item.quantity + 1)"
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

                <!-- Delete Button -->
                <button
                  @click="removeFromCart(item.id)"
                  class="flex items-center justify-center text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <!-- Price -->
                <div class="text-right">
                  <p class="font-bold text-black text-lg !mb-0">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Footer -->
      <div v-if="!isEmpty" class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-700 font-medium">Tổng cộng:</span>
          <span class="text-2xl font-bold text-gray-900">{{ formatPrice(totalPrice) }}</span>
        </div>
        <div class="grid gap-2 sm:grid-cols-2">
          <button
            @click="goToCheckout"
            class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors mb-2"
          >
            Thanh Toán
          </button>
          <button
            @click="toggleCartDrawer(false)"
            class="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Tiếp Tục Mua Sắm
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from 'src/stores/useCartStore'
import { useStoreData } from 'src/composables/useStoreData'
import { useRouter } from 'vue-router'

const router = useRouter()
const { formatPrice } = useStoreData()

const cartStore = useCartStore()
const { cartItems, showCartDrawer, totalPrice, isEmpty } = storeToRefs(cartStore)
const { removeFromCart, updateQuantity, toggleCartDrawer } = cartStore

const goToCheckout = () => {
  toggleCartDrawer(false)
  router.push('/checkout')
}
</script>

<style scoped>
.cart-drawer :deep(.q-drawer) {
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}
</style>
