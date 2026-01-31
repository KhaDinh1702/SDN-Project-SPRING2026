import { getAllProducts, getProductById } from './product.service.js';

/**
 * GET /api/v1/product
 * Get all products
 */
export const getAllProductsController = async (req, res) => {
  try {
    const { categoryId, keyword } = req.query;
    const products = await getAllProducts({
      categoryId,
      keyword,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/product
 * Get product by ID
 */
export const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
