// Centralized configuration for the application
export const config = {
  // Backend API configuration
  api: {
    baseURL: 'http://localhost:8000',
    endpoints: {
      auth: '/api/auth',
      serviceCategories: '/api/service-categories',
      services: '/api/services',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
    }
  },
  
  // Asset URLs
  assets: {
    // Base URL for serving images and files from Laravel backend
    baseURL: 'http://localhost:8000',
    // Helper function to get full asset URL
    getAssetUrl: (path: string) => `${config.assets.baseURL}/${path}`,
  },
  
  // Application settings
  app: {
    name: 'Kapas Beauty Spa',
    version: '1.0.0',
  }
};

// Helper functions for easy access
export const getApiUrl = (endpoint: keyof typeof config.api.endpoints) => 
  `${config.api.baseURL}${config.api.endpoints[endpoint]}`;

export const getAssetUrl = (path: string) => 
  config.assets.getAssetUrl(path);

// Export commonly used URLs
export const API_BASE_URL = config.api.baseURL;
export const ASSETS_BASE_URL = config.assets.baseURL;
