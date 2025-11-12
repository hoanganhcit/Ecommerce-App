import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        image: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: String,
        color: String,
        subtotal: Number,
      },
    ],
    customerInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank', 'momo', 'card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 30000,
    },
    discount: {
      type: Number,
      default: 0,
    },
    voucher: {
      code: String,
      type: String,
      value: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    notes: String,
    trackingNumber: String,
    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Generate order ID before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderId = `ORD${String(count + 1).padStart(3, '0')}`
  }
  next()
})

const Order = mongoose.model('Order', orderSchema)

export default Order
