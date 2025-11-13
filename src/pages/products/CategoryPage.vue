<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-3xl font-bold text-gray-800">Categories</div>
          <p class="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <q-btn
          label="Add Category"
          icon="add"
          color="primary"
          unelevated
          class="px-6"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Categories</p>
            <div class="text-3xl font-bold text-gray-900">{{ categories.length }}</div>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <q-icon name="category" size="24px" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Active Categories</p>
            <div class="text-3xl font-bold text-gray-900">{{ activeCategories }}</div>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <q-icon name="check_circle" size="24px" class="text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Products</p>
            <div class="text-3xl font-bold text-gray-900">{{ totalProducts }}</div>
          </div>
          <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <q-icon name="inventory" size="24px" class="text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Avg. Products/Category</p>
            <div class="text-3xl font-bold text-gray-900">{{ avgProductsPerCategory }}</div>
          </div>
          <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <q-icon name="analytics" size="24px" class="text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <!-- Category Header -->
        <div class="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600">
          <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <q-icon :name="category.icon" size="48px" class="text-white" />
          </div>
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ category.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <!-- Category Info -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="text-xl font-bold text-gray-900 mb-1">{{ category.name }}</div>
              <p class="text-sm text-gray-600">{{ category.description || 'No description' }}</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-600 mb-1">Products</p>
              <p class="text-2xl font-bold text-blue-600">{{ category.productCount }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Parent Categories</p>

              <p v-if="category.parentName" class="text-xs text-blue-600 mt-1">
                <q-icon name="subdirectory_arrow_right" size="14px" />
                Parent: {{ category.parentName }}
              </p>
              <p v-else class="text-xs mt-1">None(Top Level)</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <q-btn
              label="Edit"
              icon="edit"
              outline
              color="primary"
              size="sm"
              class="flex-1"
              @click="editCategory(category)"
            />
            <q-btn
              icon="delete"
              outline
              color="negative"
              size="sm"
              @click="deleteCategory(category)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-div">{{ editMode ? 'Edit Category' : 'Add New Category' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="space-y-4">
            <q-input
              v-model="categoryForm.name"
              outlined
              label="Category Name *"
              :rules="[(val) => !!val || 'Category name is required']"
            />

            <q-input
              v-model="categoryForm.description"
              outlined
              type="textarea"
              label="Description"
              rows="3"
            />

            <q-select
              v-model="categoryForm.icon"
              :options="iconOptions"
              outlined
              label="Icon"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.value" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-model="categoryForm.parent"
              :options="parentCategories"
              outlined
              label="Parent Category"
              emit-value
              map-options
              use-input
              input-debounce="300"
              @filter="filterParentCategories"
              hint="Select parent category to create a subcategory"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section
                    :style="{ paddingLeft: scope.opt.level ? `${scope.opt.level * 20}px` : '0' }"
                  >
                    <q-item-label>
                      <span v-if="scope.opt.level">└─</span>
                      {{ scope.opt.label }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              v-model="categoryForm.order"
              outlined
              type="number"
              label="Display Order"
              hint="Display order (lower numbers appear first)"
              :rules="[
                (val) => val >= 1 || 'Order must be at least 1',
                (val) => Number.isInteger(Number(val)) || 'Order must be a whole number',
              ]"
              min="1"
              step="1"
            />

            <q-select
              v-model="categoryForm.active"
              :options="statusOptions"
              outlined
              label="Status"
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn label="Cancel" flat color="grey" @click="closeDialog" />
          <q-btn label="Save" color="primary" unelevated @click="saveCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()

// Data
const showAddDialog = ref(false)
const editMode = ref(false)
const isLoading = ref(false)
const categories = ref([])

const categoryForm = ref({
  name: '',
  description: '',
  slug: '',
  icon: 'category',
  parent: null,
  active: true,
  order: 1,
})

const statusOptions = ref([
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
])

const iconOptions = ref([
  { label: 'Category', value: 'category' },
  { label: 'Man', value: 'man' },
  { label: 'Woman', value: 'woman' },
  { label: 'Watch', value: 'watch' },
  { label: 'Clothing', value: 'checkroom' },
  { label: 'Winter', value: 'ac_unit' },
  { label: 'Sports', value: 'directions_run' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Kids', value: 'child_care' },
  { label: 'Bag', value: 'shopping_bag' },
  { label: 'Jewelry', value: 'diamond' },
])

// Computed
const activeCategories = computed(() => categories.value.filter((c) => c.active).length)
const totalProducts = computed(() =>
  categories.value.reduce((sum, c) => sum + (c.productCount || 0), 0),
)
const avgProductsPerCategory = computed(() =>
  categories.value.length > 0 ? Math.round(totalProducts.value / categories.value.length) : 0,
)

// Parent categories with hierarchy
const allParentCategories = computed(() => {
  const buildHierarchy = (parentId = null, level = 0) => {
    return categories.value
      .filter((c) => {
        if (parentId === null) return !c.parent
        return c.parent === parentId
      })
      .flatMap((c) => [{ label: c.name, value: c.id, level }, ...buildHierarchy(c.id, level + 1)])
  }

  return [{ label: 'None (Top Level)', value: null, level: 0 }, ...buildHierarchy()]
})

const parentCategories = ref([...allParentCategories.value])

// Filter function for parent categories
const filterParentCategories = (val, update) => {
  update(() => {
    if (val === '') {
      parentCategories.value = [...allParentCategories.value]
    } else {
      const needle = val.toLowerCase()
      parentCategories.value = allParentCategories.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}

// Fetch categories from API
const fetchCategories = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost:5000/api/categories')

    console.log('Fetch categories response:', response.data)

    // Backend returns { success: true, data: [...] }
    const categoriesData = response.data.data || response.data

    console.log('Categories data:', categoriesData)

    if (!Array.isArray(categoriesData)) {
      console.error('Categories data is not an array:', categoriesData)
      throw new Error('Invalid data format')
    }

    categories.value = categoriesData.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      icon: category.icon || 'category',
      parent: category.parent?._id || category.parent || null,
      parentName: category.parent?.name || null,
      productCount: category.productCount || 0,
      revenue: category.revenue || 0,
      active: category.active !== false,
      order: category.order || 0,
    }))

    console.log('Mapped categories:', categories.value)

    // Update parent categories dropdown
    parentCategories.value = [...allParentCategories.value]
  } catch (error) {
    console.error('Error fetching categories:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to load categories',
      position: 'top',
    })
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})

// Methods
const editCategory = (category) => {
  editMode.value = true
  categoryForm.value = {
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    icon: category.icon,
    parent: category.parent || null,
    active: category.active,
    order: category.order,
  }
  showAddDialog.value = true
}

const deleteCategory = (category) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${category.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`http://localhost:5000/api/categories/${category.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      $q.notify({
        type: 'positive',
        message: 'Category deleted successfully',
        position: 'top',
      })

      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to delete category',
        position: 'top',
      })
    }
  })
}

const saveCategory = async () => {
  if (!categoryForm.value.name) {
    $q.notify({
      type: 'negative',
      message: 'Category name is required',
      position: 'top',
    })
    return
  }

  try {
    const token = localStorage.getItem('adminToken')

    if (!token) {
      $q.notify({
        type: 'warning',
        message: 'Please login again to continue',
        position: 'top',
      })
      return
    }

    const categoryData = {
      name: categoryForm.value.name,
      description: categoryForm.value.description,
      slug: categoryForm.value.slug || categoryForm.value.name.toLowerCase().replace(/\s+/g, '-'),
      icon: categoryForm.value.icon,
      parent: categoryForm.value.parent || null,
      active: categoryForm.value.active,
      order: Math.max(1, categoryForm.value.order || 1),
    }

    console.log('Saving category:', { editMode: editMode.value, categoryData })

    if (editMode.value) {
      await axios.put(
        `http://localhost:5000/api/categories/${categoryForm.value.id}`,
        categoryData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      $q.notify({
        type: 'positive',
        message: 'Category updated successfully',
        position: 'top',
      })
    } else {
      const response = await axios.post('http://localhost:5000/api/categories', categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('Create response:', response.data)
      $q.notify({
        type: 'positive',
        message: 'Category created successfully',
        position: 'top',
      })
    }

    closeDialog()
    fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    console.error('Error response:', error.response?.data)

    let errorMessage = 'Failed to save category'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 401) {
      errorMessage = 'Not authorized. Please login again.'
    } else if (error.response?.status === 403) {
      errorMessage = 'Not authorized as admin. Please login again.'
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
    })
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editMode.value = false
  categoryForm.value = {
    name: '',
    description: '',
    slug: '',
    icon: 'category',
    parent: null,
    active: true,
    order: 1,
  }
}
</script>
