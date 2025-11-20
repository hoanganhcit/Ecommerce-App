import Settings from '../models/Settings.js'
import User from '../models/User.js'

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    // Get settings or create default if not exists
    let settings = await Settings.findOne()

    if (!settings) {
      // Create default settings
      settings = await Settings.create({
        general: {
          storeName: 'Ecommerce Store',
          storeEmail: 'info@ecommerce.com',
          primaryColor: '#1976D2',
          secondaryColor: '#26A69A',
        },
        payment: {
          methods: [
            {
              id: 'cod',
              name: 'Thanh toán khi nhận hàng (COD)',
              description: 'Khách hàng thanh toán tiền mặt khi nhận hàng',
              icon: 'fal fa-money-bill',
              enabled: true,
            },
            {
              id: 'bank',
              name: 'Chuyển khoản ngân hàng',
              description: 'Chuyển khoản qua tài khoản ngân hàng',
              icon: 'fal fa-university',
              enabled: true,
            },
            {
              id: 'momo',
              name: 'Ví điện tử MoMo',
              description: 'Thanh toán qua ví MoMo',
              icon: 'fal fa-wallet',
              enabled: true,
            },
            {
              id: 'vnpay',
              name: 'VNPay',
              description: 'Thanh toán qua cổng VNPay',
              icon: 'fal fa-credit-card',
              enabled: false,
            },
          ],
        },
        shipping: {
          defaultFee: 30000,
          freeShippingThreshold: 500000,
          enableFreeShipping: true,
          zones: [
            { name: 'Nội thành TP.HCM', fee: 30000 },
            { name: 'Ngoại thành TP.HCM', fee: 50000 },
            { name: 'Các tỉnh lân cận', fee: 70000 },
            { name: 'Miền Trung', fee: 100000 },
            { name: 'Miền Bắc', fee: 120000 },
          ],
        },
        notification: {
          orderConfirmation: true,
          orderStatus: true,
          newCustomer: true,
          lowStock: true,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: true,
          ipRestriction: false,
        },
      })
    }

    res.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error getting settings:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne()

    if (!settings) {
      settings = await Settings.create(req.body)
    } else {
      // Update settings
      Object.assign(settings, req.body)
      await settings.save()
    }

    res.json({
      success: true,
      data: settings,
      message: 'Cài đặt đã được cập nhật',
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Change admin password
// @route   PUT /api/settings/change-password
// @access  Private/Admin
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu xác nhận không khớp',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      })
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng',
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
