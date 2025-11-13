import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

/**
 * Composable to access store data from API
 */
export function useStoreData() {
  // State
  const categoriesData = ref([])
  const productsData = ref([])
  const collectionsData = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Fetch data from API
  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Fetch categories, products, and collections in parallel
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/products`),
      ])

      if (categoriesRes.data.success) {
        categoriesData.value = categoriesRes.data.data
      }

      if (productsRes.data.success) {
        productsData.value = productsRes.data.data
      }
    } catch (err) {
      console.error('Error fetching store data:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Auto-fetch on mount
  onMounted(() => {
    fetchData()
  })

  // Categories with "All Products" option
  const categories = computed(() => [
    { id: 0, name: 'Tất cả sản phẩm', slug: 'all' },
    ...categoriesData.value.map((cat) => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      active: cat.active,
    })),
  ])

  // Products transformed for UI
  const products = computed(() =>
    productsData.value.map((product) => ({
      id: product._id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.images?.[0] || '', // Main image
      imageHover: product.images?.[1] || product.images?.[0] || '', // Hover image
      images: product.images || [], // All images
      category: product.category?._id || product.category,
      categoryId: product.category?._id || product.category,
      collectionIds: product.collectionIds || [],
      variants: product.variants || [],
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      tags: product.tags || [],
      active: product.active,
      featured: product.featured,
      stock: product.stock || 0,
      sold: product.sold || 0,
    })),
  )

  // Collections (empty for now, can be added later)
  const collections = computed(() => collectionsData.value)

  // These are kept as empty arrays since they're not used in the current implementation
  const customers = computed(() => [])
  const orders = computed(() => [])
  const users = computed(() => [])
  const payments = computed(() => [])
  const shippingMethods = computed(() => [])
  const paymentMethods = computed(() => [])
  const vouchers = computed(() => [])
  const reviews = computed(() => [])
  const settings = computed(() => ({}))

  // Helper functions
  const getCategoryById = (id) => {
    return categories.value.find((cat) => cat.id === id)
  }

  const getCategoryBySlug = (slug) => {
    return categories.value.find((cat) => cat.slug === slug)
  }

  const getProductById = (id) => {
    return products.value.find((product) => product.id === id)
  }

  const getProductBySlug = (slug) => {
    return products.value.find((product) => product.slug === slug)
  }

  const getProductsByCategory = (categoryId) => {
    if (categoryId === 0) return products.value // All products
    return products.value.filter((product) => product.categoryId === categoryId)
  }

  const getProductsByCollection = (collectionId) => {
    return products.value.filter((product) => product.collectionIds.includes(collectionId))
  }

  const getFeaturedProducts = () => {
    return products.value.filter((product) => product.featured)
  }

  const getCollectionById = (id) => {
    return collections.value.find((collection) => collection.id === id)
  }

  const getCollectionBySlug = (slug) => {
    return collections.value.find((collection) => collection.slug === slug)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-') // Replace multiple - with single -
      .trim()
  }

  return {
    // Data
    categories,
    products,
    collections,
    customers,
    orders,
    users,
    payments,
    shippingMethods,
    paymentMethods,
    vouchers,
    reviews,
    settings,

    // State
    isLoading,
    error,
    fetchData,

    // Helper functions
    getCategoryById,
    getCategoryBySlug,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getProductsByCollection,
    getFeaturedProducts,
    getCollectionById,
    getCollectionBySlug,
    formatPrice,
    createSlug,
  }
}
