// mobile/app/services/authService.ts

import { http } from './api';

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  role?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  user?: User;
}

export const authService = {
  // =========================
  // LOGIN
  // =========================
  login: async (email: string, password: string) => {
    const response = await http.post<AuthResponse>(
      '/api/auth/login',
      { email, password }
    );

    return response;
  },

  // =========================
  // REGISTER
  // =========================
  register: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    username: string;
    phone: string;
  }) => {
    const response = await http.post<AuthResponse>(
      '/api/auth/register',
      data
    );

    return response;
  },

  // =========================
  // FORGOT PASSWORD
  // =========================
  forgotPassword: async (email: string) => {
    const response = await http.post<AuthResponse>(
      '/api/auth/forgot-password',
      { email }
    );

    // backend thường trả { message: "..." }
    return response.message;
  },

  // =========================
  // RESET PASSWORD
  // =========================
  resetPassword: async (
    token: string,
    newPassword: string
  ) => {
    const response = await http.post<AuthResponse>(
      '/api/auth/reset-password',
      { token, newPassword }
    );

    return response.message;
  },
};