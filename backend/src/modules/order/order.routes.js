import { Router } from 'express';
import {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    updateOrderStatus,
    getUserPurchaseSummary,
    getUserPurchaseHistory
}
    from './order.controller.js';

const orderRouter = Router();

/**
 * @route PATCH /api/orders/:orderId/status
 * @desc Update order status
 * @access Private (admin or staff)
 */
orderRouter.patch('/:orderId/status', updateOrderStatus);

/**
 * @route POST /api/orders
 * @desc Create a new order
 * @access Private (later)
 */
orderRouter.post('/', createOrder);

/**
 * @route GET /api/orders
 * @desc Get all orders
 * @access Private (later)
 */
orderRouter.get('/', getAllOrders);

/**
 * @route GET /api/orders/user/:userId
 * @desc Get orders for a specific customer
 * @access Private (later)
 */
orderRouter.get('/user/:userId', getOrdersByUserId);

/**
 * @route GET /api/orders/user/:userId/summary
 * @desc Get purchase summary (total spent, items) for a customer
 * @access Private (later)
 */
orderRouter.get('/user/:userId/summary', getUserPurchaseSummary);

/**
 * @route GET /api/orders/user/:userId/history
 * @desc Get detailed purchase history for a customer
 * @access Private (later)
 */
orderRouter.get('/user/:userId/history', getUserPurchaseHistory);

export default orderRouter;
