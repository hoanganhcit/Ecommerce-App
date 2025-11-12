import { ref, computed } from 'vue'

const cartItems = ref([])
const showCartDrawer = ref(false)

export function useCartStore() {
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

    // Show cart drawer
    showCartDrawer.value = true
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex((item) => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
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
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
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

    // Computed
    totalItems,
    totalPrice,
    isEmpty,
  }
}
