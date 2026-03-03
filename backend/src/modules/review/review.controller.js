import { wrapAsync } from '../../utils/handlers.js';
import * as reviewService from './review.service.js';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { ErrorWithStatus } from '../../utils/error.js';

export const createReview = wrapAsync(async (req, res) => {
    const userId = req.currentUser._id;
    const { productId, rating, comment, isAnonymous } = req.body;

    if (!productId || !rating) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'Product ID and rating are required',
        });
    }

    const review = await reviewService.createReview({
        userId,
        productId,
        rating,
        comment,
        isAnonymous,
    });

    return res.status(HTTP_STATUS.CREATED).json({
        message: 'Review created successfully',
        data: review,
    });
});

export const getReviewsByProduct = wrapAsync(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'Product ID is required',
        });
    }

    const reviews = await reviewService.getReviewsByProduct(productId);

    return res.status(HTTP_STATUS.OK).json({
        message: 'Get reviews successfully',
        data: reviews,
    });
});

export const deleteReview = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.currentUser._id;

    if (!id) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'Review ID is required',
        });
    }

    await reviewService.deleteReview(id, userId);

    return res.status(HTTP_STATUS.OK).json({
        message: 'Review deleted successfully',
    });
});
