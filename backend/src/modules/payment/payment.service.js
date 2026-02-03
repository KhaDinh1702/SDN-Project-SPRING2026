import vnpay from './vnpay.config.js';
import PaymentTransaction from '../../models/PaymentTransaction.js';
import Order from '../../models/Order.js';
import { ProductCode, VnpLocale } from 'vnpay';

/**
 * Service to handle VNPay payment logic
 */
export const createPaymentUrlService = async ({ orderId, amount, orderInfo, bankCode, ipAddr }) => {
    // Generate unique transaction reference
    const txnRef = `${orderId}_${Date.now()}`;

    // Build payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: ipAddr || '127.0.0.1',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.VNP_RETURN_URL,
        vnp_Locale: VnpLocale.VN,
        ...(bankCode && { vnp_BankCode: bankCode }),
    });

    // Create payment transaction record
    const transaction = new PaymentTransaction({
        order_id: orderId,
        method: 'VNPay',
        amount: amount,
        payment_status: 'Pending',
        transaction_code: txnRef,
    });

    await transaction.save();

    return {
        paymentUrl,
        transactionCode: txnRef
    };
};

export const verifyReturnUrlService = (vnpayParams) => {
    return vnpay.verifyReturnUrl(vnpayParams);
};

export const verifyIpnCallService = (vnpayParams) => {
    return vnpay.verifyIpnCall(vnpayParams);
};

export const updateTransactionStatusService = async (txnRef, responseCode) => {
    const transaction = await PaymentTransaction.findOne({
        transaction_code: txnRef,
    });

    if (!transaction) return null;

    transaction.payment_status = responseCode === '00' ? 'Success' : 'Failed';
    await transaction.save();

    if (responseCode === '00') {
        const order = await Order.findById(transaction.order_id);
        if (order) {
            order.payment_status = 'Paid';
            order.order_status = 'Processing';
            await order.save();
        }
    }

    return transaction;
};
