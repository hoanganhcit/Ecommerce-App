<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <header class="fixed top-0 left-0 right-0 z-30">
      <div class="flex ml-20 items-center justify-center py-4">
        <router-link to="/" class="text-white font-bold text-lg">
          <img src="/logo.png" alt="Logo" class="h-12" />
        </router-link>
      </div>
    </header>
    <!-- Overlay -->
    <div
      v-if="showMenuDrawer || showCartDrawer"
      @click="(toggleMenuDrawer(false), toggleCartDrawer(false))"
      class="fixed inset-0 z-30 bg-black/20 transition-opacity duration-300"
    ></div>

    <!-- Sidebar Menu Component -->
    <SideBarMenu
      :totalItems="totalItems"
      @toggle-menu="toggleMenuDrawer"
      @toggle-cart="toggleCartDrawer"
    />

    <!-- Left Cart Sidebar -->
    <CartDrawer />

    <!-- Menu Drawer -->
    <MenuDrawer :showMenuDrawer="showMenuDrawer" :toggleMenuDrawer="toggleMenuDrawer" />

    <!-- Main Content -->
    <q-page-container class="md:ml-20 pb-16 md:pb-0">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from 'src/stores/useCartStore'
import SideBarMenu from 'src/components/home/SideBarMenu.vue'
import CartDrawer from 'src/components/home/CartDrawer.vue'
import MenuDrawer from 'src/components/home/MenuDrawer.vue'

const showMenuDrawer = ref(false)
const { totalItems, showCartDrawer, toggleCartDrawer: toggleCart } = useCartStore()

const toggleMenuDrawer = (show) => {
  showMenuDrawer.value = show
  // Close cart drawer when opening menu drawer
  if (show) {
    toggleCart(false)
  }
}

const toggleCartDrawer = (show) => {
  toggleCart(show)
  // Close menu drawer when opening cart drawer
  if (show) {
    showMenuDrawer.value = false
  }
}
</script>
