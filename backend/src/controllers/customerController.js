import Customer from '../models/Customer.js'
import Address from '../models/Address.js'

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
export const getCustomers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query

    const query = {}
    if (status && status !== 'all') query.status = status
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const customers = await Customer.find(query).sort('-createdAt').limit(Number(limit)).skip(skip)

    // Get addresses for all customers
    const customerIds = customers.map((c) => c._id)
    const addresses = await Address.find({ customer: { $in: customerIds } })

    // Map addresses to customers
    const customersWithAddresses = customers.map((customer) => {
      const customerAddresses = addresses.filter(
        (addr) => addr.customer.toString() === customer._id.toString(),
      )
      const defaultAddress =
        customerAddresses.find((addr) => addr.isDefault) || customerAddresses[0]

      return {
        ...customer.toObject(),
        address: defaultAddress ? defaultAddress.fullAddress : null,
        addresses: customerAddresses,
      }
    })

    const total = await Customer.countDocuments(query)

    res.json({
      success: true,
      data: customersWithAddresses,
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

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private/Admin
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
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

// @desc    Create customer
// @route   POST /api/customers
// @access  Private/Admin
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private/Admin
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      })
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      })
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get customer statistics
// @route   GET /api/customers/stats
// @access  Private/Admin
export const getCustomerStats = async (req, res) => {
  try {
    const total = await Customer.countDocuments()
    const active = await Customer.countDocuments({ status: 'active' })
    const vip = await Customer.countDocuments({ status: 'vip' })
    const inactive = await Customer.countDocuments({ status: 'inactive' })

    const totalRevenue = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalSpent' },
        },
      },
    ])

    res.json({
      success: true,
      data: {
        total,
        active,
        vip,
        inactive,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
