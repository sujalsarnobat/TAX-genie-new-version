/**
 * Centralized Axios instance for all API calls
 * Handles:
 * - Base URL configuration
 * - Request/Response timeout
 * - JWT token injection
 * - Error handling
 * - Request/Response logging (development)
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Development logging (remove for production)
    if (import.meta.env.DEV) {
      console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Development logging
    if (import.meta.env.DEV) {
      console.log(`📥 [${response.status}] ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized → Clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }

    // Development error logging
    if (import.meta.env.DEV) {
      console.error(`❌ [${error.response?.status}] ${error.config?.url}`, error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
