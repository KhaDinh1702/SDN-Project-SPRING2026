import { VNPay } from 'vnpay';

/**
 * VNPay Configuration for FreshMart
 * Using Sandbox environment for testing
 */
const vnpayConfig = {
    tmnCode: process.env.VNP_TMN_CODE || 'MV9H8HZD',
    secureSecret: process.env.VNP_HASH_SECRET || '4YYOTUQY5J9J2P6D1NDKHNBUK57HXHX5',
    vnpayHost: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    testMode: true, // Enable sandbox test mode
    hashAlgorithm: 'SHA512', // Default algorithm
};

// Initialize VNPay instance
const vnpay = new VNPay(vnpayConfig);

export default vnpay;
export { vnpayConfig };
