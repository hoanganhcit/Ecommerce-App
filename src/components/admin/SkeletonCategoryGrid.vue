<template>
  <div class="p-6">
    <!-- Header Skeleton -->
    <div class="mb-6 animate-pulse">
      <div class="flex items-center justify-between">
        <div>
          <div class="h-9 bg-gray-300 rounded w-40 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-56"></div>
        </div>
        <div class="h-10 bg-blue-300 rounded w-36"></div>
      </div>
    </div>

    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-28 mb-2"></div>
            <div class="h-8 bg-gray-300 rounded w-16"></div>
          </div>
          <div class="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Categories Grid Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="i in 8"
        :key="i"
        class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
      >
        <!-- Category Header -->
        <div class="relative h-32 bg-gray-200">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <div class="h-5 bg-gray-300 rounded-full w-16"></div>
          </div>
        </div>

        <!-- Category Content -->
        <div class="p-4">
          <!-- Category Name -->
          <div class="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>

          <!-- Category Slug -->
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>

          <!-- Description -->
          <div class="space-y-2 mb-4">
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm mb-4">
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          <!-- Parent Category -->
          <div class="mb-4">
            <div class="h-6 bg-gray-200 rounded w-24"></div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <div class="flex-1 h-8 bg-gray-200 rounded"></div>
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
