import {
  updateOrderStatusService,
  createOrderService,
  getAllOrdersService,
  getOrdersByUserIdService,
  getUserPurchaseSummaryService,
  getUserPurchaseHistoryService
}
  from './order.service.js';

/**
 * PATCH /api/orders/:orderId/status
 * Update the status of an order
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;
    if (!order_status) {
      return res.status(400).json({ success: false, message: 'order_status is required' });
    }
    const order = await updateOrderStatusService(orderId, order_status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/orders
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const result = await createOrderService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/orders
 * Get all orders (admin/management)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/orders/user/:userId
 * Get all orders for a specific customer
 */
export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await getOrdersByUserIdService(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/orders/user/:userId/summary
 * Get purchase summary (total spent and total items) for a user
 */
export const getUserPurchaseSummary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const summary = await getUserPurchaseSummaryService(userId);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/orders/user/:userId/history
 * Get detailed purchase history (with products) for a user
 */
export const getUserPurchaseHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await getUserPurchaseHistoryService(userId);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
