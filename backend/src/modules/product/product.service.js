import Category from '../../models/Category.js';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { ErrorWithStatus } from '../../utils/error.js';
import Product from '../../models/Product.js';
import { USERS_MESSAGES } from '../../constants/messages.js';
import { deleteImage, uploadImage } from '../../../services/storage.service.js';

export const getAllProducts = async ({ categoryId, keyword }) => {
  const filter = { is_active: true };
  if (categoryId) {
    filter.category = categoryId;
  }
  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }
  return await Product.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 });
};

export const getProductById = async (id) => {
  return await Product.findById(id).populate('category', 'name');
};

export const createProduct = async (payload, files = []) => {
  let uploadedImages = [];

  if (!files || files.length === 0) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'At least one image is required',
    });
  }

  const categoryExists = await Category.exists({ _id: payload.category });
  if (!categoryExists) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: 'Category not found',
    });
  }

  try {
    uploadedImages = await Promise.all(
      files.map((file) => uploadImage(file, 'products')),
    );

    const data = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      origin: payload.origin,
      expiry_date: payload.expiry_date,
      weight: payload.weight,
      unit: payload.unit,
      category: payload.category,
      images: uploadedImages.map((key, index) => ({
        url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
        publicId: key,
        isPrimary: index === 0,
      })),
    };

    return await Product.create(data);
  } catch (error) {
    if (uploadedImages.length > 0) {
      await Promise.all(uploadedImages.map((key) => deleteImage(key)));
    }

    if (error.code === 11000) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Duplicate product',
      });
    }
    throw error;
  }
};

export const updateProduct = async (id, payload, files = []) => {
  if (files && files.length > 0) {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    const uploadedImages = await Promise.all(
      files.map((file) => uploadImage(file, 'products')),
    );

    if (existingProduct.images?.length > 0) {
      await Promise.all(
        existingProduct.images.map((img) => deleteImage(img.publicId)),
      );
    }

    payload.images = uploadedImages.map((key, index) => ({
      url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
      publicId: key,
      isPrimary: index === 0,
    }));
  }

  if (payload.category) {
    const categoryExists = await Category.exists({
      _id: payload.category,
    });

    if (!categoryExists) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Category not found',
      });
    }
  }

  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!product) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.PRODUCT_NOT_FOUND,
    });
  }

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.PRODUCT_NOT_FOUND,
    });
  }

  if (product.stock_quantity > 0) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'Cannot delete product with remaining stock',
    });
  }

  product.is_active = false;
  await product.save();
  return product;
};
