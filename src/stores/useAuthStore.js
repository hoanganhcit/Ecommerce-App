import { ref, computed } from 'vue'

const customer = ref(null)
const token = ref(null)

// Load from localStorage on init
const loadAuthFromStorage = () => {
  const storedCustomer = localStorage.getItem('customer')
  const storedToken = localStorage.getItem('token')

  if (storedCustomer && storedToken) {
    customer.value = JSON.parse(storedCustomer)
    token.value = storedToken
  }
}

// Initialize
loadAuthFromStorage()

export function useAuthStore() {
  // Computed
  const isAuthenticated = computed(() => !!customer.value && !!token.value)
  const userName = computed(() => customer.value?.fullName || null)
  const userEmail = computed(() => customer.value?.email || null)
  const userAvatar = computed(() => customer.value?.avatar || null)

  // Login - Save customer data and token
  const login = (customerData, authToken) => {
    customer.value = customerData
    token.value = authToken

    // Save to localStorage
    localStorage.setItem('customer', JSON.stringify(customerData))
    localStorage.setItem('token', authToken)
  }

  // Logout - Clear all data
  const logout = () => {
    customer.value = null
    token.value = null

    // Clear localStorage
    localStorage.removeItem('customer')
    localStorage.removeItem('token')
  }

  // Update customer profile
  const updateCustomer = (customerData) => {
    customer.value = { ...customer.value, ...customerData }
    localStorage.setItem('customer', JSON.stringify(customer.value))
  }

  // Get auth header for API requests
  const getAuthHeader = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    // State
    customer: computed(() => customer.value),
    token: computed(() => token.value),

    // Computed
    isAuthenticated,
    userName,
    userEmail,
    userAvatar,

    // Actions
    login,
    logout,
    updateCustomer,
    getAuthHeader,
  }
}
