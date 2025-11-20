<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="h-5 bg-gray-200 rounded w-32"></div>
    </div>

    <!-- Table Rows -->
    <div v-for="i in rows" :key="i" class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center gap-4">
        <!-- Image placeholder -->
        <div v-if="withImage" class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>

        <!-- Content placeholders -->
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-300 rounded" :style="{ width: getRandomWidth() }"></div>
          <div class="h-3 bg-gray-200 rounded" :style="{ width: getRandomWidth(60, 80) }"></div>
        </div>

        <!-- Action buttons placeholder -->
        <div class="flex gap-2">
          <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 5,
  },
  withImage: {
    type: Boolean,
    default: true,
  },
})

const getRandomWidth = (min = 40, max = 90) => {
  return `${Math.floor(Math.random() * (max - min + 1)) + min}%`
}
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
