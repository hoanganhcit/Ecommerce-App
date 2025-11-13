import express from 'express'
import { body } from 'express-validator'
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} from '../controllers/customerController.js'
import {
  registerCustomer,
  loginCustomer,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  upload,
} from '../controllers/customerAuthController.js'
import {
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from '../controllers/addressController.js'
import { protect, admin } from '../middleware/auth.js'
import { protectCustomer } from '../middleware/customerAuth.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

// Validation rules
const registerValidation = [
  body('fullName').trim().isLength({ min: 3 }).withMessage('Họ tên phải có ít nhất 3 ký tự'),
  body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
]

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
]

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
]

const addressValidation = [
  body('label').trim().notEmpty().withMessage('Vui lòng nhập nhãn địa chỉ'),
  body('receiverName').trim().notEmpty().withMessage('Vui lòng nhập tên người nhận'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('fullAddress').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ đầy đủ'),
]

// Public routes - Customer authentication
router.post('/register', registerValidation, validate, registerCustomer)
router.post('/login', loginValidation, validate, loginCustomer)

// Protected routes - Customer only
router.get('/profile', protectCustomer, getProfile)
router.put('/profile', protectCustomer, updateProfile)
router.put('/change-password', protectCustomer, changePasswordValidation, validate, changePassword)
router.post('/upload-avatar', protectCustomer, upload.single('avatar'), uploadAvatar)

// Address management routes - Customer only
router.get('/addresses', protectCustomer, getAddresses)
router.post('/addresses', protectCustomer, addressValidation, validate, createAddress)
router.put('/addresses/:id', protectCustomer, addressValidation, validate, updateAddress)
router.put('/addresses/:id/set-default', protectCustomer, setDefaultAddress)
router.delete('/addresses/:id', protectCustomer, deleteAddress)

// Admin routes - Require admin authentication
router.get('/', protect, admin, getCustomers)
router.get('/stats', protect, admin, getCustomerStats)
router.get('/:id', protect, admin, getCustomer)
router.post('/', protect, admin, createCustomer)
router.put('/:id', protect, admin, updateCustomer)
router.delete('/:id', protect, admin, deleteCustomer)

export default router
