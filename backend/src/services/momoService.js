import crypto from 'crypto'
import axios from 'axios'

/**
 * MoMo Payment Service
 * Using MoMo Payment Gateway API v2
 * Docs: https://developers.momo.vn/
 */

class MoMoService {
  constructor(config) {
    this.partnerCode = config.partnerCode || 'MOMOBKUN20180529'
    this.accessKey = config.accessKey || 'klm05TvNBzhg7h7j'
    this.secretKey = config.secretKey || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa'
    this.endpoint = config.endpoint || 'https://test-payment.momo.vn/v2/gateway/api/create'
    this.redirectUrl = config.redirectUrl || 'http://localhost:9000/payment/momo/result'
    this.ipnUrl = config.ipnUrl || 'http://localhost:5000/api/payment/momo/callback'
  }

  /**
   * Generate signature for MoMo request
   */
  generateSignature(rawData) {
    return crypto.createHmac('sha256', this.secretKey).update(rawData).digest('hex')
  }

  /**
   * Create MoMo payment request
   * @param {Object} orderData - Order information
   * @returns {Promise<Object>} - MoMo payment URL and request details
   */
  async createPayment(orderData) {
    const {
      orderId,
      orderInfo,
      amount,
      extraData = '',
      requestType = 'captureWallet',
      lang = 'vi',
    } = orderData

    // Generate request ID (unique for each request)
    const requestId = `${orderId}_${Date.now()}`

    // Build raw signature string
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`

    // Generate signature
    const signature = this.generateSignature(rawSignature)

    // Build request body
    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature,
    }

    try {
      console.log('MoMo Request:', requestBody)

      const response = await axios.post(this.endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('MoMo Response:', response.data)

      if (response.data.resultCode === 0) {
        return {
          success: true,
          payUrl: response.data.payUrl,
          deeplink: response.data.deeplink,
          qrCodeUrl: response.data.qrCodeUrl,
          requestId: requestId,
          orderId: orderId,
        }
      } else {
        return {
          success: false,
          message: response.data.message || 'MoMo payment creation failed',
          resultCode: response.data.resultCode,
        }
      }
    } catch (error) {
      console.error('MoMo API Error:', error.response?.data || error.message)
      throw new Error('Failed to create MoMo payment: ' + error.message)
    }
  }

  /**
   * Verify MoMo IPN callback signature
   * @param {Object} callbackData - Data from MoMo callback
   * @returns {Boolean} - True if signature is valid
   */
  verifySignature(callbackData) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = callbackData

    // Build raw signature string (must match order in MoMo docs)
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`

    // Generate expected signature
    const expectedSignature = this.generateSignature(rawSignature)

    console.log('Signature verification:', {
      received: signature,
      expected: expectedSignature,
      match: signature === expectedSignature,
    })

    return signature === expectedSignature
  }

  /**
   * Process MoMo IPN callback
   * @param {Object} callbackData - Data from MoMo IPN
   * @returns {Object} - Processed payment result
   */
  processCallback(callbackData) {
    const isValid = this.verifySignature(callbackData)

    if (!isValid) {
      return {
        success: false,
        message: 'Invalid signature',
        resultCode: -1,
      }
    }

    const { orderId, transId, resultCode, message, amount } = callbackData

    return {
      success: resultCode === 0,
      orderId: orderId,
      transactionId: transId,
      amount: amount,
      resultCode: resultCode,
      message: message,
      paymentStatus: resultCode === 0 ? 'paid' : 'failed',
    }
  }
}

export default MoMoService
