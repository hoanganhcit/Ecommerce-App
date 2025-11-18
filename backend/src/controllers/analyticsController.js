import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Customer from '../models/Customer.js'

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { timeRange = 'month', startDate, endDate } = req.query

    // Calculate date range
    let dateFilter = {}
    const now = new Date()

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }
    } else {
      switch (timeRange) {
        case 'today':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
            },
          }
          break
        case 'week':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setDate(now.getDate() - 7)),
            },
          }
          break
        case 'month':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setMonth(now.getMonth() - 1)),
            },
          }
          break
        case 'quarter':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setMonth(now.getMonth() - 3)),
            },
          }
          break
        case 'year':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setFullYear(now.getFullYear() - 1)),
            },
          }
          break
      }
    }

    // Get orders with date filter
    const orders = await Order.find(dateFilter).populate('customer', 'name email')

    // Calculate revenue stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const totalOrders = orders.length
    const newCustomers = await Customer.countDocuments(dateFilter)

    // Calculate previous period for comparison
    const periodLength = dateFilter.createdAt?.$gte
      ? Date.now() - new Date(dateFilter.createdAt.$gte).getTime()
      : 30 * 24 * 60 * 60 * 1000 // default 30 days

    const previousPeriodFilter = {
      createdAt: {
        $gte: new Date(Date.now() - periodLength * 2),
        $lt: dateFilter.createdAt?.$gte || new Date(Date.now() - periodLength),
      },
    }

    const previousOrders = await Order.find(previousPeriodFilter)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const previousOrderCount = previousOrders.length
    const previousCustomerCount = await Customer.countDocuments(previousPeriodFilter)

    // Calculate trends
    const revenueTrend =
      previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const orderTrend =
      previousOrderCount > 0 ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 0
    const customerTrend =
      previousCustomerCount > 0
        ? ((newCustomers - previousCustomerCount) / previousCustomerCount) * 100
        : 0

    // Get top products
    const topProducts = await Product.find({ isActive: true })
      .sort({ sold: -1 })
      .limit(5)
      .select('name images sold price')

    const topProductsWithRevenue = topProducts.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.images && product.images[0] ? product.images[0] : '',
      sold: product.sold || 0,
      revenue: (product.sold || 0) * (product.price || 0),
    }))

    // Get top customers (VIP customers with most orders)
    const customerOrders = await Order.aggregate([
      { $match: { customer: { $exists: true } } },
      {
        $group: {
          _id: '$customer',
          orders: { $sum: 1 },
          spent: { $sum: '$totalAmount' },
        },
      },
      { $sort: { orders: -1 } }, // Sort by number of orders (most orders first)
      { $limit: 10 }, // Get top 10 to filter VIP later
    ])

    const customerIds = customerOrders.map((c) => c._id)
    const customers = await Customer.find({ _id: { $in: customerIds } }).select(
      'fullName email avatar status',
    )

    // Filter only VIP customers and limit to top 5
    const topCustomers = customerOrders
      .map((co) => {
        const customer = customers.find((c) => c._id.toString() === co._id.toString())
        if (!customer || customer.status !== 'vip') return null

        return {
          id: co._id,
          name: customer?.fullName || 'Unknown',
          avatar: customer?.avatar || `https://i.pravatar.cc/150?u=${co._id}`,
          orders: co.orders,
          spent: co.spent,
          status: customer?.status || 'active',
        }
      })
      .filter((c) => c !== null) // Remove non-VIP customers
      .slice(0, 5) // Get top 5 VIP customers

    // Get recent activities (last 5 orders)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name')

    const recentActivities = recentOrders.map((order) => {
      let icon = 'fal fa-box'
      let iconBg = 'bg-blue-100'
      let iconColor = 'text-blue-600'
      let title = `Đơn hàng #${order.orderNumber || order._id.toString().slice(-6)} `

      switch (order.status) {
        case 'delivered':
          icon = 'fal fa-check-circle'
          iconBg = 'bg-green-100'
          iconColor = 'text-green-600'
          title += 'đã được giao'
          break
        case 'shipping':
          icon = 'fal fa-truck'
          iconBg = 'bg-purple-100'
          iconColor = 'text-purple-600'
          title += 'đang giao hàng'
          break
        case 'processing':
          icon = 'fal fa-box'
          iconBg = 'bg-blue-100'
          iconColor = 'text-blue-600'
          title += 'đang được xử lý'
          break
        case 'pending':
          icon = 'fal fa-clock'
          iconBg = 'bg-yellow-100'
          iconColor = 'text-yellow-600'
          title += 'chờ xác nhận'
          break
        case 'cancelled':
          icon = 'fal fa-times-circle'
          iconBg = 'bg-red-100'
          iconColor = 'text-red-600'
          title += 'đã hủy'
          break
      }

      const timeAgo = getTimeAgo(order.createdAt)

      return {
        id: order._id,
        title,
        time: timeAgo,
        icon,
        iconBg,
        iconColor,
      }
    })

    // Get sales data for last 7 days
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate },
      })

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      const uniqueCustomers = new Set(dayOrders.map((o) => o.customer?.toString())).size

      last7Days.push({
        date: date.toLocaleDateString('vi-VN'),
        orders: dayOrders.length,
        revenue: dayRevenue,
        customers: uniqueCustomers,
        avgOrder: dayOrders.length > 0 ? dayRevenue / dayOrders.length : 0,
        growth: 0, // TODO: Calculate actual growth
      })
    }

    res.json({
      success: true,
      data: {
        revenueStats: {
          totalRevenue,
          totalOrders,
          newCustomers,
          conversionRate: 3.24, // TODO: Calculate from actual traffic data
          revenueTrend: parseFloat(revenueTrend.toFixed(1)),
          orderTrend: parseFloat(orderTrend.toFixed(1)),
          customerTrend: parseFloat(customerTrend.toFixed(1)),
        },
        topProducts: topProductsWithRevenue,
        topCustomers,
        recentActivities,
        salesData: last7Days,
      },
    })
  } catch (error) {
    console.error('Error getting dashboard analytics:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' năm trước'

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' tháng trước'

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' ngày trước'

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' giờ trước'

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' phút trước'

  return Math.floor(seconds) + ' giây trước'
}
