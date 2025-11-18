import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])
  const showCartDrawer = ref(false)

  // Load cart from localStorage on initialization
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        cartItems.value = JSON.parse(savedCart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        cartItems.value = []
      }
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }

  // Add item to cart
  const addToCart = (product, variant = null, quantity = 1) => {
    const existingItem = cartItems.value.find(
      (item) =>
        item.product.id === product.id &&
        (!variant ||
          (item.variant?.size === variant?.size && item.variant?.color === variant?.color)),
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: Date.now(),
        product,
        variant,
        quantity,
      })
    }

    saveCart()
    // Show cart drawer
    showCartDrawer.value = true
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex((item) => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      saveCart()
    }
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    const item = cartItems.value.find((item) => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    localStorage.removeItem('cart')
  }

  // Toggle cart drawer
  const toggleCartDrawer = (show) => {
    showCartDrawer.value = show !== undefined ? show : !showCartDrawer.value
  }

  // Computed
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  })

  const isEmpty = computed(() => {
    return cartItems.value.length === 0
  })

  // Initialize cart from localStorage
  loadCart()

  return {
    // State
    cartItems,
    showCartDrawer,

    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCartDrawer,
    loadCart,

    // Computed
    totalItems,
    totalPrice,
    isEmpty,
  }
})
