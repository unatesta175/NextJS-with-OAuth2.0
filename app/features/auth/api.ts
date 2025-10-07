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
  },

  googleLogin: async (googleData: {
    token: string;
    email: string;
    name: string;
    google_id: string;
    avatar?: string;
  }) => {
    const response = await api.post('/auth/google', googleData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetData: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  updateProfile: async (formData: FormData) => {
    console.log('👤 Calling updateProfile API with URL: /auth/profile');
    console.log('👤 Method: POST');
    console.log('👤 Data: FormData with keys:', Array.from(formData.keys()));
    const response = await api.post('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (passwordData: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    console.log('🔐 Calling changePassword API with URL: /auth/change-password');
    console.log('🔐 Method: PUT');
    console.log('🔐 Data:', { ...passwordData, current_password: '[HIDDEN]', password: '[HIDDEN]', password_confirmation: '[HIDDEN]' });
    const response = await api.put('/auth/change-password', passwordData);
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

// Google OAuth API
export async function googleLoginApi(googleData: {
  token: string;
  email: string;
  name: string;
  google_id: string;
  avatar?: string;
}) {
  try {
    return await authApi.googleLogin(googleData);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Google login failed');
  }
}

// Password Reset APIs
export async function forgotPasswordApi(email: string) {
  try {
    return await authApi.forgotPassword(email);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to send password reset email');
  }
}

export async function resetPasswordApi(resetData: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  try {
    return await authApi.resetPassword(resetData);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Password reset failed');
  }
}