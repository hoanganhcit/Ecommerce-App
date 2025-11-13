import mongoose from 'mongoose'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const promoteToAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Get email from command line argument
    const email = process.argv[2]

    if (!email) {
      console.log('Usage: node promoteAdmin.js <email>')
      process.exit(1)
    }

    const user = await User.findOne({ email })

    if (!user) {
      console.log(`User with email ${email} not found`)
      process.exit(1)
    }

    console.log('Current user:', {
      email: user.email,
      username: user.username,
      role: user.role,
    })

    user.role = 'admin'
    await user.save()

    console.log('✅ User promoted to admin successfully!')
    console.log('Updated user:', {
      email: user.email,
      username: user.username,
      role: user.role,
    })

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

promoteToAdmin()
