import api from '@lib/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'therapist' | 'client';
  phone?: string;
  image?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category_id: number;
  category?: ServiceCategory;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// User Management API
export const userApi = {
  // Get all users with pagination and filtering
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    role?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get single user
  get: async (id: number): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.user;
  },

  // Create new user
  create: async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'admin' | 'therapist' | 'client';
    phone?: string;
  }): Promise<User> => {
    const response = await api.post('/admin/users', userData);
    return response.data.user;
  },

  // Update user
  update: async (id: number, userData: {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: 'admin' | 'therapist' | 'client';
    phone?: string;
  }): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.user;
  },

  // Delete user
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};

// Service Management API
export const serviceApi = {
  // Get all services with pagination and filtering
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    category?: number;
    search?: string;
  }): Promise<PaginatedResponse<Service>> => {
    const response = await api.get('/admin/services', { params });
    return response.data;
  },

  // Create new service
  create: async (serviceData: {
    name: string;
    description: string;
    price: number;
    duration: number;
    category_id: number;
    image?: File;
    is_active?: boolean;
  }): Promise<Service> => {
    const formData = new FormData();
    
    formData.append('name', serviceData.name);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price.toString());
    formData.append('duration', serviceData.duration.toString());
    formData.append('category_id', serviceData.category_id.toString());
    formData.append('is_active', (serviceData.is_active ?? true).toString());
    
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    const response = await api.post('/admin/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.service;
  },

  // Update service
  update: async (id: number, serviceData: {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    category_id?: number;
    image?: File;
    is_active?: boolean;
  }): Promise<Service> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    if (serviceData.name) formData.append('name', serviceData.name);
    if (serviceData.description) formData.append('description', serviceData.description);
    if (serviceData.price !== undefined) formData.append('price', serviceData.price.toString());
    if (serviceData.duration !== undefined) formData.append('duration', serviceData.duration.toString());
    if (serviceData.category_id !== undefined) formData.append('category_id', serviceData.category_id.toString());
    if (serviceData.is_active !== undefined) formData.append('is_active', serviceData.is_active.toString());
    
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    const response = await api.post(`/admin/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.service;
  },

  // Delete service
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/services/${id}`);
  },
};

// Category Management API
export const categoryApi = {
  // Get all categories with pagination and filtering
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<ServiceCategory>> => {
    const response = await api.get('/admin/categories', { params });
    return response.data;
  },

  // Get single category
  get: async (id: number): Promise<ServiceCategory> => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data.category;
  },

  // Create new category
  create: async (categoryData: {
    name: string;
    description?: string;
    image?: File;
    is_active?: boolean;
  }): Promise<ServiceCategory> => {
    const formData = new FormData();
    
    formData.append('name', categoryData.name);
    if (categoryData.description) formData.append('description', categoryData.description);
    formData.append('is_active', (categoryData.is_active ?? true).toString());
    
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await api.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.category;
  },

  // Update category
  update: async (id: number, categoryData: {
    name?: string;
    description?: string;
    image?: File;
    is_active?: boolean;
  }): Promise<ServiceCategory> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.description) formData.append('description', categoryData.description);
    if (categoryData.is_active !== undefined) formData.append('is_active', categoryData.is_active.toString());
    
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await api.post(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.category;
  },

  // Delete category
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};
