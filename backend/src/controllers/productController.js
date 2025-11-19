import Product from '../models/Product.js'
import Category from '../models/Category.js'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      collections,
      search,
      sort = '-createdAt',
      page,
      limit,
    } = req.query

    // Build query
    const query = { isActive: true }

    if (category) {
      // Support filtering by category when products can have multiple categories
      query.category = { $in: [category] }
    }
    if (search) query.name = { $regex: search, $options: 'i' }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (sizes) query.sizes = { $in: sizes.split(',') }
    if (colors) query['colors.name'] = { $in: colors.split(',') }
    if (collections) query.collections = { $in: collections.split(',') }

    // Execute query with populate
    let productsQuery = Product.find(query).populate('category', 'name slug').sort(sort).lean()

    // Apply pagination only if params provided
    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit)
      productsQuery = productsQuery.limit(Number(limit)).skip(skip)
    }

    const products = await productsQuery // Return plain JS objects instead of Mongoose documents for better performance

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      data: products,
      pagination: {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : total,
        total,
        pages: limit ? Math.ceil(total / Number(limit)) : 1,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body }

    // Validate category exists if provided
    if (productData.category) {
      const categoryExists = await Category.findById(productData.category)
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
        })
      }
    }

    const product = await Product.create(productData)

    // Populate category for response
    await product.populate('category', 'name slug')

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body }

    // Validate category exists if provided
    if (productData.category) {
      const categoryExists = await Category.findById(productData.category)
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
        })
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .sort('-createdAt')
      .limit(8)

    res.json({
      success: true,
      data: products,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
