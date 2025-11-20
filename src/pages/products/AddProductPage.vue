<template>
  <!-- Skeleton Loading -->

  <!-- Main Content -->
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <q-btn icon="arrow_back" flat round @click="$router.push('/admin/products')" />
        <div>
          <div class="text-3xl font-bold text-gray-800">
            {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
          </div>
          <p class="text-gray-600 mt-1">
            {{
              isEditMode ? 'Update product information' : 'Create a new product in your inventory'
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Basic Information</div>
          <div>
            <q-input
              v-model="form.name"
              outlined
              dense
              label="Product Name *"
              placeholder="Enter product name"
              :rules="[(val) => !!val || 'Product name is required']"
            />

            <div class="grid sm:grid-cols-2 gap-4">
              <q-input
                v-model="form.sku"
                outlined
                dense
                label="SKU"
                placeholder="Enter SKU (e.g., SHIRT-001)"
              />

              <q-select
                v-model="form.category"
                :options="categories"
                outlined
                dense
                label="Categories *"
                use-input
                input-debounce="300"
                @filter="filterCategoryOptions"
                :rules="[(val) => !!val || 'At least one category is required']"
                multiple
                use-chips
                counter
                max-values="5"
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
            </div>

            <q-editor
              v-model="form.description"
              min-height="5rem"
              :toolbar="[
                ['bold', 'italic', 'underline'],
                ['unordered', 'ordered'],
                ['undo', 'redo'],
              ]"
            />
          </div>
        </div>

        <!-- Pricing & Inventory -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Pricing & Inventory</div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <q-input
              v-model.number="form.price"
              outlined
              dense
              type="number"
              label="Price *"
              suffix="₫"
              :rules="[(val) => val > 0 || 'Price must be greater than 0']"
            />

            <q-input
              v-model.number="form.originalPrice"
              outlined
              dense
              type="number"
              label="Original Price"
              suffix="₫"
              hint="Auto-calculated based on price and discount"
              readonly
              bg-color="grey-2"
            />

            <q-input
              v-model.number="form.discount"
              outlined
              dense
              type="number"
              label="Discount %"
              suffix="%"
              :rules="[(val) => (val >= 0 && val <= 100) || 'Discount must be 0-100']"
              hint="Discount percentage (0-100)"
            />

            <q-input
              v-model.number="form.stock"
              outlined
              dense
              type="number"
              label="Stock Quantity *"
              :rules="[(val) => val >= 0 || 'Stock must be 0 or greater']"
            />
          </div>

          <div v-if="form.price && form.discount > 0" class="mt-4 p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-700 space-y-1">
              <div>
                <span class="font-semibold">Original Price (Rounded):</span>
                <span class="text-lg font-bold text-gray-900 ml-2">
                  {{ formatVND(form.originalPrice) }}
                </span>
              </div>
              <div>
                <span class="font-semibold">Current Price (after {{ form.discount }}% off):</span>
                <span class="text-lg font-bold text-green-600 ml-2">{{
                  formatVND(form.price)
                }}</span>
              </div>
              <div class="text-red-600 font-medium">
                <span class="font-semibold">You save:</span>
                {{ formatVND((form.originalPrice || 0) - (form.price || 0)) }}
              </div>
            </div>
          </div>
          <div v-else-if="form.price && !form.discount" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">
              <i class="ti ti-info-circle"></i>
              Enter a discount percentage to see the original price calculation
            </div>
          </div>
        </div>

        <!-- Product Images -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Product Images</div>

          <div class="space-y-4">
            <q-file
              v-model="imageFile"
              outlined
              dense
              label="Main Image *"
              accept="image/*"
              @update:model-value="handleMainImageUpload"
              :rules="[(val) => !!form.thumbnail || 'Main image is required']"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>

            <div v-if="form.thumbnail" class="flex justify-center">
              <img
                :src="form.thumbnail"
                alt="Product preview"
                class="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            </div>

            <q-file
              v-model="additionalImageFiles"
              outlined
              dense
              label="Gallery Images"
              accept="image/*"
              multiple
              @update:model-value="handleAdditionalImageUpload"
            >
              <template v-slot:prepend>
                <q-icon name="photo_library" />
              </template>
            </q-file>

            <div v-if="form.images.length > 1" class="grid grid-cols-4 gap-4">
              <div v-for="(img, index) in form.images.slice(1)" :key="index" class="relative group">
                <img :src="img" alt="Gallery image" class="w-full h-24 object-cover rounded-lg" />
                <q-btn
                  icon="close"
                  size="xs"
                  round
                  color="negative"
                  class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="removeImage(index + 1)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Product Variants -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Product Variants</div>

          <div class="space-y-4">
            <!-- Toggle for variants -->
            <div class="p-4 bg-blue-50 rounded-lg">
              <q-toggle
                v-model="form.hasVariants"
                label="This product has variants (Size & Color)"
                color="primary"
                class="font-medium"
              />
              <p class="text-sm text-gray-600 mt-2 ml-10">
                Enable this to manage inventory by size and color combinations
              </p>
            </div>

            <!-- Variants Management -->
            <div v-if="form.hasVariants" class="space-y-4">
              <!-- Select Multiple Sizes -->
              <div
                class="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
              >
                <div class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <q-icon name="straighten" color="primary" size="20px" />
                  Select Sizes
                </div>
                <q-option-group
                  v-model="selectedSizes"
                  :options="sizeOptions.map((s) => ({ label: s, value: s }))"
                  type="checkbox"
                  inline
                  color="primary"
                  class="mb-3"
                />
                <q-btn
                  v-if="selectedSizes.length > 0"
                  icon="arrow_downward"
                  label="Create Forms for Selected Sizes"
                  color="primary"
                  unelevated
                  no-caps
                  @click="createSizeForms"
                  class="w-full !bg-gray-900 text-white hover:!bg-gray-700"
                />
              </div>

              <!-- Forms for Each Selected Size -->
              <div v-if="Object.keys(sizeFormsData).length > 0" class="space-y-4">
                <div class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <q-icon name="color_lens" color="primary" size="20px" />
                  Add Colors for Each Size
                </div>

                <div
                  v-for="size in Object.keys(sizeFormsData)"
                  :key="size"
                  class="p-4 bg-white rounded-lg border-2 border-blue-200"
                >
                  <!-- Size Header -->
                  <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                    <div class="flex items-center gap-2">
                      <q-badge color="primary" class="px-4 py-2 text-lg font-bold">
                        Size {{ size }}
                      </q-badge>
                      <span class="text-sm text-gray-600">
                        {{ sizeFormsData[size].length }} color(s)
                      </span>
                    </div>
                    <q-btn
                      icon="add_circle"
                      label="Add Color"
                      color="green"
                      dense
                      unelevated
                      size="sm"
                      @click="addColorRowToSize(size)"
                    />
                  </div>

                  <!-- Color Rows -->
                  <div class="space-y-2">
                    <div
                      v-for="(colorRow, index) in sizeFormsData[size]"
                      :key="index"
                      class="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded"
                    >
                      <div class="col-span-3">
                        <q-input
                          v-model="colorRow.name"
                          outlined
                          dense
                          label="Color Name"
                          placeholder="Navy Blue"
                        />
                      </div>
                      <div class="col-span-3">
                        <q-input
                          v-model="colorRow.hex"
                          outlined
                          dense
                          label="HEX Code"
                          placeholder="#001f3f"
                          :rules="[(val) => /^#[0-9A-Fa-f]{6}$/.test(val) || 'Invalid HEX']"
                          class="!pb-0"
                        >
                          <template v-slot:append>
                            <q-icon name="colorize" size="18px" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-color v-model="colorRow.hex" />
                              </q-popup-proxy>
                            </q-icon>
                            <div
                              class="w-6 h-6 rounded border border-gray-300 ml-2"
                              :style="{ backgroundColor: colorRow.hex || '#ffffff' }"
                            ></div>
                          </template>
                        </q-input>
                      </div>
                      <div class="col-span-2">
                        <q-input
                          v-model.number="colorRow.price"
                          outlined
                          dense
                          type="number"
                          label="Price"
                          prefix="$"
                          :placeholder="form.price?.toString() || '0'"
                        />
                      </div>
                      <div class="col-span-2">
                        <q-input
                          v-model.number="colorRow.stock"
                          outlined
                          dense
                          type="number"
                          label="Stock"
                          placeholder="0"
                        />
                      </div>
                      <div class="col-span-2 flex gap-1">
                        <q-btn
                          icon="content_copy"
                          flat
                          dense
                          round
                          color="blue"
                          size="sm"
                          @click="copyColorToAllSizes(colorRow)"
                        >
                          <q-tooltip>Copy to all sizes</q-tooltip>
                        </q-btn>
                        <q-btn
                          icon="delete"
                          flat
                          dense
                          round
                          color="negative"
                          size="sm"
                          @click="removeColorRow(size, index)"
                        >
                          <q-tooltip>Remove</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <!-- Add more color button inside -->
                  <q-btn
                    v-if="sizeFormsData[size].length === 0"
                    icon="add"
                    label="Add First Color"
                    color="primary"
                    outline
                    dense
                    class="w-full mt-2"
                    @click="addColorRowToSize(size)"
                  />
                </div>

                <!-- Save All Button -->
                <q-btn
                  icon="save"
                  :label="isLoading ? 'Saving...' : 'Save All Variants'"
                  color="positive"
                  unelevated
                  no-caps
                  class="w-full"
                  :loading="isLoading"
                  :disable="isLoading"
                  @click="saveAllVariants"
                >
                  <template v-slot:loading>
                    <q-spinner-dots />
                  </template>
                </q-btn>
              </div>

              <!-- Variants List by Size -->
              <div v-if="Object.keys(form.variants).length > 0" class="space-y-3">
                <div class="text-sm font-semibold text-gray-700 mb-2">
                  Variants Summary ({{ getTotalVariantsCount() }} items)
                </div>

                <div
                  v-for="(sizeData, size) in form.variants"
                  :key="size"
                  class="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <q-badge color="primary" class="px-4 py-2 text-base font-bold">
                        Size {{ size }}
                      </q-badge>
                      <span class="text-sm text-gray-600">
                        {{ sizeData.colors.length }} color{{
                          sizeData.colors.length > 1 ? 's' : ''
                        }}
                      </span>
                      <span class="text-sm font-semibold text-blue-600">
                        Total Stock: {{ getSizeStock(sizeData.colors) }}
                      </span>
                    </div>
                    <q-btn
                      icon="delete"
                      flat
                      dense
                      no-caps
                      color="negative"
                      @click="removeSize(size)"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      v-for="(color, index) in sizeData.colors"
                      :key="index"
                      class="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <div
                        class="w-8 h-8 rounded border-2 border-gray-300"
                        :style="{ backgroundColor: color.hex }"
                      ></div>
                      <div class="flex-1">
                        <div class="font-medium text-sm">{{ color.name }}</div>
                        <div class="text-xs text-gray-600">{{ color.hex }}</div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-green-600">
                          ${{ color.price || form.price || 0 }}
                        </div>
                        <div class="text-xs text-gray-600">Stock: {{ color.stock || 0 }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <q-icon name="inventory_2" size="56px" color="grey-4" />
                <p class="mt-3 font-medium">No variants added yet</p>
                <p class="text-sm">Select a size above to start adding color variants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Status -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Status</div>

          <div class="space-y-4">
            <div>
              <q-toggle v-model="form.isActive" label="Active Product" color="primary" />
            </div>

            <div>
              <q-toggle v-model="form.isFeatured" label="Featured Product" color="secondary" />
            </div>
          </div>
        </div>

        <!-- Specifications -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Specifications</div>

          <div class="space-y-4">
            <q-input
              v-model="form.specifications.material"
              outlined
              dense
              label="Material"
              placeholder="e.g., 100% Cotton"
            />

            <q-input
              v-model="form.specifications.origin"
              outlined
              dense
              label="Origin"
              placeholder="e.g., Vietnam"
            />

            <q-input
              v-model="form.specifications.weight"
              outlined
              dense
              label="Weight"
              placeholder="e.g., 0.5kg"
            />
          </div>
        </div>

        <!-- Collections & Tags -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Collections & Tags</div>

          <div class="space-y-4">
            <q-input
              v-model="form.collections"
              outlined
              dense
              label="Collections"
              placeholder="Enter collections separated by commas"
              hint="e.g., summer-collection, new-arrivals"
            />

            <q-input
              v-model="form.tags"
              outlined
              dense
              label="Tags"
              placeholder="Enter tags separated by commas"
              hint="e.g., summer, casual, trending"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="">
          <div class="grid gap-4 grid-cols-2">
            <q-btn
              :label="
                isLoading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Saving...'
                  : isEditMode
                    ? 'Update Product'
                    : 'Save Product'
              "
              :icon="isEditMode ? 'update' : 'save'"
              color="primary"
              unelevated
              no-caps
              class="w-full"
              :loading="isLoading"
              :disable="isLoading"
              @click="saveProduct"
            >
              <template v-slot:loading>
                <q-spinner-dots />
              </template>
            </q-btn>
            <q-btn
              label="Cancel"
              outline
              no-caps
              color="grey"
              class="w-full"
              @click="$router.push('/admin/products')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Loading state
const isLoading = ref(false)

// Check if in edit mode
const isEditMode = ref(false)
const productId = ref(null)

// Form data
const form = ref({
  name: '',
  sku: '',
  category: [],
  description: '',
  price: null,
  originalPrice: null,
  discount: 0,
  stock: 0,
  images: [],
  thumbnail: '',
  hasVariants: false,
  variants: {}, // Change to object: { size: { colors: [...] } }
  collections: '',
  tags: '',
  isFeatured: false,
  isActive: true,
  specifications: {
    material: '',
    origin: '',
    weight: '',
  },
})

const imageFile = ref(null)
const additionalImageFiles = ref([])

// Size and color options
const sizeOptions = ref([
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
])

// Selected sizes for multi-select
const selectedSizes = ref([])

// Forms data for each size: { size: [{ name, hex, price, stock }] }
const sizeFormsData = ref({})

// Options
const categories = ref([])
const allCategoryOptions = ref([])

// Load product data if in edit mode
onMounted(async () => {
  isLoading.value = true
  try {
    // Fetch categories
    await fetchCategories()

    if (route.params.id) {
      isEditMode.value = true
      productId.value = route.params.id
      await loadProductData(productId.value)
    }
  } finally {
    isLoading.value = false
  }
})

// Watch for changes in price and discount to auto-calculate originalPrice
watch(
  () => [form.value.price, form.value.discount],
  ([newPrice, newDiscount]) => {
    if (newPrice && newDiscount > 0) {
      // Calculate original price: price = originalPrice * (1 - discount/100)
      // Therefore: originalPrice = price / (1 - discount/100)
      const calculated = newPrice / (1 - newDiscount / 100)
      // Round to nearest 1000 VND
      form.value.originalPrice = Math.round(calculated / 1000) * 1000
    } else if (newPrice && (!newDiscount || newDiscount === 0)) {
      // If no discount, original price should be same as price or null
      form.value.originalPrice = null
    }
  },
  { deep: true },
)

// Format VND currency
const formatVND = (value) => {
  if (!value) return '0₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
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

const loadProductData = async (id) => {
  try {
    const token = localStorage.getItem('adminToken')
    const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success) {
      const product = response.data.data

      // Build variants object from backend variants array
      const variantsObj = {}
      if (product.variants && product.variants.length > 0) {
        // Group variants by size
        product.variants.forEach((variant) => {
          if (!variantsObj[variant.size]) {
            variantsObj[variant.size] = { colors: [] }
          }

          // Find color info from product.colors
          const colorInfo = product.colors?.find((c) => c.name === variant.color) || {
            name: variant.color,
            hex: '#000000',
          }

          variantsObj[variant.size].colors.push({
            name: variant.color,
            hex: colorInfo.hex,
            price: product.price || 0,
            stock: variant.stock || 0,
          })
        })
      } else if (
        product.sizes &&
        product.sizes.length > 0 &&
        product.colors &&
        product.colors.length > 0
      ) {
        // Fallback: build from sizes and colors if no variants
        product.sizes.forEach((size) => {
          variantsObj[size] = {
            colors: product.colors.map((color) => ({
              ...color,
              price: product.price || 0,
              stock: 0,
            })),
          }
        })
      }

      // Handle multiple categories
      let categoryValues = []
      if (Array.isArray(product.category)) {
        // If category is already an array
        categoryValues = product.category
          .map((cat) => {
            const catId = typeof cat === 'object' ? cat._id : cat
            const categoryOption = allCategoryOptions.value.find((opt) => opt.value === catId)
            return categoryOption || null
          })
          .filter(Boolean)
      } else if (product.category) {
        // If single category, convert to array
        const catId = typeof product.category === 'object' ? product.category._id : product.category
        const categoryOption = allCategoryOptions.value.find((opt) => opt.value === catId)
        if (categoryOption) {
          categoryValues = [categoryOption]
        }
      }

      form.value = {
        name: product.name,
        sku: product.sku || '',
        category: categoryValues,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice || null,
        discount: product.discount || 0,
        stock: product.stock || 0,
        images: product.images || [],
        thumbnail: product.thumbnail || product.images?.[0] || '',
        hasVariants: Object.keys(variantsObj).length > 0,
        variants: variantsObj,
        collections: product.collections?.join(', ') || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== false,
        specifications: {
          material: product.specifications?.material || '',
          origin: product.specifications?.origin || '',
          weight: product.specifications?.weight || '',
        },
      }

      // Populate sizeFormsData and selectedSizes for editing
      if (form.value.hasVariants && Object.keys(form.value.variants).length > 0) {
        selectedSizes.value = Object.keys(form.value.variants)
        sizeFormsData.value = {}
        Object.entries(form.value.variants).forEach(([size, sizeData]) => {
          sizeFormsData.value[size] = sizeData.colors.map((c) => ({ ...c }))
        })
      }

      $q.notify({
        type: 'info',
        message: `Loaded product: ${product.name}`,
        position: 'top',
        timeout: 1500,
      })
    }
  } catch (error) {
    console.error('Load product error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to load product',
      position: 'top',
    })
    router.push('/admin/products')
  }
}

// Handle image upload
const handleMainImageUpload = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.thumbnail = e.target.result
      if (!form.value.images.includes(e.target.result)) {
        form.value.images.unshift(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }
}

const handleAdditionalImageUpload = (files) => {
  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!form.value.images.includes(e.target.result)) {
        form.value.images.push(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
  if (index === 0 && form.value.images.length > 0) {
    form.value.thumbnail = form.value.images[0]
  } else if (form.value.images.length === 0) {
    form.value.thumbnail = ''
  }
}

// Handle variants - New multi-size functions
const createSizeForms = () => {
  const newForms = {}
  selectedSizes.value.forEach((size) => {
    if (!sizeFormsData.value[size]) {
      newForms[size] = [
        {
          name: '',
          hex: '#000000',
          price: form.value.price || null,
          stock: 0,
        },
      ]
    } else {
      newForms[size] = sizeFormsData.value[size]
    }
  })
  sizeFormsData.value = newForms
  $q.notify({
    type: 'positive',
    message: `Forms created for ${selectedSizes.value.length} size(s)`,
    position: 'top',
  })
}

const addColorRowToSize = (size) => {
  if (!sizeFormsData.value[size]) {
    sizeFormsData.value[size] = []
  }
  sizeFormsData.value[size].push({
    name: '',
    hex: '#000000',
    price: form.value.price || null,
    stock: 0,
  })
}

const removeColorRow = (size, index) => {
  sizeFormsData.value[size].splice(index, 1)
}

const copyColorToAllSizes = (colorRow) => {
  Object.keys(sizeFormsData.value).forEach((size) => {
    const exists = sizeFormsData.value[size].find((c) => c.hex === colorRow.hex)
    if (!exists) {
      sizeFormsData.value[size].push({ ...colorRow })
    }
  })
  $q.notify({
    type: 'positive',
    message: `Color copied to all sizes`,
    position: 'top',
  })
}

const saveAllVariants = () => {
  // Validate all forms
  let hasError = false
  Object.entries(sizeFormsData.value).forEach(([, colors]) => {
    colors.forEach((color) => {
      if (!color.name || !color.hex || !/^#[0-9A-Fa-f]{6}$/.test(color.hex)) {
        hasError = true
      }
    })
  })

  if (hasError) {
    $q.notify({
      type: 'negative',
      message: 'Please fill all color fields with valid data',
      position: 'top',
    })
    return
  }

  // Save to form.variants
  form.value.variants = {}
  Object.entries(sizeFormsData.value).forEach(([size, colors]) => {
    form.value.variants[size] = {
      colors: colors.map((c) => ({
        name: c.name,
        hex: c.hex,
        price: c.price || form.value.price || 0,
        stock: c.stock || 0,
      })),
    }
  })

  $q.notify({
    type: 'positive',
    message: `All variants saved! Total: ${getTotalVariantsCount()} items`,
    position: 'top',
    timeout: 2000,
  })
}

const removeSize = (size) => {
  delete form.value.variants[size]
  delete sizeFormsData.value[size]
  selectedSizes.value = selectedSizes.value.filter((s) => s !== size)
  $q.notify({
    type: 'info',
    message: `Size ${size} removed`,
    position: 'top',
  })
}

const getSizeStock = (colors) => {
  return colors.reduce((sum, color) => sum + (color.stock || 0), 0)
}

const getTotalVariantsCount = () => {
  let count = 0
  Object.values(form.value.variants).forEach((sizeData) => {
    count += sizeData.colors.length
  })
  return count
}

const saveProduct = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const token = localStorage.getItem('adminToken')

    // Prepare collections and tags arrays
    const collections = form.value.collections
      ? form.value.collections
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : []
    const tags = form.value.tags
      ? form.value.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    // Extract unique sizes and colors from variants object
    let sizes = []
    let colors = []
    let totalStock = form.value.stock || 0
    let variants = []

    if (form.value.hasVariants && Object.keys(form.value.variants).length > 0) {
      sizes = Object.keys(form.value.variants)
      const colorMap = new Map()

      // Build variants array and calculate total stock
      Object.entries(form.value.variants).forEach(([size, sizeData]) => {
        sizeData.colors.forEach((color) => {
          // Add to variants array
          variants.push({
            size: size,
            color: color.name,
            stock: color.stock || 0,
            sku: `${form.value.sku || 'PROD'}-${size}-${color.name.replace(/\s+/g, '-').toUpperCase()}`,
          })

          totalStock += color.stock || 0
          if (!colorMap.has(color.hex)) {
            colorMap.set(color.hex, {
              name: color.name,
              hex: color.hex,
            })
          }
        })
      })

      colors = Array.from(colorMap.values())
    }

    // Extract category IDs from selected options
    const categoryIds = Array.isArray(form.value.category)
      ? form.value.category.map((cat) => (typeof cat === 'object' ? cat.value : cat))
      : []

    // Prepare product data matching Product model
    const productData = {
      name: form.value.name,
      sku: form.value.sku || undefined,
      description: form.value.description,
      price: form.value.price,
      originalPrice: form.value.originalPrice || null,
      discount: form.value.discount || 0,
      category: categoryIds, // Send as array
      images: form.value.images,
      thumbnail: form.value.thumbnail || form.value.images[0],
      sizes,
      colors,
      variants,
      collections,
      tags,
      stock: form.value.hasVariants ? totalStock : form.value.stock || 0,
      isFeatured: form.value.isFeatured,
      isActive: form.value.isActive,
      specifications: {
        material: form.value.specifications.material || '',
        origin: form.value.specifications.origin || '',
        weight: form.value.specifications.weight || '',
      },
    }

    console.log('Product Data to save:', productData)
    console.log('Category values:', form.value.category)
    console.log('Category IDs:', productData.category)

    let response
    if (isEditMode.value) {
      // Update existing product
      response = await axios.put(
        `http://localhost:5000/api/products/${productId.value}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } else {
      // Create new product
      response = await axios.post('http://localhost:5000/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    if (response.data.success) {
      const message = isEditMode.value
        ? 'Product updated successfully!'
        : 'Product created successfully!'

      $q.notify({
        type: 'positive',
        message: message,
        position: 'top',
      })

      setTimeout(() => {
        router.push('/admin/products')
      }, 1000)
    }
  } catch (error) {
    console.error('Save product error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save product',
      position: 'top',
    })
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  if (!form.value.name) {
    $q.notify({ type: 'negative', message: 'Product name is required', position: 'top' })
    return false
  }
  if (!form.value.category || form.value.category.length === 0) {
    $q.notify({ type: 'negative', message: 'At least one category is required', position: 'top' })
    return false
  }
  if (!form.value.price || form.value.price <= 0) {
    $q.notify({ type: 'negative', message: 'Valid price is required', position: 'top' })
    return false
  }
  if (!form.value.thumbnail) {
    $q.notify({ type: 'negative', message: 'Main image is required', position: 'top' })
    return false
  }
  return true
}
</script>
