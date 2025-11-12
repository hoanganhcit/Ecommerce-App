import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['men', 'women', 'kids', 'accessories', 'sale'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    thumbnail: {
      type: String,
    },
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44'],
      },
    ],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    collections: [String],
    tags: [String],
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    specifications: {
      material: String,
      brand: String,
      origin: String,
      weight: String,
    },
  },
  {
    timestamps: true,
  },
)

// Create slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

// Virtual for discount price
productSchema.virtual('discountPrice').get(function () {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100)
  }
  return this.price
})

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

const Product = mongoose.model('Product', productSchema)

export default Product
