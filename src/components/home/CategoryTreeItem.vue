<template>
  <li>
    <!-- Category Button -->
    <div class="flex items-center" :style="{ marginLeft: marginLeft }">
      <button
        @click="$emit('select-category', category.id)"
        :class="[
          'flex-1 text-left px-3 py-2 rounded-lg text-sm transition-all hover:text-blue-500 hover:bg-blue-50',
          isSelected ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-900',
        ]"
      >
        {{ category.name }}
      </button>
      <button
        v-if="hasChildren"
        @click="$emit('toggle-expand', category.id)"
        class="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
      >
        <i
          :class="[
            'fal text-xs transition-transform w-3',
            isExpanded ? 'fa-minus text-gray-700' : 'fa-plus text-gray-500',
          ]"
        ></i>
      </button>
      <span v-else class="w-7 flex-shrink-0"></span>
    </div>

    <!-- Children Categories (Recursive) -->
    <ul v-if="isExpanded && hasChildren" class="mt-1 space-y-1">
      <CategoryTreeItem
        v-for="child in children"
        :key="child.id"
        :category="child"
        :categories="categories"
        :selectedCategory="selectedCategory"
        :expandedCategories="expandedCategories"
        :level="level + 1"
        @select-category="$emit('select-category', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  selectedCategory: {
    type: Number,
    default: 0,
  },
  expandedCategories: {
    type: Array,
    default: () => [],
  },
  level: {
    type: Number,
    default: 0,
  },
})

defineEmits(['select-category', 'toggle-expand'])

const hasChildren = computed(() => {
  return props.categories.some((cat) => {
    if (!cat.parent) return false
    const catParentId = typeof cat.parent === 'object' ? cat.parent.id : cat.parent
    return catParentId === props.category.id
  })
})

const children = computed(() => {
  return props.categories.filter((cat) => {
    if (!cat.parent) return false
    const catParentId = typeof cat.parent === 'object' ? cat.parent.id : cat.parent
    return catParentId === props.category.id
  })
})

const isExpanded = computed(() => {
  return props.expandedCategories.includes(props.category.id)
})

const isSelected = computed(() => {
  return props.selectedCategory === props.category.id
})

const marginLeft = computed(() => {
  return `${props.level * 1.75}rem`
})
</script>

<style scoped></style>
