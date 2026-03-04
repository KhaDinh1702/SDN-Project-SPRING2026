import categoryService from './category.service.js';

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

export const createCategoryController = async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
};

export const updateCategoryController = async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
  );

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
