
import Order from '../../models/Order.js';

/**
 * Update the status of an order by its ID
 * @param {string} orderId - The order's ObjectId
 * @param {string} order_status - The new status
 * @returns {Promise<Object|null>} The updated order or null if not found
 */
export const updateOrderStatusService = async (orderId, order_status) => {
	return await Order.findByIdAndUpdate(
		orderId,
		{ order_status },
		{ new: true }
	);
};

import OrderProduct from '../../models/OrderProduct.js';
import { createPaymentUrlService } from '../payment/payment.service.js';

/**
 * Create a new order in the database with items and payment
 * @param {Object} orderData - The order data
 * @returns {Promise<Object>} The created order result
 */
export const createOrderService = async (orderData) => {
	const { items, payment_method, shipping_address, user_id, total_amount } = orderData;
	// Create Order
	const newOrder = await Order.create({
		user_id,
		total_amount,
		payment_method,
		shipping_address,
		order_status: 'Pending',
		payment_status: 'Unpaid',
	});

	// Create Order Items
	if (items && items.length > 0) {
		const orderProducts = items.map(item => ({
			order_id: newOrder._id,
			product_id: item.product_id,
			quantity: item.quantity,
			unit_price: item.unit_price,
			total_price: item.quantity * item.unit_price
		}));
		await OrderProduct.insertMany(orderProducts);
	}

	// Handle Payment
	let paymentUrl = null;
	if (payment_method === 'VNPay') {
		const result = await createPaymentUrlService({
			orderId: newOrder._id,
			amount: total_amount,
			orderInfo: `Pay for order ${newOrder._id}`,
			ipAddr: '127.0.0.1'
		});
		paymentUrl = result.paymentUrl;
	}

	return {
		order: newOrder,
		paymentUrl
	};
};

/**
 * Get all orders from the database (for admin or management)
 * @returns {Promise<Array>} List of all orders
 */
export const getAllOrdersService = async () => {
	return await Order.find({});
};

/**
 * Get all orders for a specific customer by user ID
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<Array>} List of orders for the user
 */
export const getOrdersByUserIdService = async (userId) => {
	return await Order.find({ user_id: userId });
};
