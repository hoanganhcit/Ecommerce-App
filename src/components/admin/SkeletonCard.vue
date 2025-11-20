<template>
  <div class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div class="h-8 bg-gray-300 rounded w-16"></div>
      </div>
      <div class="w-12 h-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
</template>

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
