const Product = require('../models/Product');

/**
 * GET /products
 * Lấy danh sách sản phẩm
 * Query: categoryId, keyword
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId, keyword } = req.query;

    const filter = {
      is_active: true
    };

    if (categoryId) {
      filter.category_id = categoryId;
    }

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    const products = await Product
      .find(filter)
      .populate('category_id', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET /products/:id
 * Lấy chi tiết sản phẩm
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product
      .findById(id)
      .populate('category_id', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
