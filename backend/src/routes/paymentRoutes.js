import express from 'express'
import MoMoService from '../services/momoService.js'
import Order from '../models/Order.js'

const router = express.Router()

/**
 * @route   POST /api/payment/momo/create
 * @desc    Create MoMo payment request
 * @access  Public
 */
router.post('/momo/create', async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: orderId, amount',
      })
    }

    // Initialize MoMo service (credentials will be loaded from settings in production)
    const momoService = new MoMoService({
      partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMOBKUN20180529',
      accessKey: process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j',
      secretKey: process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
      endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
      redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:9000/payment/momo/result',
      ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:5000/api/payment/momo/callback',
    })

    // Create MoMo payment
    const result = await momoService.createPayment({
      orderId: orderId,
      amount: amount,
      orderInfo: orderInfo || `Thanh toán đơn hàng ${orderId}`,
      extraData: '', // Can store additional data here
    })

    if (result.success) {
      res.json({
        success: true,
        data: {
          payUrl: result.payUrl,
          deeplink: result.deeplink,
          qrCodeUrl: result.qrCodeUrl,
          requestId: result.requestId,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        resultCode: result.resultCode,
      })
    }
  } catch (error) {
    console.error('MoMo create payment error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create MoMo payment',
    })
  }
})

/**
 * @route   POST /api/payment/momo/callback
 * @desc    Handle MoMo IPN callback
 * @access  Public (called by MoMo)
 */
router.post('/momo/callback', async (req, res) => {
  try {
    console.log('MoMo IPN Callback received:', req.body)

    // Initialize MoMo service
    const momoService = new MoMoService({
      partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMOBKUN20180529',
      accessKey: process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j',
      secretKey: process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
    })

    // Process and verify callback
    const result = momoService.processCallback(req.body)

    if (!result.success) {
      console.error('Invalid MoMo signature or payment failed:', result)
      return res.status(400).json({
        success: false,
        message: result.message,
      })
    }

    // Find and update order
    const order = await Order.findOne({ orderId: result.orderId })

    if (!order) {
      console.error('Order not found:', result.orderId)
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Update order payment status
    if (result.paymentStatus === 'paid') {
      order.paymentStatus = 'paid'
      order.status = 'processing' // Move to processing after payment
      order.trackingNumber = result.transactionId

      // Add status history
      order.statusHistory.push({
        status: 'processing',
        note: `Thanh toán MoMo thành công. Transaction ID: ${result.transactionId}`,
        timestamp: new Date(),
      })

      await order.save()

      console.log('Order updated successfully:', order.orderId)

      // Emit socket event for real-time update (if socket.io is available)
      try {
        const io = req.app.get('io')
        if (io) {
          io.emit('orderStatusChanged', {
            orderId: order._id,
            newStatus: order.status,
            paymentStatus: order.paymentStatus,
          })
        }
      } catch (socketError) {
        console.error('Socket emit error:', socketError)
      }
    } else {
      order.paymentStatus = 'failed'
      order.statusHistory.push({
        status: order.status,
        note: `Thanh toán MoMo thất bại: ${result.message}`,
        timestamp: new Date(),
      })
      await order.save()
    }

    // Respond to MoMo (must return 204 No Content)
    res.status(204).send()
  } catch (error) {
    console.error('MoMo callback error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

/**
 * @route   GET /api/payment/momo/check/:orderId
 * @desc    Check MoMo payment status
 * @access  Public
 */
router.get('/momo/check/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findOne({ orderId: orderId })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        paymentMethod: order.paymentMethod,
      },
    })
  } catch (error) {
    console.error('Check payment status error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
