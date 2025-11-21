import jwt from 'jsonwebtoken'
import Customer from '../models/Customer.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/avatars'
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Chỉ chấp nhận file ảnh'), false)
  }
  cb(null, true)
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, type: 'customer' }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// @desc    Register customer
// @route   POST /api/customers/register
// @access  Public
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body

    // Check if customer exists
    const customerExists = await Customer.findOne({ email })

    if (customerExists) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng',
      })
    }

    // Create customer
    const customer = await Customer.create({
      fullName,
      email,
      phone,
      password,
      address,
    })

    // Generate token
    const token = generateToken(customer._id)

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        customer: {
          id: customer._id,
          customerId: customer.customerId,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          avatar: customer.avatar,
        },
        token,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi đăng ký',
    })
  }
}

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find customer and include password
    const customer = await Customer.findOne({ email }).select('+password')

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      })
    }

    // Check password
    const isPasswordMatch = await customer.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      })
    }

    // Check if customer is active or VIP (only block inactive accounts)
    if (customer.status === 'inactive') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa',
      })
    }

    // Generate token
    const token = generateToken(customer._id)

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        customer: {
          id: customer._id,
          customerId: customer.customerId,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          avatar: customer.avatar,
          totalOrders: customer.totalOrders,
          totalSpent: customer.totalSpent,
          status: customer.status,
        },
        token,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi đăng nhập',
    })
  }
}

// @desc    Get current customer profile
// @route   GET /api/customers/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin khách hàng',
      })
    }

    res.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, avatar } = req.body

    const customer = await Customer.findById(req.customer._id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin khách hàng',
      })
    }

    // Update fields
    if (fullName) customer.fullName = fullName
    if (phone) customer.phone = phone
    if (address) customer.address = address
    if (avatar) customer.avatar = avatar

    await customer.save()

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: customer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi cập nhật',
    })
  }
}

// @desc    Change password
// @route   PUT /api/customers/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const customer = await Customer.findById(req.customer._id).select('+password')

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin khách hàng',
      })
    }

    // Check current password
    const isPasswordMatch = await customer.comparePassword(currentPassword)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng',
      })
    }

    // Update password
    customer.password = newPassword
    await customer.save()

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi đổi mật khẩu',
    })
  }
}

// @desc    Upload avatar
// @route   POST /api/customers/upload-avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh',
      })
    }

    const customer = await Customer.findById(req.customer._id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin khách hàng',
      })
    }

    // Delete old avatar if exists
    if (customer.avatar) {
      const oldAvatarPath = customer.avatar.replace('http://localhost:5000/', '')
      const fullPath = path.join(process.cwd(), oldAvatarPath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    }

    // Update avatar URL
    const avatarUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`
    customer.avatar = avatarUrl
    await customer.save()

    res.json({
      success: true,
      message: 'Upload ảnh đại diện thành công',
      data: {
        id: customer._id,
        customerId: customer.customerId,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        avatar: customer.avatar,
      },
    })
  } catch (error) {
    console.error('Upload avatar error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi upload ảnh',
    })
  }
}
