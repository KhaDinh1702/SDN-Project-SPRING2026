import Category from '../../models/Category.js';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { ErrorWithStatus } from '../../utils/error.js';
import Product from '../../models/Product.js';
import { USERS_MESSAGES } from '../../constants/messages.js';

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

export const createProduct = async (payload) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'Product list must be an array and not empty',
    });
  }

  const data = payload.map((item) => ({
    name: item.name,
    description: item.description,
    price: item.price,
    origin: item.origin,
    expiry_date: item.expiry_date,
    weight: item.weight,
    unit: item.unit,
    stock_quantity: item.stock_quantity ?? 0,
    is_active: item.is_active ?? true,
    category_id: item.category_id,
  }));

  const categoryIds = [
    ...new Set(data.map((p) => p.category_id).filter(Boolean)),
  ];

  if (categoryIds.length > 0) {
    const count = await Category.countDocuments({
      _id: { $in: categoryIds },
    });

    if (count !== categoryIds.length) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.CATEGORY_NOT_FOUND,
      });
    }
  }

  return Product.create(data);
};

export const updateProduct = async (id, payload) => {
  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { is_active: false },
    { new: true },
  );

  if (!product) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.PRODUCT_NOT_FOUND,
    });
  }

  return product;
};
