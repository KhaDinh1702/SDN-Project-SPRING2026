import HTTP_STATUS from '../../constants/httpStatus.js';
import { ErrorWithStatus } from '../../utils/error.js';
import Dish from '../../models/Dish.js';
import Product from '../../models/Product.js';
import { deleteImage, uploadImage } from '../../../services/storage.service.js';

export const getAllDishes = async ({ keyword }) => {
    const filter = { is_active: true };
    if (keyword) {
        filter.name = { $regex: keyword, $options: 'i' };
    }
    return await Dish.find(filter)
        .populate('products.product', 'name images')
        .sort({ createdAt: -1 });
};

export const getDishById = async (id) => {
    return await Dish.findById(id).populate('products.product', 'name images');
};

export const createDish = async (payload, files = []) => {
    let uploadedImages = [];

    // Validate Products inside the dish payload if provided
    if (payload.products && payload.products.length > 0) {
        const productIds = payload.products.map(p => p.product);
        const validProductsCount = await Product.countDocuments({ _id: { $in: productIds } });
        if (validProductsCount !== productIds.length) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'One or more products are invalid',
            });
        }
    }

    try {
        if (files && files.length > 0) {
            uploadedImages = await Promise.all(
                files.map((file) => uploadImage(file, 'dishes')),
            );
        }

        const data = {
            name: payload.name,
            description: payload.description,
            is_active: payload.is_active !== undefined ? payload.is_active : true,
            products: payload.products || [],
            images: uploadedImages.map((key, index) => ({
                url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
                publicId: key,
                isPrimary: index === 0,
            })),
        };

        return await Dish.create(data);
    } catch (error) {
        if (uploadedImages.length > 0) {
            await Promise.all(uploadedImages.map((key) => deleteImage(key)));
        }
        throw error;
    }
};

export const updateDish = async (id, payload, files = []) => {
    const existingDish = await Dish.findById(id);

    if (!existingDish) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.NOT_FOUND,
            message: 'Dish not found',
        });
    }

    if (payload.products && payload.products.length > 0) {
        const productIds = payload.products.map(p => p.product);
        const validProductsCount = await Product.countDocuments({ _id: { $in: productIds } });
        if (validProductsCount !== productIds.length) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'One or more products are invalid',
            });
        }
    }

    if (files && files.length > 0) {
        const uploadedImages = await Promise.all(
            files.map((file) => uploadImage(file, 'dishes')),
        );

        if (existingDish.images?.length > 0) {
            await Promise.all(
                existingDish.images.map((img) => deleteImage(img.publicId)),
            );
        }

        payload.images = uploadedImages.map((key, index) => ({
            url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
            publicId: key,
            isPrimary: index === 0,
        }));
    }

    const dish = await Dish.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate('products.product', 'name images');

    return dish;
};

export const deleteDish = async (id) => {
    const dish = await Dish.findById(id);

    if (!dish) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.NOT_FOUND,
            message: 'Dish not found',
        });
    }

    dish.is_active = false;
    await dish.save();
    return dish;
};
