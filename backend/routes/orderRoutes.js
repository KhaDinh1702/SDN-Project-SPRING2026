const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// Route tạo đơn hàng
router.post('/', createOrder);

module.exports = router;