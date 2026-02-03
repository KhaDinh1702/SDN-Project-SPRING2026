import { Router } from 'express';
import {
    createPaymentUrl,
    vnpayCallback,
    vnpayIPN,
    getPaymentStatus,
} from './payment.controller.js';

const paymentRouter = Router();

/**
 * @route POST /api/payment/vnpay/create
 * @desc Create VNPay payment URL
 * @access Public (later should add authentication)
 */
paymentRouter.post('/vnpay/create', createPaymentUrl);

/**
 * @route GET /api/payment/vnpay/callback
 * @desc VNPay return URL callback after customer completes payment
 * @access Public
 */
paymentRouter.get('/vnpay/callback', vnpayCallback);

/**
 * @route POST /api/payment/vnpay/ipn
 * @desc VNPay IPN (Instant Payment Notification) endpoint
 * @access Public - Called by VNPay servers
 */
paymentRouter.post('/vnpay/ipn', vnpayIPN);

/**
 * @route GET /api/payment/:orderId/status
 * @desc Get payment status for an order
 * @access Public (later should add authentication)
 */
paymentRouter.get('/:orderId/status', getPaymentStatus);

export default paymentRouter;
