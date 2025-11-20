import crypto from 'crypto'
import querystring from 'qs'
import moment from 'moment'

class VNPayService {
  constructor(config) {
    this.tmnCode = config.tmnCode
    this.hashSecret = config.hashSecret
    this.url = config.url
    this.returnUrl = config.returnUrl
    this.ipnUrl = config.ipnUrl
  }

  /**
   * Sort object by key
   */
  sortObject(obj) {
    const sorted = {}
    const keys = Object.keys(obj).sort()
    keys.forEach((key) => {
      sorted[key] = obj[key]
    })
    return sorted
  }

  /**
   * Create payment URL
   */
  createPaymentUrl({ orderId, amount, orderInfo, ipAddr, locale = 'vn', bankCode = '' }) {
    try {
      const date = new Date()
      const createDate = moment(date).format('YYYYMMDDHHmmss')
      const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss')

      let vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100, // VNPay requires amount in smallest currency unit
        vnp_ReturnUrl: this.returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
      }

      if (bankCode) {
        vnpParams.vnp_BankCode = bankCode
      }

      // Sort params
      vnpParams = this.sortObject(vnpParams)

      // Create signature
      const signData = querystring.stringify(vnpParams, { encode: false })
      const hmac = crypto.createHmac('sha512', this.hashSecret)
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
      vnpParams.vnp_SecureHash = signed

      // Create payment URL
      const paymentUrl = this.url + '?' + querystring.stringify(vnpParams, { encode: false })

      return {
        success: true,
        paymentUrl,
        orderId,
      }
    } catch (error) {
      console.error('VNPay create payment error:', error)
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Verify IPN callback from VNPay
   */
  verifyIpnCall(vnpParams) {
    try {
      const secureHash = vnpParams.vnp_SecureHash

      // Remove hash params
      delete vnpParams.vnp_SecureHash
      delete vnpParams.vnp_SecureHashType

      // Sort params
      const sortedParams = this.sortObject(vnpParams)

      // Create signature
      const signData = querystring.stringify(sortedParams, { encode: false })
      const hmac = crypto.createHmac('sha512', this.hashSecret)
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

      // Verify signature
      if (secureHash === signed) {
        return {
          success: true,
          isValid: true,
          orderId: vnpParams.vnp_TxnRef,
          amount: vnpParams.vnp_Amount / 100,
          responseCode: vnpParams.vnp_ResponseCode,
          transactionNo: vnpParams.vnp_TransactionNo,
          bankCode: vnpParams.vnp_BankCode,
          payDate: vnpParams.vnp_PayDate,
        }
      } else {
        return {
          success: false,
          isValid: false,
          message: 'Invalid signature',
        }
      }
    } catch (error) {
      console.error('VNPay verify IPN error:', error)
      return {
        success: false,
        isValid: false,
        message: error.message,
      }
    }
  }

  /**
   * Verify return URL from VNPay
   */
  verifyReturnUrl(vnpParams) {
    return this.verifyIpnCall(vnpParams)
  }

  /**
   * Get response code description
   */
  getResponseDescription(responseCode) {
    const codes = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      75: 'Ngân hàng thanh toán đang bảo trì.',
      79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    }
    return codes[responseCode] || 'Lỗi không xác định'
  }
}

export default VNPayService
