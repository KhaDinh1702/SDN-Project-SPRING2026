import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from './product.service.js';

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

export const createProductController = async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
};

export const updateProductController = async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.json(product);
};

export const deleteProductController = async (req, res) => {
  const product = await deleteProduct(req.params.id);
  res.json(product);
};
