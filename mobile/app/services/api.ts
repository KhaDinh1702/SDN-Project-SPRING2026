// mobile/app/services/api.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.74:5001';

export async function apiCall<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await AsyncStorage.getItem('token');

  const url = `${BASE_URL}${path}`;

  console.log('[API] →', url); // 🔍 debug

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[API] ✗', url, response.status, error);
    throw new Error(error || response.statusText);
  }

  return response.json();
}

// Helper methods
export const http = {
  get: <T,>(path: string) => apiCall<T>(path, { method: 'GET' }),
  post: <T,>(path: string, data?: any) =>
    apiCall<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T,>(path: string, data?: any) =>
    apiCall<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T,>(path: string, data?: any) =>
    apiCall<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T,>(path: string) => apiCall<T>(path, { method: 'DELETE' }),
};