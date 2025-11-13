import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    label: {
      type: String,
      required: [true, 'Vui lòng nhập nhãn địa chỉ'],
      trim: true,
    },
    receiverName: {
      type: String,
      required: [true, 'Vui lòng nhập tên người nhận'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'],
    },
    fullAddress: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ đầy đủ'],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure only one default address per customer
addressSchema.pre('save', async function (next) {
  if (this.isDefault) {
    // Unset other default addresses for this customer
    await this.constructor.updateMany(
      { customer: this.customer, _id: { $ne: this._id } },
      { isDefault: false },
    )
  }
  next()
})

const Address = mongoose.model('Address', addressSchema)

export default Address
