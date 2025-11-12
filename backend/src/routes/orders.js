import express from 'express'
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getCustomerOrders,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// Public/Customer routes
router.post('/', createOrder)

// Protected routes
router.get('/customer/:customerId', protect, getCustomerOrders)
router.get('/:id', protect, getOrder)
router.put('/:id/cancel', protect, cancelOrder)

// Admin routes
router.get('/', protect, admin, getOrders)
router.put('/:id/status', protect, admin, updateOrderStatus)

export default router
