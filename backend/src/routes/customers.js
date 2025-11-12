import express from 'express'
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} from '../controllers/customerController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(protect, admin)

router.get('/', getCustomers)
router.get('/stats', getCustomerStats)
router.get('/:id', getCustomer)
router.post('/', createCustomer)
router.put('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)

export default router
