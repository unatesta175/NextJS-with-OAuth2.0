import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel backend API
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Conditional debug interceptor (only in development)
const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data);
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      // Don't log expected 401 errors from auth/me endpoint
      if (!(error.response?.status === 401 && error.config?.url?.includes('/auth/me'))) {
        console.error('❌ Response Error:', error.response?.status, error.response?.data, error.message);
      }
      return Promise.reject(error);
    }
  );
}

export default api;


