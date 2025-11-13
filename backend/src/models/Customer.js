import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=1',
    },
    address: {
      type: String,
      trim: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'vip'],
      default: 'active',
    },
    lastOrder: Date,
    notes: String,
    tags: [String],
  },
  {
    timestamps: true,
  },
)

// Generate customer ID before saving
customerSchema.pre('save', async function (next) {
  if (!this.customerId) {
    const count = await mongoose.model('Customer').countDocuments()
    this.customerId = `CUST${String(count + 1).padStart(3, '0')}`
  }
  next()
})

// Hash password before saving
customerSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next()

  try {
    const bcrypt = await import('bcryptjs')
    const salt = await bcrypt.default.genSalt(10)
    this.password = await bcrypt.default.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password for login
customerSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = await import('bcryptjs')
  return await bcrypt.default.compare(candidatePassword, this.password)
}

// Virtual for average order value
customerSchema.virtual('averageOrderValue').get(function () {
  if (this.totalOrders === 0) return 0
  return this.totalSpent / this.totalOrders
})

customerSchema.set('toJSON', { virtuals: true })
customerSchema.set('toObject', { virtuals: true })

const Customer = mongoose.model('Customer', customerSchema)

export default Customer
