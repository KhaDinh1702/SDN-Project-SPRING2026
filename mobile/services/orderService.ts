// mobile/app/services/orderService.ts
import { http } from './api';

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderPayload {
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  shipping_address: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const orderService = {
  // ==========================
  // CREATE ORDER
  // ==========================
  create: async (data: CreateOrderPayload) => {
    const response = await http.post<ApiResponse<{ order: any; paymentUrl: string | null }>>(
      '/api/orders',
      data
    );

    if (!response.success) {
      throw new Error(response.message || 'Create order failed');
    }

    return response.data; // { order, paymentUrl }
  },

  // ==========================
  // GET ALL
  // ==========================
  getAll: async () => {
    const response = await http.get<ApiResponse<any[]>>(
      '/api/orders'
    );

    return response.success ? response.data : [];
  },

  // ==========================
  // GET BY USER
  // ==========================
  getByUserId: async (userId: string) => {
    const response = await http.get<ApiResponse<any[]>>(
      `/api/orders/user/${userId}`
    );

    return response.success ? response.data : [];
  },

  // ==========================
  // GET SUMMARY
  // ==========================
  getSummary: async (userId: string) => {
    const response = await http.get<ApiResponse<any>>(
      `/api/orders/user/${userId}/summary`
    );

    return response.success ? response.data : null;
  },

  // ==========================
  // GET HISTORY
  // ==========================
  getHistory: async (userId: string) => {
    const response = await http.get<ApiResponse<any[]>>(
      `/api/orders/user/${userId}/history`
    );

    return response.success ? response.data : [];
  },

  // ==========================
  // UPDATE STATUS
  // ==========================
  updateStatus: async (orderId: string, status: string) => {
    const response = await http.patch<ApiResponse<any>>(
      `/api/orders/${orderId}/status`,
      { order_status: status }
    );

    return response.success ? response.data : null;
  },
};