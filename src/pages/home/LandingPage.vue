<template>
  <q-page class="slider-page">
    <q-carousel
      v-model="slide"
      swipeable
      control-color="white"
      navigation
      padding
      animated
      infinite
      autoplay
      class="full-height"
    >
      <!-- Slide 1 -->
      <q-carousel-slide name="1" class="slide-1">
        <div class="slide-content">
          <div class="subtitle">New Collection 2025</div>
          <h1 class="title">Discover Your Style</h1>
          <button
            @click="goToShop"
            class="bg-gray-900 text-white hover:bg-gray-700 px-8 py-3 text-xs text-uppercase spacing-2 !font-semibold tracking-widest"
          >
            Start Shopping Now
          </button>
        </div>
      </q-carousel-slide>

      <!-- Slide 2 -->
      <q-carousel-slide name="2" class="slide-2">
        <div class="slide-content">
          <div class="subtitle">Summer Sale</div>
          <h1 class="title">Up to 50% Off</h1>
          <button
            @click="goToShop"
            class="bg-gray-900 text-white hover:bg-gray-700 px-8 py-3 text-xs text-uppercase !font-semibold tracking-widest"
          >
            Start Shopping Now
          </button>
        </div>
      </q-carousel-slide>

      <!-- Slide 3 -->
      <q-carousel-slide name="3" class="slide-3">
        <div class="slide-content">
          <div class="subtitle">Premium Quality</div>
          <h1 class="title">Fashion That Defines You</h1>
          <button
            @click="goToShop"
            class="bg-gray-900 text-white hover:bg-gray-700 px-8 py-3 text-xs text-uppercase !font-semibold tracking-widest"
          >
            Start Shopping Now
          </button>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const slide = ref('1')

const goToShop = () => {
  router.push('/shop')
}
</script>

<style scoped>
.slider-page {
  height: 100vh;
}

.full-height {
  height: 100vh;
}

.slide-1,
.slide-2,
.slide-3 {
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-1::before,
.slide-2::before,
.slide-3::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.slide-1 {
  background-image: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920');
}

.slide-2 {
  background-image: url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920');
}

.slide-3 {
  background-image: url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1920');
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
}

.subtitle {
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 40px;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .subtitle {
    font-size: 1rem;
  }

  .title {
    font-size: 2.5rem;
  }
}
</style>
