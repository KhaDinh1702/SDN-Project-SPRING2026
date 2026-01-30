import axios from 'axios';

// Lấy URL từ file .env
const baseURL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;