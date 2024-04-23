const { MomoPayment } = require('momo-payment-gateway');

/* HOST_WEBHOOK => Partner API. Used by MoMo to submit payment results by IPN method (server-to-server) method */
const partnerCode = process.env.HOST_WEBHOOK;
const accessKey = process.env.HOST_WEBHOOK;
const secretKey = process.env.HOST_WEBHOOK;
const apiEndpoint = process.env.HOST_WEBHOOK;

/* constructor: partnerCode, accessKey, secretKey ,apiEndpoint=> provided by Momo
apiEndpoint: 
  sandbox:  https://test-payment.momo.vn
  live:     https://payment.momo.vn
*/
class MomoPaymentController {
    constructor(partnerCode, accessKey, secretKey, apiEndpoint) {
        this.momoPayment = new MomoPayment({
            partnerCode,
            accessKey,
            secretKey,
            apiEndpoint,
        });
    }

    /* The payment method payUrl is returned  */
    async createPayment({
        orderId,
        amount,
        orderInfo = 'Your message',
        returnUrl = 'https://your-website.com',
    }) {
        try {
            if (!orderId || !amount || !message || !orderInfo) {
                throw new Error('invalid input');
            }
            const result = await this.momoPayment.createPayment({
                requestId: `ID-${orderId}-${Math.round(Date.now() / 1000)}`, // Help for re-create payment
                orderId: `${orderId}-${Math.round(Date.now() / 1000)}`,
                amount,
                orderInfo,
                returnUrl,
                ipnUrl: HOST_WEBHOOK,
            });
            return result;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    /* Proceed the refund payment */
    async refundPayment({ requestId, orderId, amount, transId }) {
        try {
            if (!orderId || !amount || !transId) {
                throw new Error('invalid input');
            }
            const result = await this.momoPayment.refundPayment({
                requestId,
                orderId,
                amount,
                transId,
            });
            return result.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    /* The function for verify webhook request and payment */
    verifySignature({
        signature,
        requestId,
        orderId,
        amount,
        orderInfo,
        orderType,
        transId,
        message,
        localMessage,
        responseTime,
        errorCode,
        payType,
    }) {
        try {
            const result = this.momoPayment.verifySignature({
                signature,
                requestId,
                orderId,
                amount,
                orderInfo,
                orderType,
                transId,
                message,
                localMessage,
                responseTime,
                errorCode,
                payType,
            });
            return result;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}

module.exports = new MomoPaymentController(partnerCode, accessKey, secretKey, apiEndpoint);