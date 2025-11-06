<template>
  <q-layout view="hHh lpr fFf">
    <!-- Header/Navbar -->
    <q-header elevated class="bg-white text-grey-9">
      <q-toolbar class="container mx-auto px-4">
        <q-toolbar-title class="flex items-center gap-2">
          <div
            class="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"
          >
            <q-icon name="store" size="24px" />
          </div>
          <span class="text-xl font-bold text-blue-600">Fashion Store</span>
        </q-toolbar-title>

        <!-- Desktop Menu -->
        <div class="hidden md:!flex items-center gap-6">
          <router-link to="/" class="text-grey-8 hover:text-blue-600 transition">Home</router-link>

          <!-- Shop with Mega Menu -->
          <q-btn-dropdown
            flat
            no-caps
            label="Shop"
            class="text-grey-8 hover:text-blue-600"
            dropdown-icon="expand_more"
          >
            <div class="grid grid-cols-4 gap-6 p-6 min-w-[600px]">
              <!-- Men's Category -->
              <div>
                <div class="font-bold text-grey-9 mb-3">Men's Wear</div>
                <ul class="space-y-2">
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">T-Shirts</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Shirts</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Jeans</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Jackets</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Suits</a></li>
                </ul>
              </div>

              <!-- Women's Category -->
              <div>
                <div class="font-bold text-grey-9 mb-3">Women's Wear</div>
                <ul class="space-y-2">
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Dresses</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Tops</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Skirts</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Blouses</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Coats</a></li>
                </ul>
              </div>

              <!-- Accessories -->
              <div>
                <div class="font-bold text-grey-9 mb-3">Accessories</div>
                <ul class="space-y-2">
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Bags</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Belts</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Watches</a></li>
                  <li>
                    <a href="#" class="text-sm text-grey-7 hover:text-blue-600">Sunglasses</a>
                  </li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Jewelry</a></li>
                </ul>
              </div>

              <!-- Shoes -->
              <div>
                <div class="font-bold text-grey-9 mb-3">Footwear</div>
                <ul class="space-y-2">
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Sneakers</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Boots</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Sandals</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Heels</a></li>
                  <li><a href="#" class="text-sm text-grey-7 hover:text-blue-600">Loafers</a></li>
                </ul>
              </div>
            </div>
          </q-btn-dropdown>

          <router-link to="/collections" class="text-grey-8 hover:text-blue-600 transition"
            >Collections</router-link
          >
          <router-link to="/about" class="text-grey-8 hover:text-blue-600 transition"
            >About</router-link
          >
          <router-link to="/contact" class="text-grey-8 hover:text-blue-600 transition"
            >Contact</router-link
          >
        </div>

        <!-- Cart & User Icons -->
        <div class="flex items-center gap-2 ml-auto md:ml-4">
          <q-btn flat round icon="search" color="grey-8" @click="searchDrawer = true" />
          <q-btn flat round icon="favorite_border" color="grey-8">
            <q-badge color="red" floating>{{ wishlistCount }}</q-badge>
          </q-btn>
          <q-btn flat round icon="shopping_cart" color="grey-8" @click="cartDrawer = true">
            <q-badge color="blue-6" floating>{{ cartCount }}</q-badge>
          </q-btn>
          <q-btn flat round icon="person" color="grey-8" @click="$router.push('/login')" />

          <!-- Mobile Menu Toggle -->
          <q-btn flat round icon="menu" color="grey-8" class="md:!hidden" @click="toggleDrawer" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobile Drawer -->
    <q-drawer v-model="drawer" side="right" overlay elevated class="bg-white">
      <div class="p-4">
        <div class="text-xl font-bold text-blue-600 mb-6">Menu</div>
        <div class="space-y-4">
          <router-link
            to="/"
            class="block text-grey-8 hover:text-blue-600 transition py-2"
            @click="drawer = false"
            >Home</router-link
          >

          <!-- Mobile Shop Menu with Categories -->
          <q-expansion-item label="Shop" class="text-grey-8">
            <div class="ml-4 space-y-2 mt-2">
              <div>
                <p class="font-semibold text-sm mb-1">Men's Wear</p>
                <ul class="ml-3 space-y-1">
                  <li><a href="#" class="text-sm text-grey-7">T-Shirts</a></li>
                  <li><a href="#" class="text-sm text-grey-7">Shirts</a></li>
                  <li><a href="#" class="text-sm text-grey-7">Jeans</a></li>
                </ul>
              </div>
              <div>
                <p class="font-semibold text-sm mb-1">Women's Wear</p>
                <ul class="ml-3 space-y-1">
                  <li><a href="#" class="text-sm text-grey-7">Dresses</a></li>
                  <li><a href="#" class="text-sm text-grey-7">Tops</a></li>
                  <li><a href="#" class="text-sm text-grey-7">Skirts</a></li>
                </ul>
              </div>
            </div>
          </q-expansion-item>

          <router-link
            to="/collections"
            class="block text-grey-8 hover:text-blue-600 transition py-2"
            @click="drawer = false"
            >Collections</router-link
          >
          <router-link
            to="/about"
            class="block text-grey-8 hover:text-blue-600 transition py-2"
            @click="drawer = false"
            >About</router-link
          >
          <router-link
            to="/contact"
            class="block text-grey-8 hover:text-blue-600 transition py-2"
            @click="drawer = false"
            >Contact</router-link
          >
        </div>
      </div>
    </q-drawer>

    <!-- Search Dialog -->
    <q-dialog v-model="searchDrawer" position="top" class="search-dialog">
      <q-card class="bg-white" style="width: 100%; max-width: 800px">
        <q-card-section class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="text-xl font-bold text-grey-9">Search Products</div>
            <q-space />
            <q-btn flat round icon="close" color="grey-8" v-close-popup />
          </div>

          <q-input
            v-model="searchQuery"
            outlined
            placeholder="Search for products, brands, categories..."
            class="mb-4"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn v-if="searchQuery" flat round dense icon="close" @click="searchQuery = ''" />
            </template>
          </q-input>

          <div class="flex gap-2 flex-wrap">
            <q-chip
              v-for="tag in popularSearches"
              :key="tag"
              clickable
              color="blue-1"
              text-color="blue-9"
              @click="searchQuery = tag"
            >
              {{ tag }}
            </q-chip>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Cart Sidebar -->
    <q-drawer v-model="cartDrawer" side="right" overlay elevated :width="400" class="bg-white">
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-4 border-b border-grey-3">
          <div class="flex items-center justify-between">
            <div class="text-xl font-bold text-grey-9">Shopping Cart ({{ cartCount }})</div>
            <q-btn flat round icon="close" color="grey-8" @click="cartDrawer = false" />
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartItems.length === 0" class="text-center py-12">
            <q-icon name="shopping_cart" size="64px" color="grey-4" />
            <p class="text-grey-6 mt-4">Your cart is empty</p>
            <q-btn
              color="blue-6"
              label="Continue Shopping"
              class="mt-4"
              @click="cartDrawer = false"
            />
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex gap-4 p-3 border border-grey-3 rounded-lg"
            >
              <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded" />
              <div class="flex-1">
                <div class="font-semibold text-sm text-grey-9">{{ item.name }}</div>
                <p v-if="item.size" class="text-xs text-grey-6 mt-1">Size: {{ item.size }}</p>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-2">
                    <q-btn
                      flat
                      dense
                      round
                      size="sm"
                      icon="remove"
                      @click="updateQuantity(item, -1)"
                    />
                    <span class="text-sm font-medium">{{ item.quantity }}</span>
                    <q-btn flat dense round size="sm" icon="add" @click="updateQuantity(item, 1)" />
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-blue-6">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="red"
                size="sm"
                @click="removeFromCart(item)"
              />
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div class="p-4 border-t border-grey-3 bg-grey-1">
          <div class="flex items-center justify-between mb-4">
            <span class="text-grey-8">Subtotal:</span>
            <span class="text-xl font-bold text-grey-9">${{ cartTotal.toFixed(2) }}</span>
          </div>
          <q-btn
            color="blue-6"
            label="Proceed to Checkout"
            class="w-full"
            size="lg"
            @click="checkout"
          />
          <q-btn flat label="Continue Shopping" class="w-full mt-2" @click="cartDrawer = false" />
        </div>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />

      <!-- Footer (non-fixed) -->
      <footer class="bg-grey-9 text-white">
        <div class="container mx-auto px-4 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- About -->
            <div>
              <div class="text-lg font-bold mb-4">Fashion Store</div>
              <p class="text-grey-4 text-sm">
                Your destination for trendy and affordable fashion. Quality clothing for every
                style.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <div class="text-lg font-bold mb-4">Quick Links</div>
              <ul class="space-y-2 text-sm">
                <li>
                  <router-link to="/about" class="text-grey-4 hover:text-white transition"
                    >About Us</router-link
                  >
                </li>
                <li>
                  <router-link to="/shop" class="text-grey-4 hover:text-white transition"
                    >Shop</router-link
                  >
                </li>
                <li>
                  <router-link to="/contact" class="text-grey-4 hover:text-white transition"
                    >Contact</router-link
                  >
                </li>
                <li>
                  <router-link to="/faq" class="text-grey-4 hover:text-white transition"
                    >FAQ</router-link
                  >
                </li>
              </ul>
            </div>

            <!-- Customer Service -->
            <div>
              <div class="text-lg font-bold mb-4">Customer Service</div>
              <ul class="space-y-2 text-sm">
                <li>
                  <a href="#" class="text-grey-4 hover:text-white transition">Shipping Info</a>
                </li>
                <li><a href="#" class="text-grey-4 hover:text-white transition">Returns</a></li>
                <li><a href="#" class="text-grey-4 hover:text-white transition">Size Guide</a></li>
                <li><a href="#" class="text-grey-4 hover:text-white transition">Track Order</a></li>
              </ul>
            </div>

            <!-- Newsletter -->
            <div>
              <div class="text-lg font-bold mb-4">Newsletter</div>
              <p class="text-grey-4 text-sm mb-4">
                Subscribe to get updates on new arrivals and special offers.
              </p>
              <div class="flex gap-2">
                <q-input dense outlined placeholder="Your email" bg-color="white" class="flex-1" />
                <q-btn color="blue-6" label="Subscribe" />
              </div>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div
            class="border-t border-grey-7 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p class="text-grey-4 text-sm">© 2025 Fashion Store. All rights reserved.</p>
            <div class="flex gap-4">
              <q-btn flat round icon="fab fa-facebook" color="grey-4" size="sm" />
              <q-btn flat round icon="fab fa-instagram" color="grey-4" size="sm" />
              <q-btn flat round icon="fab fa-twitter" color="grey-4" size="sm" />
              <q-btn flat round icon="fab fa-youtube" color="grey-4" size="sm" />
            </div>
          </div>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const drawer = ref(false)
const searchDrawer = ref(false)
const cartDrawer = ref(false)
const searchQuery = ref('')
const wishlistCount = ref(3)

const popularSearches = ['T-Shirts', 'Jeans', 'Dresses', 'Sneakers', 'Jackets']

// Sample cart items
const cartItems = ref([
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 29.99,
    quantity: 2,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100',
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    price: 59.99,
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

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

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
  $q.dialog({
    title: 'Remove Item',
    message: 'Are you sure you want to remove this item from cart?',
    cancel: true,
    persistent: false,
  }).onOk(() => {
    const index = cartItems.value.findIndex((i) => i.id === item.id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      $q.notify({
        message: 'Item removed from cart',
        color: 'negative',
        icon: 'delete',
        position: 'top',
      })
    }
  })
}

const checkout = () => {
  cartDrawer.value = false
  router.push('/checkout')
  $q.notify({
    message: 'Proceeding to checkout...',
    color: 'positive',
    icon: 'shopping_bag',
    position: 'top',
  })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
