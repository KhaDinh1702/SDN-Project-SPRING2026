import Category from '../../models/Category.js';

/**
 * GET /api/v1/categories
 * Get all categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true });
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default getAllCategories;
