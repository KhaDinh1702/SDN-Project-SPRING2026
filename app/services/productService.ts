// mobile/app/services/productService.ts
import { http } from './api';

export interface Product {
  totalReviews: number;
  averageRating: any;
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: Array<{ url: string; isPrimary?: boolean }>;
  stock_quantity: number;
  is_active: boolean;
  createdAt?: string;
}

export interface ProductResponse {
  success: boolean;
  products?: Product[];
  data?: Product[];
}

interface ProductDetailResponse {
  success: boolean;
  product?: Product;
  data?: Product;
}

export const productService = {
 // Get all products
getAll: async (params?: { categoryId?: string; keyword?: string }) => {
  const query = new URLSearchParams();
  if (params?.categoryId) query.append('categoryId', params.categoryId);
  if (params?.keyword) query.append('keyword', params.keyword);

  const res = await http.get<ProductResponse>(
    `/api/products${query.toString() ? `?${query.toString()}` : ''}`
  );

  return res.products || res.data || [];
},

// Get product by ID
getById: async (id: string) => {
  const res = await http.get<ProductDetailResponse>(
    `/api/products/${id}`
  );

  return res.product || res.data || null;
},
  // Create product (admin only)
  create: async (data: Partial<Product>) => {
    return http.post<ProductDetailResponse>('/api/products', data);
  },

  // Update product (admin only)
  update: async (id: string, data: Partial<Product>) => {
    return http.put<ProductDetailResponse>(`/api/products/${id}`, data);
  },

  // Delete product (admin only)
  delete: async (id: string) => {
    return http.delete<ProductDetailResponse>(`/api/products/${id}`);
  },
};
