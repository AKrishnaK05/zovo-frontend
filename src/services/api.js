// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://zovo-backend.azurewebsites.net";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug log
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`,
      token ? '[Auth: ✓]' : '[Auth: ✗]'
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Debug: Log server error details
    if (error.response) {
      console.error('❌ Server Error Response:', JSON.stringify(error.response.data, null, 2));
    }

    return Promise.reject(error);
  }
);

export default api;