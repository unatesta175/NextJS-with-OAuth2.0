import api from '@lib/axios';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

// Legacy exports for backward compatibility
export async function loginApi({ email, password }: { email: string; password: string }) {
  try {
    return await authApi.login({ email, password });
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    if (axiosError.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    if (axiosError.response?.status === 422) {
      throw new Error('Validation error - please check your input');
    }
    const baseError = error as { code?: string; message?: string };
    if (baseError.code === 'ERR_NETWORK' || baseError.message?.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
    }
    throw new Error(`Login failed: ${baseError.message || 'Unknown error'}`);
  }
}

export async function registerApi({ name, email, password }: { name: string; email: string; password: string }) {
  try {
    return await authApi.register({ 
      name, 
      email, 
      password, 
      password_confirmation: password 
    });
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Registration failed');
  }
}

export async function logoutApi() {
  try {
    await authApi.logout();
    return true;
  } catch {
    // Even if logout fails on server, we'll clear local storage
    return true;
  }
}