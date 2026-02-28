
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
	const orders = await Order.find({})
		.populate('user_id', 'name email fullName')
		.sort({ created_at: -1 })
		.lean();

	// Attach populated products to each order for admin view
	const history = await Promise.all(
		orders.map(async (order) => {
			const items = await OrderProduct.find({ order_id: order._id })
				.populate('product_id', 'name images price')
				.lean();

			return {
				...order,
				items,
			};
		})
	);

	return history;
};

/**
 * Get all orders for a specific customer by user ID
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<Array>} List of orders for the user
 */
export const getOrdersByUserIdService = async (userId) => {
	return await Order.find({ user_id: userId });
};

/**
 * Get purchase summary for a specific user (total amount spent, total items bought, total valid orders)
 * Only considers successfully paid/completed orders depending on your business logic.
 * For now, excluding "Cancelled" orders from the total history.
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<Object>} Purchase summary
 */
export const getUserPurchaseSummaryService = async (userId) => {
	const mongoose = (await import('mongoose')).default;
	const userObjectId = new mongoose.Types.ObjectId(String(userId));

	// 1. Find all non-cancelled orders for user
	const validOrders = await Order.find({
		user_id: userObjectId,
		order_status: { $ne: 'Cancelled' }
	});

	if (!validOrders.length) {
		return { total_spent: 0, total_items: 0, total_orders: 0 };
	}

	const orderIds = validOrders.map(order => order._id);

	// 2. Aggregate total spent directly from valid orders
	const totalSpent = validOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

	// 3. Aggregate total items from OrderProduct
	const itemsAggregation = await OrderProduct.aggregate([
		{ $match: { order_id: { $in: orderIds } } },
		{
			$group: {
				_id: null,
				totalQuantity: { $sum: "$quantity" }
			}
		}
	]);

	const totalItems = itemsAggregation.length > 0 ? itemsAggregation[0].totalQuantity : 0;

	return {
		total_spent: totalSpent,
		total_items: totalItems,
		total_orders: validOrders.length
	};
};

/**
 * Get detailed purchase history for a specific user.
 * Returns order details along with populated order items (product details).
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<Array>} List of user orders with products attached
 */
export const getUserPurchaseHistoryService = async (userId) => {
	const mongoose = (await import('mongoose')).default;
	const userObjectId = new mongoose.Types.ObjectId(String(userId));

	// Fetch all orders for this user, sorted by most recent
	const orders = await Order.find({ user_id: userObjectId })
		.sort({ created_at: -1 })
		.lean();

	// Attach populated products to each order
	const history = await Promise.all(
		orders.map(async (order) => {
			const items = await OrderProduct.find({ order_id: order._id })
				.populate('product_id', 'name images price') // Load product details
				.lean();

			return {
				...order,
				items,
			};
		})
	);

	return history;
};
