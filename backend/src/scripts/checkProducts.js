import mongoose from 'mongoose'
import Product from '../models/Product.js'
import dotenv from 'dotenv'

dotenv.config()

const checkProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB\n')

    // Get all products without any filter and without populate
    const allProducts = await Product.find({})
    console.log(`Total products in database: ${allProducts.length}\n`)

    if (allProducts.length === 0) {
      console.log('No products found in database!')
    } else {
      allProducts.forEach((product, index) => {
        console.log(`\n--- Product ${index + 1} ---`)
        console.log('ID:', product._id)
        console.log('Name:', product.name)
        console.log('SKU:', product.sku)
        console.log('Slug:', product.slug)
        console.log('Price:', product.price)
        console.log('Category ID:', product.category)
        console.log('Images:', product.images?.length || 0)
        console.log('Sizes:', product.sizes)
        console.log('Colors:', product.colors?.length || 0)
        console.log('isActive:', product.isActive)
        console.log('Stock:', product.stock)
        console.log('Created:', product.createdAt)
      })
    }

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkProducts()
