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
      <q-carousel-slide
        v-for="slideItem in slides"
        :key="slideItem.id"
        :name="slideItem.id"
        class="slide-item"
      >
        <!-- Background Image -->
        <img
          :src="slideItem.image"
          :alt="slideItem.title"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/10 z-[1]"></div>

        <!-- Content -->
        <div class="slide-content">
          <div class="subtitle">{{ slideItem.subtitle }}</div>
          <h1 class="title">{{ slideItem.title }}</h1>
          <button
            @click="goToShop"
            class="bg-gray-900 text-white hover:bg-gray-700 px-8 py-3 text-xs uppercase !font-semibold tracking-widest transition-all duration-300 hover:scale-105"
          >
            {{ slideItem.buttonText }}
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

// Slides data
const slides = ref([
  {
    id: '1',
    subtitle: 'New Collection 2025',
    title: 'Discover Your Style',
    buttonText: 'MUA SẮM NGAY',
    image: 'sl-1.jpg',
  },
  {
    id: '2',
    subtitle: 'Summer Sale',
    title: 'Up to 50% Off',
    buttonText: 'MUA SẮM NGAY',
    image: 'sl-2.jpg',
  },
  {
    id: '3',
    subtitle: 'Premium Quality',
    title: 'Fashion That Defines You',
    buttonText: 'MUA SẮM NGAY',
    image: 'sl-3.jpg',
  },
])

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

.slide-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
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
