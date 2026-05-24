import axios from 'axios';
import axiosRetry from 'axios-retry';

const BASE_URL = import.meta.env.VITE_API_URL
  || 'https://amazon-orders-api.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Retry configuration
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 1s, 2s, 3s
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error)
      || error.response?.status === 429
      || error.response?.status >= 500;
  },
  onRetry: (retryCount, error) => {
    console.warn(`Retry attempt ${retryCount} for: ${error.config?.url}`);
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('orderpulse_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('orderpulse_token');
      localStorage.removeItem('orderpulse_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
