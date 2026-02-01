
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

/**
 * Create a new order in the database
 * @param {Object} orderData - The order data to be saved
 * @returns {Promise<Object>} The created order document
 */
export const createOrderService = async (orderData) => {
	return await Order.create({
		...orderData,
		order_status: 'Pending',
		payment_status: 'Unpaid',
	});
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
