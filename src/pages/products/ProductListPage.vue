<template>
  <!-- Skeleton Loading -->
  <SkeletonProductList v-if="isLoading" />

  <!-- Main Content -->
  <div v-else class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-3xl font-bold text-gray-800">Products</div>
          <p class="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <q-btn
          label="Add Product"
          icon="add"
          color="primary"
          unelevated
          class="px-6"
          @click="$router.push('/admin/products/add')"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Products</p>
            <div class="text-3xl font-bold text-gray-900">{{ totalProducts }}</div>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <q-icon name="inventory_2" size="24px" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">In Stock</p>
            <div class="text-3xl font-bold text-gray-900">{{ inStockProducts }}</div>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <q-icon name="check_circle" size="24px" class="text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Low Stock</p>
            <div class="text-3xl font-bold text-gray-900">{{ lowStockProducts }}</div>
          </div>
          <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <q-icon name="warning" size="24px" class="text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Out of Stock</p>
            <div class="text-3xl font-bold text-gray-900">{{ outOfStockProducts }}</div>
          </div>
          <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <q-icon name="remove_circle" size="24px" class="text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Search products..."
          class="col-span-2"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="selectedCategory"
          :options="categoryOptions"
          outlined
          dense
          label="Category"
          clearable
          use-input
          input-debounce="300"
          @filter="filterCategoryOptions"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section
                :style="{ paddingLeft: scope.opt.level ? `${scope.opt.level * 16}px` : '0' }"
              >
                <q-item-label>
                  <span v-if="scope.opt.level">└─</span>
                  {{ scope.opt.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="selectedStatus"
          :options="statusOptions"
          outlined
          dense
          label="Status"
          clearable
        />
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-12 h-12 rounded-lg object-cover"
                    @error="(e) => (e.target.src = 'https://via.placeholder.com/100')"
                  />
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">SKU: {{ product.sku }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(cat, index) in getCategoryBadges(product)"
                    :key="index"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ cat }}
                  </span>
                  <span
                    v-if="!product.category || product.category === 'N/A'"
                    class="text-sm text-gray-500"
                    >N/A</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-semibold text-gray-900">{{
                  formatVND(product.price)
                }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="[
                    'text-sm font-medium',
                    product.stock > 50
                      ? 'text-green-600'
                      : product.stock > 0
                        ? 'text-orange-600'
                        : 'text-red-600',
                  ]"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ product.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <q-btn
                    icon="edit"
                    size="sm"
                    flat
                    round
                    color="primary"
                    @click="editProduct(product)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="visibility"
                    size="sm"
                    flat
                    round
                    color="info"
                    @click="viewProduct(product)"
                  >
                    <q-tooltip>View</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click="deleteProduct(product)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProducts.length }} products
        </div>
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="5"
          direction-links
          boundary-links
          color="primary"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import SkeletonProductList from '../../components/admin/SkeletonProductList.vue'

const router = useRouter()
const $q = useQuasar()

// Data
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedStatus = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const products = ref([])
const categories = ref([])
const allCategoryOptions = ref([])
const isLoading = ref(true)

const statusOptions = ref(['active', 'inactive'])

// Fetch data from API
const fetchProducts = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('adminToken')
    const response = await axios.get('http://localhost:5000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success) {
      products.value = response.data.data.map((p) => {
        // Handle multiple categories
        let categoryDisplay = 'N/A'
        let categoryIds = []

        // Check if category is an array (multiple categories)
        if (p.category && Array.isArray(p.category) && p.category.length > 0) {
          categoryDisplay = p.category
            .map((cat) => {
              if (typeof cat === 'object' && cat !== null) {
                return cat.name || 'Unknown'
              }
              return cat
            })
            .filter((name) => name && name !== 'Unknown')
            .join(', ')

          if (!categoryDisplay) categoryDisplay = 'N/A'

          categoryIds = p.category
            .map((cat) => {
              if (typeof cat === 'object' && cat !== null) {
                return cat._id || cat.id
              }
              return cat
            })
            .filter((id) => id)
        }
        // Check if categories field exists (alternative field name)
        else if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
          categoryDisplay = p.categories
            .map((cat) => {
              if (typeof cat === 'object' && cat !== null) {
                return cat.name || 'Unknown'
              }
              return cat
            })
            .filter((name) => name && name !== 'Unknown')
            .join(', ')

          if (!categoryDisplay) categoryDisplay = 'N/A'

          categoryIds = p.categories
            .map((cat) => {
              if (typeof cat === 'object' && cat !== null) {
                return cat._id || cat.id
              }
              return cat
            })
            .filter((id) => id)
        }
        // Single category object (old format)
        else if (p.category && typeof p.category === 'object' && !Array.isArray(p.category)) {
          categoryDisplay = p.category.name || 'N/A'
          categoryIds = [p.category._id || p.category.id].filter((id) => id)
        }
        // Single category string (ID only)
        else if (p.category && typeof p.category === 'string') {
          categoryDisplay = p.category
          categoryIds = [p.category]
        }

        return {
          id: p._id,
          name: p.name,
          sku: p.sku,
          category: categoryDisplay,
          categoryIds: categoryIds,
          rawCategories: p.category && Array.isArray(p.category) ? p.category : p.categories || [],
          price: p.price,
          stock: p.stock,
          status: p.isActive ? 'active' : 'inactive',
          image: p.images?.[0] || '',
        }
      })
    }
  } catch (error) {
    console.error('Fetch products error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to load products',
      position: 'top',
    })
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/categories')
    if (response.data.success) {
      const buildHierarchy = (parentId = null, level = 0) => {
        return response.data.data
          .filter((c) => {
            if (parentId === null) return !c.parent
            return c.parent?._id === parentId || c.parent === parentId
          })
          .flatMap((c) => [
            { label: c.name, value: c._id, level },
            ...buildHierarchy(c._id, level + 1),
          ])
      }

      allCategoryOptions.value = buildHierarchy()
      categories.value = [...allCategoryOptions.value]
    }
  } catch (error) {
    console.error('Fetch categories error:', error)
  }
}

// Mount
onMounted(() => {
  fetchProducts()
  fetchCategories()
})

// Computed for category options
const categoryOptions = computed(() => categories.value)

// Filter function for categories
const filterCategoryOptions = (val, update) => {
  update(() => {
    if (val === '') {
      categories.value = [...allCategoryOptions.value]
    } else {
      const needle = val.toLowerCase()
      categories.value = allCategoryOptions.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}

// Computed
const totalProducts = computed(() => products.value.length)
const inStockProducts = computed(() => products.value.filter((p) => p.stock > 50).length)
const lowStockProducts = computed(
  () => products.value.filter((p) => p.stock > 0 && p.stock <= 50).length,
)
const outOfStockProducts = computed(() => products.value.filter((p) => p.stock === 0).length)

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query)
      const skuMatch = p.sku?.toLowerCase().includes(query)

      // Search in category display string (which includes all categories)
      const categoryMatch = p.category?.toLowerCase().includes(query)

      return nameMatch || skuMatch || categoryMatch
    })
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter((p) => {
      // Check if selected category ID is in the categoryIds array
      return p.categoryIds && p.categoryIds.includes(selectedCategory.value)
    })
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter((p) => p.status === selectedStatus.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, filteredProducts.value.length),
)

// Methods
const editProduct = (product) => {
  router.push(`/admin/products/edit/${product.id}`)
}

const viewProduct = (product) => {
  router.push(`/admin/products/view/${product.id}`)
}

const deleteProduct = (product) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${product.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.delete(`http://localhost:5000/api/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        // Remove from local list
        const index = products.value.findIndex((p) => p.id === product.id)
        if (index > -1) {
          products.value.splice(index, 1)
        }

        $q.notify({
          type: 'positive',
          message: 'Product deleted successfully',
          position: 'top',
        })
      }
    } catch (error) {
      console.error('Delete product error:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to delete product',
        position: 'top',
      })
    }
  })
}

const getCategoryBadges = (product) => {
  if (!product.category || product.category === 'N/A') {
    return []
  }
  // Ensure it's a string before splitting
  const categoryStr =
    typeof product.category === 'string' ? product.category : String(product.category)
  return categoryStr
    .split(',')
    .map((cat) => cat.trim())
    .filter((cat) => cat && cat !== 'N/A')
}

const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}
</script>
