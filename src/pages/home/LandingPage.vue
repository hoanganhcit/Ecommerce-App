<template>
  <q-page class="slider-page">
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="full-height bg-gray-200 animate-pulse">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center space-y-4">
          <q-skeleton type="text" width="400px" height="60px" class="mx-auto" />
          <q-skeleton type="text" width="600px" height="40px" class="mx-auto" />
          <q-skeleton type="rect" width="200px" height="50px" class="mx-auto rounded" />
        </div>
      </div>
    </div>

    <!-- Carousel -->
    <q-carousel
      v-else
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const slide = ref('1')
const isLoading = ref(true)

// Slides data
const slides = ref([
  {
    id: '1',
    subtitle: 'Bộ Sưu Tập Mới 2025',
    title: 'Khám Phá Phong Cách Của Bạn',
    buttonText: 'MUA SẮM NGAY',
    image: 'sl-1.jpg',
  },
  {
    id: '2',
    subtitle: 'Giảm Giá Mùa Hè',
    title: 'Giảm Đến 50%',
    buttonText: 'MUA SẮM NGAY',
    image: 'sl-2.jpg',
  },
  {
    id: '3',
    subtitle: 'Chất Lượng Cao Cấp',
    title: 'Thời Trang Định Hình Phong Cách Bạn',
    buttonText: 'MUA SẮM NGAY',
    image: 'sl-3.jpg',
  },
])

const goToShop = () => {
  router.push('/shop')
}

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
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
