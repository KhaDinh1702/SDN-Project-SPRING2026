import vnpay from './vnpay.config.js';
import PaymentTransaction from '../../models/PaymentTransaction.js';
import Order from '../../models/Order.js';
import { ProductCode, VnpLocale } from 'vnpay';

/**
 * @route POST /api/payment/vnpay/create
 * @desc Create VNPay payment URL
 * @access Public (later should be protected)
 */
export const createPaymentUrl = async (req, res) => {
    try {
        const { orderId, amount, orderInfo, bankCode } = req.body;

        // Validate required fields
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

        // Get client IP address
        const ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '127.0.0.1';

        // Generate unique transaction reference
        const txnRef = `${orderId}_${Date.now()}`;

        // Build payment URL
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr,
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

        return res.status(200).json({
            success: true,
            message: 'Payment URL created successfully',
            paymentUrl: paymentUrl,
            transactionCode: txnRef,
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

        // Verify return URL
        const verify = vnpay.verifyReturnUrl(vnpayParams);

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

        // Extract transaction info
        const { vnp_TxnRef, vnp_Amount, vnp_ResponseCode, vnp_TransactionNo, vnp_BankCode, vnp_CardType } = vnpayParams;

        // Find and update payment transaction
        const transaction = await PaymentTransaction.findOne({
            transaction_code: vnp_TxnRef,
        });

        if (!transaction) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/failure?message=Transaction not found`,
            );
        }

        // Update transaction status
        transaction.payment_status = vnp_ResponseCode === '00' ? 'Success' : 'Failed';

        // Add VNPay response details (store in a metadata field if available, or create new fields)
        // For now, we'll update what we have in the model
        await transaction.save();

        // Update order payment status if payment successful
        if (vnp_ResponseCode === '00') {
            const order = await Order.findById(transaction.order_id);
            if (order) {
                order.payment_status = 'Paid';
                order.order_status = 'Processing';
                await order.save();
            }
        }

        // Redirect to frontend with result
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

        // Verify IPN signature
        const verify = vnpay.verifyIpnCall(vnpayParams);

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
                Message: 'Amount mismatch',
            });
        }

        // Update transaction
        if (vnp_ResponseCode === '00') {
            transaction.payment_status = 'Success';
            await transaction.save();

            // Update order
            const order = await Order.findById(transaction.order_id);
            if (order) {
                order.payment_status = 'Paid';
                order.order_status = 'Processing';
                await order.save();
            }

            return res.status(200).json({
                RspCode: '00',
                Message: 'Success',
            });
        } else {
            transaction.payment_status = 'Failed';
            await transaction.save();

            return res.status(200).json({
                RspCode: '00',
                Message: 'Confirm failed transaction',
            });
        }
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

        // Find payment transaction
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
