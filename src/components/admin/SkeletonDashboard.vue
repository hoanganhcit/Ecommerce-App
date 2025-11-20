<template>
  <div class="p-6">
    <!-- Header Skeleton -->
    <div class="mb-6 animate-pulse">
      <div class="h-9 bg-gray-300 rounded w-48 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-64"></div>
    </div>

    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <SkeletonCard v-for="i in 4" :key="i" />
    </div>

    <!-- Charts Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>

    <!-- Table Skeleton -->
    <SkeletonTable :rows="5" />
  </div>
</template>

<script setup>
import SkeletonCard from './SkeletonCard.vue'
import SkeletonChart from './SkeletonChart.vue'
import SkeletonTable from './SkeletonTable.vue'
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
