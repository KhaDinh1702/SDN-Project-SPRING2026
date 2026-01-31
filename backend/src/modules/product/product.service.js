import Product from '../../models/Product.js';

export const getAllProducts = async ({ categoryId, keyword }) => {
  const filter = { is_active: true };
  if (categoryId) {
    filter.category_id = categoryId;
  }
  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }
  return await Product.find(filter)
    .populate('category_id', 'name')
    .sort({ createdAt: -1 });
};

export const getProductById = async (id) => {
  return await Product.findById(id).populate('category_id', 'name');
};
