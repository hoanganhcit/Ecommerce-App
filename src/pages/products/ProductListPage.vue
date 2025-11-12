<template>
  <div class="p-6">
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
        />

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
                <span class="text-sm text-gray-700">{{ product.category }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-semibold text-gray-900"
                  >${{ product.price.toFixed(2) }}</span
                >
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
                    product.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'Draft'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ product.status }}
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// Data
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedStatus = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const categoryOptions = ref([
  "Men's Wear",
  "Women's Wear",
  'Footwear',
  'Accessories',
  'Basics',
  'Outerwear',
])

const statusOptions = ref(['Active', 'Draft', 'Inactive'])

const products = ref([
  {
    id: 1,
    name: 'Classic Denim Jacket',
    sku: 'CDJ-001',
    category: "Men's Wear",
    price: 89.99,
    stock: 145,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Summer Floral Dress',
    sku: 'SFD-002',
    category: "Women's Wear",
    price: 129.99,
    stock: 87,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Slim Fit Chinos',
    sku: 'SFC-003',
    category: "Men's Wear",
    price: 79.99,
    stock: 23,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&h=100&fit=crop',
  },
  {
    id: 4,
    name: 'Cotton T-Shirt Pack',
    sku: 'CTP-004',
    category: 'Basics',
    price: 49.99,
    stock: 0,
    status: 'Inactive',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
  },
  {
    id: 5,
    name: 'Leather Ankle Boots',
    sku: 'LAB-005',
    category: 'Footwear',
    price: 159.99,
    stock: 54,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop',
  },
  {
    id: 6,
    name: 'Wool Blend Coat',
    sku: 'WBC-006',
    category: 'Outerwear',
    price: 199.99,
    stock: 32,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&h=100&fit=crop',
  },
  {
    id: 7,
    name: 'Designer Sunglasses',
    sku: 'DSG-007',
    category: 'Accessories',
    price: 149.99,
    stock: 76,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop',
  },
  {
    id: 8,
    name: 'Canvas Sneakers',
    sku: 'CSN-008',
    category: 'Footwear',
    price: 69.99,
    stock: 12,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=100&h=100&fit=crop',
  },
  {
    id: 9,
    name: 'Silk Scarf',
    sku: 'SSC-009',
    category: 'Accessories',
    price: 39.99,
    stock: 98,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&h=100&fit=crop',
  },
  {
    id: 10,
    name: 'Leather Wallet',
    sku: 'LWL-010',
    category: 'Accessories',
    price: 59.99,
    stock: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
  },
])

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
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p.category === selectedCategory.value)
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
  $q.notify({
    type: 'info',
    message: `Viewing product: ${product.name}`,
    position: 'top',
  })
}

const deleteProduct = (product) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${product.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const index = products.value.findIndex((p) => p.id === product.id)
    if (index > -1) {
      products.value.splice(index, 1)
      $q.notify({
        type: 'positive',
        message: 'Product deleted successfully',
        position: 'top',
      })
    }
  })
}
</script>
