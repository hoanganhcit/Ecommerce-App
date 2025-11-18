import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import Product from '../models/Product.js'

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const { status, customer, page = 1, limit = 10 } = req.query

    const query = {}
    if (status && status !== 'all') query.status = status
    if (customer) query.customer = customer

    const skip = (Number(page) - 1) * Number(limit)

    const orders = await Order.find(query)
      .populate('customer', 'fullName email phone avatar')
      .populate('items.product', 'name images')
      .sort('-createdAt')
      .limit(Number(limit))
      .skip(skip)

    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone avatar')
      .populate('items.product', 'name images price')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Create order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { items, customerInfo, shippingAddress, paymentMethod, voucher, notes } = req.body

    // Only link to customer if authenticated
    // Guest checkout is allowed without customer account
    let customerId = null
    if (req.customer && req.customer._id) {
      // From customerAuth middleware
      customerId = req.customer._id
    } else if (req.user && req.user._id) {
      // From admin auth middleware (unlikely for this route)
      customerId = req.user._id
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        })
      }

      const itemSubtotal = product.price * item.quantity

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal: itemSubtotal,
      })

      subtotal += itemSubtotal

      // Validate stock availability but don't deduct yet
      if (product.variants && product.variants.length > 0 && item.size && item.color) {
        // Find specific variant
        const variant = product.variants.find((v) => v.size === item.size && v.color === item.color)

        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variant ${item.size} - ${item.color} not found for product ${product.name}`,
          })
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name} (${item.size} - ${item.color}). Available: ${variant.stock}, Requested: ${item.quantity}`,
          })
        }
      } else if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        })
      }

      // Stock will be deducted when order status changes to 'delivered'
    }

    // Calculate shipping fee
    const shippingFee = subtotal >= 500000 ? 0 : 30000

    // Calculate discount
    let discount = 0
    if (voucher) {
      if (voucher.type === 'freeship') {
        discount = shippingFee
      } else if (voucher.type === 'percent') {
        discount = (subtotal * voucher.value) / 100
      } else if (voucher.type === 'fixed') {
        discount = voucher.value
      }
    }

    const total = subtotal + shippingFee - discount

    // Generate unique orderId (4-5 digits)
    const orderCount = await Order.countDocuments()
    const orderId = `ORD${String(orderCount + 1).padStart(5, '0')}`

    // Create order
    const order = await Order.create({
      orderId,
      customer: customerId, // null for guest, customer ID for logged-in users
      items: orderItems,
      customerInfo,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      voucher,
      total,
      notes,
      statusHistory: [
        {
          status: 'pending',
          note: 'Đơn hàng đã được tạo',
        },
      ],
    })

    // Update customer stats only if logged in
    if (customerId) {
      const customer = await Customer.findById(customerId)
      if (customer) {
        customer.totalOrders += 1
        customer.totalSpent += total
        customer.lastOrder = new Date()
        customer.status = customer.totalSpent >= 10000000 ? 'vip' : 'active'
        await customer.save()
      }
    }

    // Emit socket event for real-time notification
    const io = req.app.get('io')
    if (io) {
      io.emit('newOrder', {
        orderId: order.orderId,
        total: order.total,
        customerName: order.customerInfo?.fullName || 'Guest',
        createdAt: order.createdAt,
      })
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body

    const order = await Order.findById(req.params.id).populate('items.product')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    const previousStatus = order.status

    // Update stock when order is delivered
    if (status === 'delivered' && previousStatus !== 'delivered') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id || item.product)

        if (product) {
          // Update variant stock if exists
          if (product.variants && product.variants.length > 0 && item.size && item.color) {
            const variant = product.variants.find(
              (v) => v.size === item.size && v.color === item.color,
            )

            if (variant) {
              variant.stock -= item.quantity
            }
          }

          // Update total stock and sold count
          product.stock -= item.quantity
          product.sold += item.quantity
          await product.save()
        }
      }
    }

    // Restore stock if order is cancelled from any status (except already cancelled)
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id || item.product)

        if (product) {
          // Only restore stock if it was already deducted (i.e., order was delivered)
          if (previousStatus === 'delivered') {
            // Restore variant stock if exists
            if (product.variants && product.variants.length > 0 && item.size && item.color) {
              const variant = product.variants.find(
                (v) => v.size === item.size && v.color === item.color,
              )

              if (variant) {
                variant.stock += item.quantity
              }
            }

            // Restore total stock and reduce sold count
            product.stock += item.quantity
            product.sold -= item.quantity
            await product.save()
          }
        }
      }
    }

    order.status = status
    order.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id,
    })

    await order.save()

    // Emit socket event for real-time badge update
    const io = req.app.get('io')
    if (io) {
      // Get current pending orders count
      const pendingCount = await Order.countDocuments({ status: 'pending' })

      io.emit('orderStatusChanged', {
        orderId: order.orderId,
        newStatus: status,
        previousStatus,
        pendingCount,
      })
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending orders',
      })
    }

    order.status = 'cancelled'
    order.statusHistory.push({
      status: 'cancelled',
      note: 'Khách hàng hủy đơn',
    })

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock += item.quantity
        product.sold -= item.quantity
        await product.save()
      }
    }

    await order.save()

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get customer orders
// @route   GET /api/orders/customer/:customerId
// @access  Private
export const getCustomerOrders = async (req, res) => {
  try {
    const { status } = req.query

    const query = { customer: req.params.customerId }
    if (status && status !== 'all') query.status = status

    const orders = await Order.find(query)
      .populate('items.product', 'name images price')
      .sort('-createdAt')

    res.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
