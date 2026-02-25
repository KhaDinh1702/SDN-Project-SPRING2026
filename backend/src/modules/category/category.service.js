import HTTP_STATUS from '../../constants/httpStatus.js';
import Category from '../../models/Category.js';
import { ErrorWithStatus } from '../../utils/error.js';

const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

export const createCategory = async (payload) => {
  const { name } = payload;

  const existingCategory = await Category.findOne({
    name: new RegExp(`^${name}$`, 'i'),
  });

  if (existingCategory) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'Category already exists',
    });
  }

  const category = await Category.create({ name });
  return category;
};

const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
