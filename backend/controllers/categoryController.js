const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllCategories
};
