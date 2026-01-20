const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const order = await Order.create({
            ...req.body,
            order_status: 'Pending',
            payment_status: 'Unpaid'
        });
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { createOrder };