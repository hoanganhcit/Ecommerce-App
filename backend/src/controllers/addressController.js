import Address from '../models/Address.js'

// @desc    Get all addresses for customer
// @route   GET /api/customers/addresses
// @access  Private (Customer)
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ customer: req.customer._id }).sort({
      isDefault: -1,
      createdAt: -1,
    })

    res.json({
      success: true,
      data: addresses,
    })
  } catch (error) {
    console.error('Get addresses error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi lấy danh sách địa chỉ',
    })
  }
}

// @desc    Create new address
// @route   POST /api/customers/addresses
// @access  Private (Customer)
export const createAddress = async (req, res) => {
  try {
    const { label, receiverName, phone, fullAddress, isDefault } = req.body

    // If this is the first address, auto set as default
    const existingAddresses = await Address.countDocuments({ customer: req.customer._id })
    const shouldBeDefault = existingAddresses === 0 ? true : isDefault

    const address = await Address.create({
      customer: req.customer._id,
      label,
      receiverName,
      phone,
      fullAddress,
      isDefault: shouldBeDefault,
    })

    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: address,
    })
  } catch (error) {
    console.error('Create address error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi thêm địa chỉ',
    })
  }
}

// @desc    Update address
// @route   PUT /api/customers/addresses/:id
// @access  Private (Customer)
export const updateAddress = async (req, res) => {
  try {
    const { label, receiverName, phone, fullAddress, isDefault } = req.body

    const address = await Address.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    })

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ',
      })
    }

    // Update fields
    address.label = label || address.label
    address.receiverName = receiverName || address.receiverName
    address.phone = phone || address.phone
    address.fullAddress = fullAddress || address.fullAddress
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault

    await address.save()

    res.json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: address,
    })
  } catch (error) {
    console.error('Update address error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi cập nhật địa chỉ',
    })
  }
}

// @desc    Set default address
// @route   PUT /api/customers/addresses/:id/set-default
// @access  Private (Customer)
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    })

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ',
      })
    }

    // Unset all default addresses for this customer
    await Address.updateMany({ customer: req.customer._id }, { isDefault: false })

    // Set this address as default
    address.isDefault = true
    await address.save()

    res.json({
      success: true,
      message: 'Đã đặt làm địa chỉ mặc định',
      data: address,
    })
  } catch (error) {
    console.error('Set default address error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi',
    })
  }
}

// @desc    Delete address
// @route   DELETE /api/customers/addresses/:id
// @access  Private (Customer)
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    })

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ',
      })
    }

    // If deleting default address, set another one as default
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({
        customer: req.customer._id,
        _id: { $ne: address._id },
      })
      if (anotherAddress) {
        anotherAddress.isDefault = true
        await anotherAddress.save()
      }
    }

    await address.deleteOne()

    res.json({
      success: true,
      message: 'Đã xóa địa chỉ',
    })
  } catch (error) {
    console.error('Delete address error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi xóa địa chỉ',
    })
  }
}
