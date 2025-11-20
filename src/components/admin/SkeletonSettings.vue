<template>
  <div class="p-6">
    <!-- Header Skeleton -->
    <div class="mb-6 animate-pulse">
      <div class="h-9 bg-gray-300 rounded w-32 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-48"></div>
    </div>

    <!-- Settings Tabs Skeleton -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Tabs Header -->
      <div class="border-b border-gray-200 animate-pulse">
        <div class="flex gap-8 px-6 py-4">
          <div v-for="i in 5" :key="i" class="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Section 1 -->
        <div class="mb-8 animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div class="h-4 bg-gray-200 rounded w-32"></div>
              <div class="md:col-span-2 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="mb-8 animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-40 mb-4"></div>
          <div class="space-y-4">
            <div v-for="i in 4" :key="i" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div class="h-4 bg-gray-200 rounded w-28"></div>
              <div class="md:col-span-2 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Section 3 - Toggle Switches -->
        <div class="mb-8 animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-44 mb-4"></div>
          <div class="space-y-4">
            <div
              v-for="i in 5"
              :key="i"
              class="flex items-center justify-between py-3 border-b border-gray-100"
            >
              <div class="flex-1">
                <div class="h-4 bg-gray-300 rounded w-40 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-56"></div>
              </div>
              <div class="w-12 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- Section 4 - Cards Grid -->
        <div class="mb-8 animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-36 mb-4"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div class="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div class="h-4 bg-gray-300 rounded w-32 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>

        <!-- Section 5 - List Items -->
        <div class="mb-8 animate-pulse">
          <div class="flex items-center justify-between mb-4">
            <div class="h-6 bg-gray-300 rounded w-40"></div>
            <div class="h-10 bg-blue-300 rounded w-32"></div>
          </div>
          <div class="space-y-3">
            <div
              v-for="i in 4"
              :key="i"
              class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <div class="w-12 h-12 bg-gray-200 rounded"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-300 rounded w-48"></div>
                <div class="h-3 bg-gray-200 rounded w-64"></div>
              </div>
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-gray-200 rounded"></div>
                <div class="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 animate-pulse">
          <div class="h-10 bg-gray-200 rounded w-24"></div>
          <div class="h-10 bg-blue-300 rounded w-32"></div>
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
