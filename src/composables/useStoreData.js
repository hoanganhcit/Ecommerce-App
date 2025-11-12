import { computed } from 'vue'
import storeData from 'src/data/store-data.json'

/**
 * Composable to access store data from JSON file
 */
export function useStoreData() {
  // Categories with "All Products" option
  const categories = computed(() => [
    { id: 0, name: 'Tất cả sản phẩm', slug: 'all' },
    ...storeData.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      active: cat.active,
    })),
  ])

  // Products transformed for UI
  const products = computed(() =>
    storeData.products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.images[0], // Main image
      imageHover: product.images[1] || product.images[0], // Hover image
      images: product.images, // All images
      category: product.categoryId,
      categoryId: product.categoryId,
      collectionIds: product.collectionIds,
      variants: product.variants,
      rating: product.rating,
      reviews: product.reviews,
      tags: product.tags,
      active: product.active,
      featured: product.featured,
    })),
  )

  // Collections
  const collections = computed(() =>
    storeData.collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      startDate: collection.startDate,
      endDate: collection.endDate,
      active: collection.active,
    })),
  )

  // Customers
  const customers = computed(() => storeData.customers)

  // Orders
  const orders = computed(() => storeData.orders)

  // Users
  const users = computed(() => storeData.users)

  // Payments
  const payments = computed(() => storeData.payments)

  // Shipping Methods
  const shippingMethods = computed(() => storeData.shippingMethods)

  // Payment Methods
  const paymentMethods = computed(() => storeData.paymentMethods)

  // Vouchers
  const vouchers = computed(() => storeData.vouchers)

  // Reviews
  const reviews = computed(() => storeData.reviews)

  // Settings
  const settings = computed(() => storeData.settings)

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
