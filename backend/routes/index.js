const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const stockRoutes = require('./stockRoutes');

router.use('/auth', authRoutes);         // Module 1
router.use('/products', productRoutes); // Module 2
router.use('/categories', categoryRoutes); // Category API
router.use('/orders', orderRoutes);     // Module 3
router.use('/stock', stockRoutes);      // Module 4

module.exports = router;