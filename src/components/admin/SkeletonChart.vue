<template>
  <div class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
    <!-- Header -->
    <div class="mb-6">
      <div class="h-6 bg-gray-300 rounded w-40 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-24"></div>
    </div>

    <!-- Chart bars -->
    <div class="flex items-end justify-between gap-2 h-48">
      <div
        v-for="i in 12"
        :key="i"
        class="flex-1 bg-gray-200 rounded-t"
        :style="{ height: getRandomHeight() }"
      ></div>
    </div>

    <!-- X-axis labels -->
    <div class="flex justify-between mt-4">
      <div v-for="i in 12" :key="i" class="h-3 bg-gray-200 rounded w-8"></div>
    </div>
  </div>
</template>

<script setup>
const getRandomHeight = () => {
  return `${Math.floor(Math.random() * 60) + 40}%`
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
