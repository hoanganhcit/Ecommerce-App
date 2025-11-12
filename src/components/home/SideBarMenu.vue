<template>
  <!-- Left Sidebar Menu - Fixed Icon Only (Hidden on mobile) -->
  <aside
    class="hidden md:!flex fixed border-r border-gray-200 bg-white top-0 left-0 h-full w-20 z-50 flex-col"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-20">
      <img src="/favicon.ico" class="w-10 h-10" alt="Logo" />
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 space-y-2 overflow-y-auto">
      <ul>
        <li
          class="h-20 flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 transition-all group"
        >
          <button
            @click="$emit('toggle-menu', true)"
            class=""
            active-class="!text-white !bg-gray-800"
          >
            <i class="fal fa-home text-xl mb-1"></i>
          </button>
        </li>
        <li
          class="h-20 flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 transition-all group"
        >
          <button
            @click="$emit('toggle-cart', true)"
            class="relative"
            active-class="!text-white !bg-gray-800"
          >
            <i class="fal fa-shopping-bag text-xl mb-1"></i>
            <span
              v-if="totalItems > 0"
              class="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ totalItems }}
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Bottom Items -->
    <div class="py-4 space-y-2">
      <!-- Login -->
      <router-link
        to="/login"
        class="flex flex-col items-center justify-center py-4 px-2 text-gray-400 transition-all group"
        active-class="!text-white !bg-gray-800"
      >
        <i class="fal fa-user text-xl mb-1"></i>
      </router-link>
    </div>
  </aside>

  <!-- Mobile Bottom Navigation -->
  <nav class="md:!hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex items-center justify-around h-16">
      <button
        @click="$emit('toggle-menu', true)"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all"
      >
        <i class="fal fa-home text-xl mb-1"></i>
        <span class="text-xs">Home</span>
      </button>

      <router-link
        to="/shop"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all"
      >
        <i class="fal fa-store text-xl mb-1"></i>
        <span class="text-xs">Shop</span>
      </router-link>

      <button
        @click="$emit('toggle-cart', true)"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all relative"
      >
        <i class="fal fa-shopping-bag text-xl mb-1"></i>
        <span class="text-xs">Cart</span>
        <span
          v-if="totalItems > 0"
          class="absolute top-0 right-6 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ totalItems }}
        </span>
      </button>

      <router-link
        to="/login"
        class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-gray-900 transition-all"
      >
        <i class="fal fa-user text-xl mb-1"></i>
        <span class="text-xs">Account</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
// Props
defineProps({
  totalItems: {
    type: Number,
    default: 0,
  },
})

// Emits
defineEmits(['toggle-menu', 'toggle-cart'])
</script>
