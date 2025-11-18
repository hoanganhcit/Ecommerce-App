import express from 'express'
import { getSettings, updateSettings, changePassword } from '../controllers/settingsController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// Public route - Get store info (logo, name, colors)
router.get('/public', async (req, res) => {
  try {
    const Settings = (await import('../models/Settings.js')).default
    let settings = await Settings.findOne()

    if (!settings) {
      settings = await Settings.create({})
    }

    res.json({
      success: true,
      data: {
        storeLogo: settings.general?.storeLogo || '',
        storeName: settings.general?.storeName || '',
        primaryColor: settings.general?.primaryColor || '',
        secondaryColor: settings.general?.secondaryColor || '',
        paymentMethods: settings.payment?.methods || [],
        shipping: {
          defaultFee: settings.shipping?.defaultFee || 30000,
          freeShippingThreshold: settings.shipping?.freeShippingThreshold || 500000,
          enableFreeShipping: settings.shipping?.enableFreeShipping ?? true,
          zones: settings.shipping?.zones || [],
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching store info',
      error: error.message,
    })
  }
})

// Admin routes
router.get('/', protect, admin, getSettings)
router.put('/', protect, admin, updateSettings)
router.put('/change-password', protect, admin, changePassword)

export default router
