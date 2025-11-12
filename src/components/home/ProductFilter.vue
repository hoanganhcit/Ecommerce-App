<template>
  <aside class="lg:col-span-3 space-y-6">
    <!-- Mobile Filter Toggle -->
    <button
      @click="toggleFilters"
      class="lg:!hidden w-full flex items-center justify-between px-4 py-3 bg-gray-900 text-white rounded-lg font-medium"
    >
      <div class="flex items-center gap-2">
        <i class="fal fa-filter"></i>
        <span>Bộ lọc</span>
        <span
          v-if="hasActiveFilters"
          class="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs"
        >
          {{ activeFiltersCount }}
        </span>
      </div>
      <i :class="['fal fa-chevron-down transition-transform', showFilters && 'rotate-180']"></i>
    </button>

    <!-- Filter Sidebar (Always visible on desktop, collapsible on mobile) -->
    <div :class="['space-y-6', showFilters ? 'block' : 'hidden lg:!block']">
      <!-- Categories -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-sm font-bold text-gray-900 mb-4 uppercase">
          <i class="fal fa-list mr-2"></i>Danh mục
        </div>
        <div class="space-y-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="$emit('update:selectedCategory', category.id)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:text-blue-500',
              selectedCategory === category.id ? '!text-blue-500 font-semibold' : 'text-gray-900',
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Price Range Filter -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-sm font-bold text-gray-900 mb-6 uppercase">
          <i class="fal fa-dollar-sign mr-2"></i>Khoảng giá
        </div>
        <div class="px-2">
          <q-range
            :model-value="priceRange"
            @update:model-value="$emit('update:priceRange', $event)"
            :min="minPrice"
            :max="maxPrice"
            :step="50000"
            label
            color="gray-900"
            label-always
            :left-label-value="`${formatPrice(priceRange.min)}`"
            :right-label-value="`${formatPrice(priceRange.max)}`"
          />
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{{ formatPrice(minPrice) }}</span>
          <span>{{ formatPrice(maxPrice) }}</span>
        </div>
      </div>

      <!-- Size Filter -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-sm font-bold text-gray-900 mb-4 uppercase">
          <i class="fal fa-ruler mr-2"></i>Kích thước
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in availableSizes"
            :key="size"
            @click="$emit('toggle-size', size)"
            :class="[
              'px-3 py-1.5 border-2 rounded-lg text-sm font-medium transition-all',
              selectedSizes.includes(size)
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400',
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Color Filter -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-sm font-bold text-gray-900 mb-4 uppercase">
          <i class="fal fa-palette mr-2"></i>Màu sắc
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="color in availableColors"
            :key="color.name"
            @click="$emit('toggle-color', color.name)"
            class="group flex flex-col items-center gap-1"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full border-4 transition-all',
                selectedColors.includes(color.name)
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-200 group-hover:border-gray-400',
              ]"
              :style="{ backgroundColor: color.value }"
            />
          </button>
        </div>
      </div>

      <!-- Collection Filter -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-sm font-bold text-gray-900 mb-4 uppercase">
          <i class="fal fa-layer-group mr-2"></i>Bộ sưu tập
        </div>
        <div class="space-y-2">
          <label
            v-for="collection in collections"
            :key="collection.id"
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              :value="collection.id"
              :checked="selectedCollections.includes(collection.id)"
              @change="$emit('toggle-collection', collection.id)"
              class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2 cursor-pointer"
            />
            <span class="text-sm text-gray-700 font-medium">{{ collection.name }}</span>
          </label>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <button
        v-if="hasActiveFilters"
        @click="$emit('clear-filters')"
        class="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm"
      >
        <i class="fal fa-times-circle mr-2"></i>
        Xóa tất cả bộ lọc
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  selectedCategory: {
    type: Number,
    default: 0,
  },
  priceRange: {
    type: Object,
    required: true,
  },
  minPrice: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  selectedSizes: {
    type: Array,
    default: () => [],
  },
  selectedColors: {
    type: Array,
    default: () => [],
  },
  selectedCollections: {
    type: Array,
    default: () => [],
  },
  availableSizes: {
    type: Array,
    required: true,
  },
  availableColors: {
    type: Array,
    required: true,
  },
  collections: {
    type: Array,
    required: true,
  },
  formatPrice: {
    type: Function,
    required: true,
  },
})

// Emits
defineEmits([
  'update:selectedCategory',
  'update:priceRange',
  'toggle-size',
  'toggle-color',
  'toggle-collection',
  'clear-filters',
])

// Local state
const showFilters = ref(false)

// Computed
const hasActiveFilters = computed(() => {
  return (
    props.selectedSizes.length > 0 ||
    props.selectedColors.length > 0 ||
    props.selectedCollections.length > 0 ||
    props.priceRange.min !== props.minPrice ||
    props.priceRange.max !== props.maxPrice
  )
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (props.selectedSizes.length > 0) count += props.selectedSizes.length
  if (props.selectedColors.length > 0) count += props.selectedColors.length
  if (props.selectedCollections.length > 0) count += props.selectedCollections.length
  if (props.priceRange.min !== props.minPrice || props.priceRange.max !== props.maxPrice) count += 1
  return count
})

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}
</script>
