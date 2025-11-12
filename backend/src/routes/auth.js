import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
]

// Routes
router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePasswordValidation, validate, changePassword)

export default router
