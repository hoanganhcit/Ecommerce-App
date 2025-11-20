<template>
  <div class="p-6">
    <!-- Header Skeleton -->
    <div class="mb-6 animate-pulse">
      <div class="h-8 bg-gray-300 rounded w-48 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-64"></div>
    </div>

    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div
        v-for="i in 5"
        :key="i"
        class="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div class="h-7 bg-gray-300 rounded w-12"></div>
          </div>
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
        <div class="mt-2">
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Filters Skeleton -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6 animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="flex gap-2">
          <div class="flex-1 h-10 bg-gray-300 rounded"></div>
          <div class="flex-1 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <!-- Table Header -->
      <div class="border-b border-gray-200 bg-gray-50 p-4">
        <div class="grid grid-cols-7 gap-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Table Rows -->
      <div v-for="i in 8" :key="i" class="border-b border-gray-100 p-4">
        <div class="grid grid-cols-7 gap-4 items-center">
          <!-- Order ID -->
          <div class="h-4 bg-gray-300 rounded w-20"></div>

          <!-- Date -->
          <div class="h-4 bg-gray-200 rounded w-24"></div>

          <!-- Customer -->
          <div class="space-y-1">
            <div class="h-4 bg-gray-300 rounded w-28"></div>
            <div class="h-3 bg-gray-200 rounded w-20"></div>
          </div>

          <!-- Items -->
          <div class="h-4 bg-gray-200 rounded w-16"></div>

          <!-- Total -->
          <div class="h-4 bg-gray-300 rounded w-24"></div>

          <!-- Status -->
          <div class="h-6 bg-gray-200 rounded w-20"></div>

          <!-- Actions -->
          <div class="flex gap-2 justify-end">
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Pagination Skeleton -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="h-4 bg-gray-200 rounded w-40"></div>
          <div class="flex gap-2">
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
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
