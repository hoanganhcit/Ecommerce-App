import jwt from 'jsonwebtoken'
import Customer from '../models/Customer.js'

// Protect routes - Customer authentication
export const protectCustomer = async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để tiếp tục',
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

    // Check if it's a customer token
    if (decoded.type !== 'customer') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      })
    }

    // Get customer from token
    const customer = await Customer.findById(decoded.id)

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin khách hàng',
      })
    }

    // Check if customer is active
    if (customer.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa',
      })
    }

    // Attach customer to request
    req.customer = customer

    next()
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn',
    })
  }
}
