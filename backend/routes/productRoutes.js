const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// GET /products -> list all products
router.get('/', async (req, res) => {
   try {
      const products = await productService.getAllProducts();
      res.json({ success: true, data: products });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
});

// GET /products/:id -> product details
router.get('/:id', async (req, res) => {
   try {
      const product = await productService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      res.json({ success: true, data: product });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
});

module.exports = router;