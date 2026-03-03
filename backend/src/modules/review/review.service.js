import Review from '../../models/Review.js';
import Product from '../../models/Product.js';
import { ErrorWithStatus } from '../../utils/error.js';
import HTTP_STATUS from '../../constants/httpStatus.js';

export const createReview = async ({ userId, productId, rating, comment, isAnonymous }) => {

    const product = await Product.findById(productId);
    if (!product) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.NOT_FOUND,
            message: 'Product not found',
        });
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'You have already reviewed this product',
        });
    }

    const review = new Review({
        user: userId,
        product: productId,
        rating,
        comment,
        isAnonymous: Boolean(isAnonymous),
    });

    await review.save();

    await review.populate('user', 'first_name last_name avatar_url');

    return review;
};

export const getReviewsByProduct = async (productId) => {
    const reviews = await Review.find({ product: productId })
        .populate('user', 'first_name last_name avatar_url')
        .sort({ createdAt: -1 });

    return reviews;
};

export const deleteReview = async (reviewId, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.NOT_FOUND,
            message: 'Review not found',
        });
    }

    if (review.user.toString() !== userId.toString()) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.FORBIDDEN,
            message: 'You are not authorized to delete this review',
        });
    }

    await review.deleteOne();
    return true;
};
