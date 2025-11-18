import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    // General Settings
    general: {
      storeName: {
        type: String,
        default: 'Ecommerce Store',
      },
      storeEmail: {
        type: String,
        default: 'info@ecommerce.com',
      },
      storePhone: String,
      storeHotline: String,
      storeAddress: String,
      storeDescription: String,
      storeLogo: String,
      primaryColor: {
        type: String,
        default: '#1976D2',
      },
      secondaryColor: {
        type: String,
        default: '#26A69A',
      },
    },

    // Payment Settings
    payment: {
      methods: [
        {
          id: String,
          name: String,
          description: String,
          icon: String,
          enabled: {
            type: Boolean,
            default: false,
          },
        },
      ],
      bankAccount: String,
      bankName: String,
      accountHolder: String,
      momoNumber: String,
    },

    // Shipping Settings
    shipping: {
      defaultFee: {
        type: Number,
        default: 30000,
      },
      freeShippingThreshold: {
        type: Number,
        default: 500000,
      },
      enableFreeShipping: {
        type: Boolean,
        default: true,
      },
      zones: [
        {
          name: String,
          fee: Number,
        },
      ],
    },

    // Notification Settings
    notification: {
      orderConfirmation: {
        type: Boolean,
        default: true,
      },
      orderStatus: {
        type: Boolean,
        default: true,
      },
      newCustomer: {
        type: Boolean,
        default: true,
      },
      lowStock: {
        type: Boolean,
        default: true,
      },
      smtpHost: String,
      smtpPort: Number,
      smtpUsername: String,
      smtpPassword: String,
      fromEmail: String,
    },

    // Security Settings
    security: {
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      sessionTimeout: {
        type: Boolean,
        default: true,
      },
      ipRestriction: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

const Settings = mongoose.model('Settings', settingsSchema)

export default Settings
