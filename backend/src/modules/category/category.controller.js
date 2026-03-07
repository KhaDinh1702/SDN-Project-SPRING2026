import categoryService from './category.service.js';
import { uploadImage } from '../../../services/storage.service.js';

export const getAllCategoriesController = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
};

export const getCategoryByIdController = async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

/**
 * Resolve image for a category request.
 * - If a file was uploaded via multer, upload it to R2 and return the public URL.
 * - If a plain URL string was sent in the body, use it directly.
 * - Otherwise return empty string.
 */
const resolveImage = async (req) => {
  if (req.file) {
    const key = await uploadImage(req.file, 'categories');
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
  }
  return req.body.image || '';
};

export const createCategoryController = async (req, res) => {
  const image = await resolveImage(req);
  const payload = { ...req.body, image };
  const category = await categoryService.createCategory(payload);

  res.status(201).json({
    success: true,
    data: category,
  });
};

export const updateCategoryController = async (req, res) => {
  const image = await resolveImage(req);
  const payload = { ...req.body, image };

  // If image is empty string and no new file sent, preserve the existing image
  // by not overwriting with empty (only overwrite when explicitly set)
  if (!req.file && !req.body.image) {
    delete payload.image;
  }

  const category = await categoryService.updateCategory(req.params.id, payload);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

export const deleteCategoryController = async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
};
