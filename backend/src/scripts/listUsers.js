import mongoose from 'mongoose'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const users = await User.find({}).select('email username role createdAt')

    console.log('\n📋 All Users:')
    console.log('─────────────────────────────────────────────────────────')
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   Username: ${user.username}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log('─────────────────────────────────────────────────────────')
    })

    console.log(`\nTotal users: ${users.length}`)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

listUsers()
