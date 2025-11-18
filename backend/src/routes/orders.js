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
import { protectCustomer, optionalCustomerAuth } from '../middleware/customerAuth.js'

const router = express.Router()

// Public/Customer routes - optional auth allows both guest and logged-in customers
router.post('/', optionalCustomerAuth, createOrder)

// Protected customer routes
router.get(
  '/my-orders',
  protectCustomer,
  (req, res, next) => {
    // Set customerId from logged-in customer
    req.params.customerId = req.customer._id
    next()
  },
  getCustomerOrders,
)

router.get('/:id', protectCustomer, getOrder)
router.put('/:id/cancel', protectCustomer, cancelOrder)

// Admin routes - legacy
router.get('/customer/:customerId', protect, getCustomerOrders)
router.get('/', protect, admin, getOrders)
router.put('/:id/status', protect, admin, updateOrderStatus)

export default router
