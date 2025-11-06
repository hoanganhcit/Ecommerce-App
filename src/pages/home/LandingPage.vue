<template>
  <q-page>
    <!-- Hero Section -->
    <section class="hero-section bg-gradient-to-r from-blue-50 to-purple-50 py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div class="text-5xl md:text-6xl font-bold text-grey-9 mb-6">
              New Collection
              <span class="text-blue-600">2025</span>
            </div>
            <p class="text-xl text-grey-7 mb-8">
              Discover the latest trends in fashion. Quality clothing that defines your style.
            </p>
            <div class="flex gap-4">
              <q-btn
                size="lg"
                color="blue-6"
                label="Shop Now"
                @click="$router.push('/shop')"
                class="px-8"
              />
              <q-btn
                size="lg"
                outline
                color="blue-6"
                label="View Collections"
                @click="$router.push('/collections')"
                class="px-8"
              />
            </div>
          </div>
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Fashion"
              class="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <div class="text-4xl font-bold text-grey-9 mb-4">Shop by Category</div>
          <p class="text-grey-6">Explore our wide range of clothing categories</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card group cursor-pointer bg-grey-1 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            @click="goToCategory(category)"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <div class="text-white text-2xl font-bold mb-1">{{ category.name }}</div>
                <p class="text-white/80 text-sm">{{ category.count }} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 bg-grey-1">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <div class="text-4xl font-bold text-grey-9 mb-4">Featured Products</div>
          <p class="text-grey-6">Check out our best selling items</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div class="relative overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-4 right-4 space-y-2">
                <q-btn
                  round
                  flat
                  icon="favorite_border"
                  color="white"
                  class="bg-white/90 backdrop-blur"
                />
                <q-btn
                  round
                  flat
                  icon="visibility"
                  color="white"
                  class="bg-white/90 backdrop-blur"
                />
              </div>
              <div v-if="product.discount" class="absolute top-4 left-4">
                <q-badge color="red" class="text-sm px-3 py-1"> -{{ product.discount }}% </q-badge>
              </div>
            </div>

            <div class="p-4">
              <p class="text-grey-6 text-sm mb-1">{{ product.category }}</p>
              <div class="text-grey-9 font-semibold mb-2 line-clamp-2">{{ product.name }}</div>

              <div class="flex items-center gap-1 mb-2">
                <q-icon name="star" color="amber" size="16px" v-for="i in 5" :key="i" />
                <span class="text-sm text-grey-6 ml-1">({{ product.reviews }})</span>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-blue-600">${{ product.price }}</span>
                  <span v-if="product.originalPrice" class="text-sm text-grey-5 line-through ml-2">
                    ${{ product.originalPrice }}
                  </span>
                </div>
                <q-btn
                  round
                  color="blue-6"
                  icon="shopping_cart"
                  size="sm"
                  @click.stop="addToCart(product)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <q-btn
            size="lg"
            outline
            color="blue-6"
            label="View All Products"
            @click="$router.push('/shop')"
            class="px-10"
          />
        </div>
      </div>
    </section>

    <!-- Banner Section -->
    <section class="py-16 bg-blue-600">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-6">
              Summer Sale
              <span class="block text-yellow-300">Up to 50% Off</span>
            </div>
            <p class="text-xl text-blue-100 mb-8">
              Limited time offer on selected items. Don't miss out on amazing deals!
            </p>
            <q-btn
              size="lg"
              color="white"
              text-color="blue-6"
              label="Shop Sale"
              @click="$router.push('/shop?sale=true')"
              class="px-8"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
              alt="Sale"
              class="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <q-icon name="local_shipping" size="32px" color="blue-6" />
            </div>
            <div class="text-lg font-bold text-grey-9 mb-2">Free Shipping</div>
            <p class="text-grey-6 text-sm">On orders over $100</p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <q-icon name="sync" size="32px" color="blue-6" />
            </div>
            <div class="text-lg font-bold text-grey-9 mb-2">Easy Returns</div>
            <p class="text-grey-6 text-sm">30 days return policy</p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <q-icon name="verified_user" size="32px" color="blue-6" />
            </div>
            <div class="text-lg font-bold text-grey-9 mb-2">Secure Payment</div>
            <p class="text-grey-6 text-sm">100% secure checkout</p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <q-icon name="support_agent" size="32px" color="blue-6" />
            </div>
            <div class="text-lg font-bold text-grey-9 mb-2">24/7 Support</div>
            <p class="text-grey-6 text-sm">Dedicated customer service</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-grey-1">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <div class="text-4xl font-bold text-grey-9 mb-4">Join Our Newsletter</div>
          <p class="text-grey-6 mb-8">
            Subscribe to get updates on new arrivals, exclusive offers, and fashion tips.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <q-input
              v-model="email"
              outlined
              placeholder="Enter your email"
              bg-color="white"
              class="flex-1"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-btn color="blue-6" label="Subscribe" size="lg" @click="subscribe" class="px-8" />
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const email = ref('')

const categories = [
  {
    id: 1,
    name: "Men's Wear",
    count: 245,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500',
  },
  {
    id: 2,
    name: "Women's Wear",
    count: 389,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500',
  },
  {
    id: 3,
    name: 'Accessories',
    count: 156,
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500',
  },
  {
    id: 4,
    name: 'Shoes',
    count: 198,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
  },
]

const featuredProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    category: "Men's Wear",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    reviews: 124,
    size: 'M',
  },
  {
    id: 2,
    name: 'Elegant Summer Dress',
    category: "Women's Wear",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    reviews: 89,
    size: 'S',
  },
  {
    id: 3,
    name: 'Leather Jacket',
    category: "Men's Wear",
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    reviews: 156,
    size: 'L',
  },
  {
    id: 4,
    name: 'Designer Handbag',
    category: 'Accessories',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    reviews: 203,
    size: 'One Size',
  },
  {
    id: 5,
    name: 'Casual Sneakers',
    category: 'Shoes',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    reviews: 178,
    size: '42',
  },
  {
    id: 6,
    name: 'Floral Maxi Dress',
    category: "Women's Wear",
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    reviews: 94,
    size: 'M',
  },
  {
    id: 7,
    name: 'Slim Fit Jeans',
    category: "Men's Wear",
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    reviews: 167,
    size: '32',
  },
  {
    id: 8,
    name: 'Aviator Sunglasses',
    category: 'Accessories',
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
    reviews: 142,
    size: 'One Size',
  },
]

const goToCategory = (category) => {
  router.push(`/shop?category=${category.id}`)
}

const addToCart = (product) => {
  $q.notify({
    message: `${product.name} added to cart!`,
    color: 'positive',
    icon: 'shopping_cart',
    position: 'top',
    timeout: 2000,
  })
}

const subscribe = () => {
  if (!email.value) {
    $q.notify({
      message: 'Please enter your email',
      color: 'negative',
      position: 'top',
    })
    return
  }

  $q.notify({
    message: 'Thank you for subscribing!',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
  })
  email.value = ''
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-section {
  min-height: 600px;
}
</style>
