import mongoose from 'mongoose'
import Category from '../models/Category.js'
import dotenv from 'dotenv'

dotenv.config()

const checkCategory = async (categoryId) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const category = await Category.findById(categoryId)

    if (category) {
      console.log('Category found:')
      console.log(JSON.stringify(category, null, 2))
    } else {
      console.log(`Category with ID ${categoryId} NOT FOUND`)
      console.log('\nAll categories:')
      const allCategories = await Category.find({})
      console.log(JSON.stringify(allCategories, null, 2))
    }

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

const categoryId = process.argv[2] || '6915646fbf6c859e4f0de5f2'
checkCategory(categoryId)
