// mobile/app/services/reviewService.ts
import { http } from './api';

export interface Review {
    _id: string;
    user_id: {
        _id: string;
        first_name: string;
        last_name: string;
        username?: string;
    };
    product_id: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewResponse {
    success: boolean;
    reviews?: Review[];
    data?: Review[];
}

export const reviewService = {
    // Get reviews by product ID
    getByProduct: async (productId: string): Promise<Review[]> => {
        const res = await http.get<ReviewResponse>(
            `/api/reviews/product/${productId}`
        );
        return res.reviews || res.data || [];
    },
};
