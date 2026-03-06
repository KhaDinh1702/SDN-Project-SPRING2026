// mobile/app/services/paymentService.ts
import { http } from './api';

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionCode?: string;
  message?: string;
  payment?: any;
  data?: any;
}

export const paymentService = {
  // Create VNPay payment URL
  createVNPayUrl: async (data: {
    orderId: string;
    amount: number;
    orderInfo: string;
    bankCode?: string;
  }) => {
    const response = await http.post<PaymentResponse>('/api/payment/vnpay/create', data);
    return response;
  },

  // Check payment status
  checkPaymentStatus: async (orderId: string) => {
    const response = await http.get<PaymentResponse>(`/api/payment/${orderId}/status`);
    return response;
  },

  // Handle payment callback (called by VNPay)
  // Note: This is typically handled by backend directly
  handleCallback: async (params: Record<string, any>) => {
    const query = new URLSearchParams(params);
    return http.get<PaymentResponse>(`/api/payment/vnpay/callback?${query.toString()}`);
  },
};
