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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <!-- Category Image -->
        <div class="relative h-48 bg-gradient-to-br" :class="category.gradient">
          <img
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <q-icon :name="category.icon" size="64px" class="text-white" />
          </div>
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                category.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ category.status }}
            </span>
          </div>
        </div>

        <!-- Category Info -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="text-xl font-bold text-gray-900 mb-1">{{ category.name }}</div>
              <p class="text-sm text-gray-600">{{ category.description }}</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-600 mb-1">Products</p>
              <p class="text-2xl font-bold text-blue-600">{{ category.productCount }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Revenue</p>
              <p class="text-2xl font-bold text-green-600">
                ${{ (category.revenue / 1000).toFixed(1) }}k
              </p>
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
              label="View"
              icon="visibility"
              outline
              color="info"
              size="sm"
              class="flex-1"
              @click="viewCategory(category)"
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
              v-model="categoryForm.gradient"
              :options="gradientOptions"
              outlined
              label="Color Theme"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <div class="w-8 h-8 rounded" :class="scope.opt.value"></div>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              v-model="categoryForm.image"
              outlined
              label="Image URL"
              placeholder="https://example.com/image.jpg"
            />

            <q-select
              v-model="categoryForm.status"
              :options="statusOptions"
              outlined
              label="Status"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Data
const showAddDialog = ref(false)
const editMode = ref(false)

const categoryForm = ref({
  name: '',
  description: '',
  icon: 'category',
  gradient: 'from-blue-500 to-blue-600',
  image: '',
  status: 'Active',
})

const categories = ref([
  {
    id: 1,
    name: "Men's Wear",
    description: 'Stylish clothing for men',
    icon: 'man',
    gradient: 'from-blue-500 to-blue-600',
    productCount: 145,
    revenue: 45800,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: "Women's Wear",
    description: 'Elegant fashion for women',
    icon: 'woman',
    gradient: 'from-pink-500 to-pink-600',
    productCount: 187,
    revenue: 62300,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Footwear',
    description: 'Shoes and boots for all occasions',
    icon: 'styler',
    gradient: 'from-amber-500 to-amber-600',
    productCount: 98,
    revenue: 38900,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Accessories',
    description: 'Complete your look with accessories',
    icon: 'watch',
    gradient: 'from-purple-500 to-purple-600',
    productCount: 76,
    revenue: 24500,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Basics',
    description: 'Essential everyday wear',
    icon: 'checkroom',
    gradient: 'from-gray-500 to-gray-600',
    productCount: 132,
    revenue: 31200,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Outerwear',
    description: 'Jackets and coats for all seasons',
    icon: 'ac_unit',
    gradient: 'from-slate-500 to-slate-600',
    productCount: 54,
    revenue: 42700,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    name: 'Sportswear',
    description: 'Athletic and activewear',
    icon: 'directions_run',
    gradient: 'from-green-500 to-green-600',
    productCount: 89,
    revenue: 35600,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    name: 'Jewelry',
    description: 'Fine jewelry and accessories',
    icon: 'diamond',
    gradient: 'from-yellow-500 to-yellow-600',
    productCount: 43,
    revenue: 52100,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
  },
  {
    id: 9,
    name: 'Kids Wear',
    description: 'Clothing for children',
    icon: 'child_care',
    gradient: 'from-teal-500 to-teal-600',
    productCount: 67,
    revenue: 28400,
    status: 'Inactive',
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=300&fit=crop',
  },
])

const statusOptions = ref(['Active', 'Inactive'])

const iconOptions = ref([
  { label: 'Category', value: 'category' },
  { label: 'Man', value: 'man' },
  { label: 'Woman', value: 'woman' },
  { label: 'Shoes', value: 'styler' },
  { label: 'Watch', value: 'watch' },
  { label: 'Clothing', value: 'checkroom' },
  { label: 'Winter', value: 'ac_unit' },
  { label: 'Sports', value: 'directions_run' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Kids', value: 'child_care' },
])

const gradientOptions = ref([
  { label: 'Blue', value: 'from-blue-500 to-blue-600' },
  { label: 'Pink', value: 'from-pink-500 to-pink-600' },
  { label: 'Purple', value: 'from-purple-500 to-purple-600' },
  { label: 'Green', value: 'from-green-500 to-green-600' },
  { label: 'Amber', value: 'from-amber-500 to-amber-600' },
  { label: 'Red', value: 'from-red-500 to-red-600' },
  { label: 'Teal', value: 'from-teal-500 to-teal-600' },
  { label: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
  { label: 'Yellow', value: 'from-yellow-500 to-yellow-600' },
  { label: 'Gray', value: 'from-gray-500 to-gray-600' },
])

// Computed
const activeCategories = computed(
  () => categories.value.filter((c) => c.status === 'Active').length,
)
const totalProducts = computed(() => categories.value.reduce((sum, c) => sum + c.productCount, 0))
const avgProductsPerCategory = computed(() =>
  Math.round(totalProducts.value / categories.value.length),
)

// Methods
const editCategory = (category) => {
  editMode.value = true
  categoryForm.value = { ...category }
  showAddDialog.value = true
}

const viewCategory = (category) => {
  $q.notify({
    type: 'info',
    message: `Viewing category: ${category.name}`,
    position: 'top',
  })
}

const deleteCategory = (category) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${category.name}"? This will affect ${category.productCount} products.`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const index = categories.value.findIndex((c) => c.id === category.id)
    if (index > -1) {
      categories.value.splice(index, 1)
      $q.notify({
        type: 'positive',
        message: 'Category deleted successfully',
        position: 'top',
      })
    }
  })
}

const saveCategory = () => {
  if (!categoryForm.value.name) {
    $q.notify({
      type: 'negative',
      message: 'Category name is required',
      position: 'top',
    })
    return
  }

  if (editMode.value) {
    const index = categories.value.findIndex((c) => c.id === categoryForm.value.id)
    if (index > -1) {
      categories.value[index] = { ...categoryForm.value }
      $q.notify({
        type: 'positive',
        message: 'Category updated successfully',
        position: 'top',
      })
    }
  } else {
    categories.value.push({
      ...categoryForm.value,
      id: categories.value.length + 1,
      productCount: 0,
      revenue: 0,
    })
    $q.notify({
      type: 'positive',
      message: 'Category created successfully',
      position: 'top',
    })
  }

  closeDialog()
}

const closeDialog = () => {
  showAddDialog.value = false
  editMode.value = false
  categoryForm.value = {
    name: '',
    description: '',
    icon: 'category',
    gradient: 'from-blue-500 to-blue-600',
    image: '',
    status: 'Active',
  }
}
</script>
