<template>
  <div class="p-6">
    <!-- Header Skeleton -->
    <div class="mb-6 animate-pulse">
      <div class="h-9 bg-gray-300 rounded w-40 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-56"></div>
    </div>

    <!-- Date Range Filter Skeleton -->
    <div class="bg-white rounded-xl p-6 mb-6 shadow-sm animate-pulse">
      <div class="flex items-center justify-between">
        <div class="flex gap-4 items-center">
          <div class="h-5 bg-gray-200 rounded w-32"></div>
          <div class="h-10 bg-gray-200 rounded w-40"></div>
          <div class="h-10 bg-gray-200 rounded w-40"></div>
          <div class="h-10 bg-blue-300 rounded w-24"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-10 bg-gray-200 rounded w-20"></div>
          <div class="h-10 bg-gray-200 rounded w-20"></div>
          <div class="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-28 mb-2"></div>
            <div class="h-8 bg-gray-300 rounded w-20"></div>
          </div>
          <div class="w-14 h-14 bg-gray-200 rounded-xl"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 bg-gray-200 rounded w-12"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Charts Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div class="mb-6">
          <div class="h-6 bg-gray-300 rounded w-40 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div class="flex items-end justify-between gap-2 h-64">
          <div
            v-for="i in 12"
            :key="i"
            class="flex-1 bg-gray-200 rounded-t"
            :style="{ height: `${Math.random() * 60 + 40}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-4">
          <div v-for="i in 12" :key="i" class="h-3 bg-gray-200 rounded w-6"></div>
        </div>
      </div>

      <!-- Category Distribution Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div class="mb-6">
          <div class="h-6 bg-gray-300 rounded w-48 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-36"></div>
        </div>
        <div class="flex items-center justify-center mb-6">
          <div class="relative w-48 h-48 bg-gray-200 rounded-full"></div>
        </div>
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div class="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div class="mb-4">
          <div class="h-5 bg-gray-300 rounded w-32 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div class="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Tables Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Products -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div class="p-6 border-b border-gray-200">
          <div class="h-5 bg-gray-300 rounded w-32"></div>
        </div>
        <div class="p-6">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center gap-4 py-3 border-b border-gray-100"
          >
            <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div class="p-6 border-b border-gray-200">
          <div class="h-5 bg-gray-300 rounded w-32"></div>
        </div>
        <div class="p-6">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div class="space-y-2">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div class="text-right space-y-2">
              <div class="h-4 bg-gray-300 rounded w-20"></div>
              <div class="h-6 bg-gray-200 rounded w-16"></div>
            </div>
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
