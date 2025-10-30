import axios from 'axios';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('http://localhost:3000/api/auth/register', { username, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('http://localhost:3000/api/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('http://localhost:3000/api/auth/me');
    return response.data;
  },
};

// Payment API calls
export const paymentAPI = {
  createCheckoutSession: async (packageId: string) => {
    const response = await api.post('http://localhost:3000/api/payment/create-checkout-session', { packageId });
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('http://localhost:3000/api/payment/transactions');
    return response.data;
  },
};

export default api;

