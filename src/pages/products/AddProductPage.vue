<template>
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

          <div class="space-y-4">
            <q-input
              v-model="form.name"
              outlined
              label="Product Name *"
              placeholder="Enter product name"
              :rules="[(val) => !!val || 'Product name is required']"
            />

            <q-input
              v-model="form.sku"
              outlined
              label="SKU *"
              placeholder="Enter SKU code"
              :rules="[(val) => !!val || 'SKU is required']"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <q-select
                v-model="form.category"
                :options="categories"
                outlined
                label="Category *"
                :rules="[(val) => !!val || 'Category is required']"
              />

              <q-select
                v-model="form.brand"
                :options="brands"
                outlined
                label="Brand"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                @new-value="createBrand"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No results </q-item-section>
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
              type="number"
              label="Price *"
              prefix="$"
              :rules="[(val) => val > 0 || 'Price must be greater than 0']"
            />

            <q-input
              v-model.number="form.comparePrice"
              outlined
              type="number"
              label="Compare at Price"
              prefix="$"
              hint="Original price for discount display"
            />

            <q-input
              v-model.number="form.cost"
              outlined
              type="number"
              label="Cost per Item"
              prefix="$"
              hint="Profit margin will be calculated"
            />

            <q-input
              v-model.number="form.stock"
              outlined
              type="number"
              label="Stock Quantity *"
              :rules="[(val) => val >= 0 || 'Stock must be 0 or greater']"
            />
          </div>

          <div v-if="form.price && form.cost" class="mt-4 p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-700">
              <span class="font-semibold">Profit Margin:</span>
              ${{ (form.price - form.cost).toFixed(2) }} ({{
                (((form.price - form.cost) / form.price) * 100).toFixed(1)
              }}%)
            </div>
          </div>
        </div>

        <!-- Product Images -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Product Images</div>

          <div class="space-y-4">
            <q-input
              v-model="form.image"
              outlined
              label="Main Image URL *"
              placeholder="https://example.com/image.jpg"
              :rules="[(val) => !!val || 'Main image is required']"
            />

            <div v-if="form.image" class="flex justify-center">
              <img
                :src="form.image"
                alt="Product preview"
                class="w-48 h-48 object-cover rounded-lg shadow-md"
                @error="imageError = true"
              />
            </div>

            <q-input
              v-model="additionalImageUrl"
              outlined
              label="Additional Image URL"
              placeholder="https://example.com/image.jpg"
            >
              <template v-slot:append>
                <q-btn
                  icon="add"
                  flat
                  round
                  color="primary"
                  @click="addImage"
                  :disable="!additionalImageUrl"
                />
              </template>
            </q-input>

            <div v-if="form.additionalImages.length" class="grid grid-cols-4 gap-4">
              <div
                v-for="(img, index) in form.additionalImages"
                :key="index"
                class="relative group"
              >
                <img
                  :src="img"
                  alt="Additional image"
                  class="w-full h-24 object-cover rounded-lg"
                />
                <q-btn
                  icon="close"
                  size="xs"
                  round
                  color="negative"
                  class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="removeImage(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- SEO & Meta -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">SEO & Meta Information</div>

          <div class="space-y-4">
            <q-input
              v-model="form.metaTitle"
              outlined
              label="Meta Title"
              placeholder="SEO title for search engines"
              counter
              maxlength="60"
            />

            <q-input
              v-model="form.metaDescription"
              outlined
              type="textarea"
              label="Meta Description"
              placeholder="SEO description for search engines"
              counter
              maxlength="160"
              rows="3"
            />

            <q-input
              v-model="form.tags"
              outlined
              label="Tags"
              placeholder="Enter tags separated by commas"
              hint="e.g., summer, casual, trending"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Status -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Status</div>

          <q-select
            v-model="form.status"
            :options="statusOptions"
            outlined
            label="Product Status"
          />

          <div class="mt-4">
            <q-toggle v-model="form.featured" label="Featured Product" color="primary" />
          </div>
        </div>

        <!-- Product Variants -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Variants</div>

          <div class="space-y-4">
            <q-checkbox
              v-model="form.hasVariants"
              label="This product has variants"
              color="primary"
            />

            <div v-if="form.hasVariants" class="space-y-3">
              <q-select
                v-model="selectedVariantType"
                :options="variantTypes"
                outlined
                label="Add Variant Type"
                dense
              >
                <template v-slot:append>
                  <q-btn
                    icon="add"
                    flat
                    round
                    dense
                    color="primary"
                    @click="addVariant"
                    :disable="!selectedVariantType"
                  />
                </template>
              </q-select>

              <div
                v-for="(variant, index) in form.variants"
                :key="index"
                class="flex items-center gap-2"
              >
                <q-chip
                  :label="variant"
                  removable
                  @remove="removeVariant(index)"
                  color="primary"
                  text-color="white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-xl font-bold text-gray-800 mb-4">Shipping</div>

          <div class="space-y-4">
            <q-input
              v-model.number="form.weight"
              outlined
              type="number"
              label="Weight"
              suffix="kg"
              dense
            />

            <div class="grid grid-cols-3 gap-2">
              <q-input
                v-model.number="form.dimensions.length"
                outlined
                type="number"
                label="Length"
                suffix="cm"
                dense
              />
              <q-input
                v-model.number="form.dimensions.width"
                outlined
                type="number"
                label="Width"
                suffix="cm"
                dense
              />
              <q-input
                v-model.number="form.dimensions.height"
                outlined
                type="number"
                label="Height"
                suffix="cm"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="space-y-3">
            <q-btn
              :label="isEditMode ? 'Update Product' : 'Save Product'"
              :icon="isEditMode ? 'update' : 'save'"
              color="primary"
              unelevated
              class="w-full"
              @click="saveProduct"
            />
            <q-btn
              label="Save as Draft"
              icon="draft"
              outline
              color="primary"
              class="w-full"
              @click="saveDraft"
            />
            <q-btn
              label="Cancel"
              outline
              color="grey"
              class="w-full"
              @click="$router.push('/products')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Check if in edit mode
const isEditMode = ref(false)
const productId = ref(null)

// Form data
const form = ref({
  name: '',
  sku: '',
  category: null,
  brand: null,
  description: '',
  price: null,
  comparePrice: null,
  cost: null,
  stock: 0,
  image: '',
  additionalImages: [],
  metaTitle: '',
  metaDescription: '',
  tags: '',
  status: 'Active',
  featured: false,
  hasVariants: false,
  variants: [],
  weight: null,
  dimensions: {
    length: null,
    width: null,
    height: null,
  },
})

const additionalImageUrl = ref('')
const selectedVariantType = ref(null)
const imageError = ref(false)

// Sample products data (in real app, this would come from API/store)
const sampleProducts = [
  {
    id: 1,
    name: 'Classic Denim Jacket',
    sku: 'CDJ-001',
    category: "Men's Wear",
    brand: "Levi's",
    description: '<p>A timeless classic denim jacket perfect for any casual occasion.</p>',
    price: 89.99,
    comparePrice: 120.0,
    cost: 45.0,
    stock: 145,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop',
    ],
    metaTitle: "Classic Denim Jacket - Men's Fashion",
    metaDescription: 'Shop our classic denim jacket - perfect for casual style',
    tags: 'denim, jacket, casual, men',
    featured: true,
    hasVariants: true,
    variants: ['Size - Medium', 'Size - Large', 'Color - Blue'],
    weight: 0.8,
    dimensions: {
      length: 60,
      width: 50,
      height: 5,
    },
  },
  {
    id: 2,
    name: 'Summer Floral Dress',
    sku: 'SFD-002',
    category: "Women's Wear",
    brand: 'Zara',
    description: '<p>Beautiful floral dress perfect for summer occasions.</p>',
    price: 129.99,
    comparePrice: 159.99,
    cost: 60.0,
    stock: 87,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop',
    additionalImages: [],
    metaTitle: 'Summer Floral Dress',
    metaDescription: 'Elegant summer floral dress for women',
    tags: 'dress, floral, summer, women',
    featured: false,
    hasVariants: false,
    variants: [],
    weight: 0.3,
    dimensions: {
      length: 90,
      width: 40,
      height: 2,
    },
  },
]

// Options
const categories = ref([
  "Men's Wear",
  "Women's Wear",
  'Footwear',
  'Accessories',
  'Basics',
  'Outerwear',
  'Sportswear',
  'Jewelry',
])

const brands = ref(['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gucci', 'Prada', "Levi's"])

const statusOptions = ref(['Active', 'Draft', 'Inactive'])

const variantTypes = ref([
  'Size - Small',
  'Size - Medium',
  'Size - Large',
  'Size - XL',
  'Color - Black',
  'Color - White',
  'Color - Blue',
  'Color - Red',
])

// Load product data if in edit mode
onMounted(() => {
  if (route.params.id) {
    isEditMode.value = true
    productId.value = parseInt(route.params.id)
    loadProductData(productId.value)
  }
})

const loadProductData = (id) => {
  // In real app, fetch from API
  const product = sampleProducts.find((p) => p.id === id)

  if (product) {
    form.value = {
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      cost: product.cost,
      stock: product.stock,
      image: product.image,
      additionalImages: [...product.additionalImages],
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      tags: product.tags,
      status: product.status,
      featured: product.featured,
      hasVariants: product.hasVariants,
      variants: [...product.variants],
      weight: product.weight,
      dimensions: { ...product.dimensions },
    }

    $q.notify({
      type: 'info',
      message: `Loaded product: ${product.name}`,
      position: 'top',
      timeout: 1500,
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'Product not found',
      position: 'top',
    })
    router.push('/products')
  }
}

// Methods
const createBrand = (val, done) => {
  if (val.length > 0) {
    if (!brands.value.includes(val)) {
      brands.value.push(val)
    }
    done(val, 'toggle')
  }
}

const addImage = () => {
  if (additionalImageUrl.value) {
    form.value.additionalImages.push(additionalImageUrl.value)
    additionalImageUrl.value = ''
  }
}

const removeImage = (index) => {
  form.value.additionalImages.splice(index, 1)
}

const addVariant = () => {
  if (selectedVariantType.value && !form.value.variants.includes(selectedVariantType.value)) {
    form.value.variants.push(selectedVariantType.value)
    selectedVariantType.value = null
  }
}

const removeVariant = (index) => {
  form.value.variants.splice(index, 1)
}

const saveProduct = () => {
  if (!validateForm()) return

  // Simulate saving
  const message = isEditMode.value ? 'Product updated successfully!' : 'Product saved successfully!'

  $q.notify({
    type: 'positive',
    message: message,
    position: 'top',
  })

  setTimeout(() => {
    router.push('/products')
  }, 1000)
}

const saveDraft = () => {
  form.value.status = 'Draft'
  saveProduct()
}

const validateForm = () => {
  if (!form.value.name) {
    $q.notify({ type: 'negative', message: 'Product name is required', position: 'top' })
    return false
  }
  if (!form.value.sku) {
    $q.notify({ type: 'negative', message: 'SKU is required', position: 'top' })
    return false
  }
  if (!form.value.category) {
    $q.notify({ type: 'negative', message: 'Category is required', position: 'top' })
    return false
  }
  if (!form.value.price || form.value.price <= 0) {
    $q.notify({ type: 'negative', message: 'Valid price is required', position: 'top' })
    return false
  }
  if (!form.value.image) {
    $q.notify({ type: 'negative', message: 'Main image is required', position: 'top' })
    return false
  }
  return true
}
</script>
