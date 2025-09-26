import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyapi.kapas-spa.com/api', // Replace with real API later
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const { token } = JSON.parse(auth);
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default api;
