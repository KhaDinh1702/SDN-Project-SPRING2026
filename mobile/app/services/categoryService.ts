// mobile/app/services/categoryService.ts
import { http } from './api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

interface CategoryResponse {
  success: boolean;
  categories?: Category[];
  data?: Category[];
}

interface CategoryDetailResponse {
  success: boolean;
  category?: Category;
  data?: Category;
}

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await http.get<CategoryResponse>('/api/categories');
    return response.categories || response.data || [];
  },

  // Get category by ID
  getById: async (id: string) => {
    const response = await http.get<CategoryDetailResponse>(`/api/categories/${id}`);
    return response.category || response.data;
  },

  // Create category (admin only)
  create: async (data: Partial<Category>) => {
    return http.post<CategoryDetailResponse>('/api/categories', data);
  },

  // Update category (admin only)
  update: async (id: string, data: Partial<Category>) => {
    return http.put<CategoryDetailResponse>(`/api/categories/${id}`, data);
  },

  // Delete category (admin only)
  delete: async (id: string) => {
    return http.delete<CategoryDetailResponse>(`/api/categories/${id}`);
  },
};
