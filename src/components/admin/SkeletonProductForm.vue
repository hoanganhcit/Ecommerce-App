<template>
  <div class="p-6">
    <!-- Header Skeleton -->
    <div class="mb-6 animate-pulse">
      <div class="h-9 bg-gray-300 rounded w-48"></div>
    </div>

    <!-- Form Card Skeleton -->
    <div class="bg-white rounded-xl shadow-sm">
      <div class="p-6 animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Product Images -->
            <div>
              <div class="h-5 bg-gray-200 rounded w-32 mb-3"></div>
              <div class="grid grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <!-- Product Name -->
            <div>
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>

            <!-- Description -->
            <div>
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Categories -->
            <div>
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>

            <!-- Price & Stock -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div class="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div class="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div class="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            <!-- SKU -->
            <div>
              <div class="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>

            <!-- Variants -->
            <div>
              <div class="h-4 bg-gray-200 rounded w-32 mb-3"></div>
              <div class="space-y-3">
                <div v-for="i in 2" :key="i" class="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 pt-4">
              <div class="flex-1 h-10 bg-gray-300 rounded"></div>
              <div class="flex-1 h-10 bg-gray-200 rounded"></div>
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
