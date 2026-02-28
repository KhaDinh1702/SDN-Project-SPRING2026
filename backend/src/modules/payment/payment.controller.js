import vnpay from './vnpay.config.js';
import PaymentTransaction from '../../models/PaymentTransaction.js';
import Order from '../../models/Order.js';
import {
    createPaymentUrlService,
    verifyReturnUrlService,
    verifyIpnCallService,
    updateTransactionStatusService
} from './payment.service.js';

/**
 * @route POST /api/payment/vnpay/create
 * @desc Create VNPay payment URL
 * @access Public (later should be protected)
 */
export const createPaymentUrl = async (req, res) => {
    try {
        const { orderId, amount, orderInfo, bankCode } = req.body;
        if (!orderId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'orderId and amount are required',
            });
        }

        // Verify order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '127.0.0.1';

        const result = await createPaymentUrlService({
            orderId,
            amount,
            orderInfo,
            bankCode,
            ipAddr
        });

        return res.status(200).json({
            success: true,
            message: 'Payment URL created successfully',
            paymentUrl: result.paymentUrl,
            transactionCode: result.transactionCode,
        });
    } catch (error) {
        console.error('Create payment URL error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment URL',
            error: error.message,
        });
    }
};

/**
 * @route GET /api/payment/vnpay/callback
 * @desc Handle VNPay return callback after payment
 * @access Public
 */
export const vnpayCallback = async (req, res) => {
    try {
        const vnpayParams = req.query;
        const verify = verifyReturnUrlService(vnpayParams);
        if (!verify.isVerified) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/failure?message=Invalid signature`,
            );
        }
        if (!verify.isSuccess) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/failure?message=${verify.message}`,
            );
        }
        const { vnp_TxnRef, vnp_ResponseCode } = vnpayParams;
        const transaction = await updateTransactionStatusService(vnp_TxnRef, vnp_ResponseCode);
        if (!transaction) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/failure?message=Transaction not found`,
            );
        }
        const redirectUrl =
            vnp_ResponseCode === '00'
                ? `${process.env.FRONTEND_URL}/payment/success?orderId=${transaction.order_id}&transactionCode=${vnp_TxnRef}`
                : `${process.env.FRONTEND_URL}/payment/failure?orderId=${transaction.order_id}&message=${verify.message}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error('VNPay callback error:', error);
        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/failure?message=System error`,
        );
    }
};

/**
 * @route POST /api/payment/vnpay/ipn
 * @desc Handle VNPay IPN (Instant Payment Notification)
 * @access Public - Called by VNPay server
 */
export const vnpayIPN = async (req, res) => {
    try {
        const vnpayParams = req.query;
        const verify = verifyIpnCallService(vnpayParams);

        if (!verify.isVerified) {
            return res.status(200).json({
                RspCode: '97',
                Message: 'Invalid signature',
            });
        }

        const { vnp_TxnRef, vnp_Amount, vnp_ResponseCode } = vnpayParams;

        // Find transaction
        const transaction = await PaymentTransaction.findOne({
            transaction_code: vnp_TxnRef,
        });

        if (!transaction) {
            return res.status(200).json({
                RspCode: '01',
                Message: 'Transaction not found',
            });
        }

        // Check if transaction already confirmed
        if (transaction.payment_status === 'Success') {
            return res.status(200).json({
                RspCode: '02',
                Message: 'Transaction already confirmed',
            });
        }

        // Check amount match
        const expectedAmount = transaction.amount;
        const paidAmount = parseInt(vnp_Amount) / 100;


        if (expectedAmount !== paidAmount) {
            return res.status(200).json({
                RspCode: '04',
                Message: 'Invalid amount',
            });
        }
        await updateTransactionStatusService(vnp_TxnRef, vnp_ResponseCode);
        return res.status(200).json({
            RspCode: '00',
            Message: 'Success',
        });

    } catch (error) {
        console.error('VNPay IPN error:', error);
        return res.status(200).json({
            RspCode: '99',
            Message: 'System error',
        });
    }
};

/**
 * @route GET /api/payment/:orderId/status
 * @desc Get payment status for an order
 * @access Public (later should be protected)
 */
export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const transaction = await PaymentTransaction.findOne({
            order_id: orderId,
        }).populate('order_id', 'user_id total_amount order_status payment_status');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Payment transaction not found',
            });
        }

        return res.status(200).json({
            success: true,
            payment: {
                transactionCode: transaction.transaction_code,
                method: transaction.method,
                amount: transaction.amount,
                status: transaction.payment_status,
                createdAt: transaction.created_at,
                order: transaction.order_id,
            },
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get payment status',
            error: error.message,
        });
    }
};
