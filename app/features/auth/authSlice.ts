import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/axios';
import { showSuccessToast, showErrorToast } from '@lib/toast';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'therapist' | 'client';
  phone?: string;
  email_verified_at?: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to prevent premature redirects
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

// Login async thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] | Record<string, string[]>; message?: string } } };
      return rejectWithValue(
        axiosError.response?.data?.errors || axiosError.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Register async thunk  
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] | Record<string, string[]>; message?: string } } };
      return rejectWithValue(
        axiosError.response?.data?.errors || axiosError.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// Logout async thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch {
      // Even if logout fails on server, clear auth state
      return null;
    }
  }
);

// Check auth status - this will determine auth state from server
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return rejectWithValue('Authentication failed');
    }
  }
);

// Update profile async thunk
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { name?: string; phone?: string; password?: string; password_confirmation?: string; image?: File }, { rejectWithValue }) => {
    try {
      const { authApi } = await import('./api');
      
      // Create FormData
      const formData = new FormData();
      
      if (profileData.name) formData.append('name', profileData.name);
      if (profileData.phone) formData.append('phone', profileData.phone);
      if (profileData.password) formData.append('password', profileData.password);
      if (profileData.password_confirmation) formData.append('password_confirmation', profileData.password_confirmation);
      if (profileData.image) formData.append('image', profileData.image);
      
      const response = await authApi.updateProfile(formData);
      return response;
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] | Record<string, string[]>; message?: string } } };
      return rejectWithValue(
        axiosError.response?.data?.message || 'Profile update failed'
      );
    }
  }
);

// Change password async thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { current_password: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
    try {
      const { authApi } = await import('./api');
      const response = await authApi.changePassword(passwordData);
      return response;
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string }; status?: number } };
      
      // Handle validation errors (422 status)
      if (axiosError.response?.status === 422 && axiosError.response?.data?.errors) {
        return rejectWithValue(axiosError.response.data.errors);
      }
      
      // Handle other errors
      return rejectWithValue(
        axiosError.response?.data?.message || 'Password change failed'
      );
    }
  }
);

// Google login async thunk
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleData: { token: string; email: string; name: string; google_id: string; avatar?: string }, { rejectWithValue }) => {
    try {
      const { authApi } = await import('./api');
      const response = await authApi.googleLogin(googleData);
      showSuccessToast(response.message || 'Google login successful!');
      return response;
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] | Record<string, string[]>; message?: string } } };
      const message = axiosError.response?.data?.message || 'Google login failed';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

// Forgot password async thunk
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { authApi } = await import('./api');
      const response = await authApi.forgotPassword(email);
      showSuccessToast(response.message || 'Password reset email sent!');
      return response;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to send password reset email';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

// Reset password async thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData: { token: string; email: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
    try {
      const { authApi } = await import('./api');
      const response = await authApi.resetPassword(resetData);
      showSuccessToast(response.message || 'Password reset successful!');
      return response;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Password reset failed';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setNotLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Show success toast
        showSuccessToast(action.payload.message );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        // Show error toast with backend message
        const errorPayload = action.payload;
        let errorMessage = 'Login failed';
        
        // Handle Laravel validation errors structure
        if (typeof errorPayload === 'object' && errorPayload !== null) {
          // Check if it's Laravel validation errors (e.g., { email: ['error message'] })
          if ('email' in errorPayload && Array.isArray(errorPayload.email)) {
            errorMessage = errorPayload.email[0];
          } else if ('password' in errorPayload && Array.isArray(errorPayload.password)) {
            errorMessage = errorPayload.password[0];
          }
        } else if (typeof errorPayload === 'string') {
          errorMessage = errorPayload;
        }
        
        showErrorToast(errorMessage);
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Show success toast
        showSuccessToast(action.payload.message || 'Account created successfully! Welcome aboard!');
      }) 
           .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        // Show error toast with backend validation message
        const errorPayload = action.payload;
        let errorMessage = 'Registration failed. Please try again.';
        
        // Handle Laravel validation errors structure
        if (typeof errorPayload === 'object' && errorPayload !== null) {
          // Laravel returns errors as: { email: ['message'], password: ['message'] }
          // Extract the first error message from any field
          if ('email' in errorPayload && Array.isArray(errorPayload.email)) {
            errorMessage = errorPayload.email[0]; // e.g., "The email has already been taken."
          } else if ('password' in errorPayload && Array.isArray(errorPayload.password)) {
            errorMessage = errorPayload.password[0]; // e.g., "The password confirmation does not match."
          } else if ('name' in errorPayload && Array.isArray(errorPayload.name)) {
            errorMessage = errorPayload.name[0]; // e.g., "The name field is required."
          } else if ('phone' in errorPayload && Array.isArray(errorPayload.phone)) {
            errorMessage = errorPayload.phone[0];
          } 
        } else if (typeof errorPayload === 'string') {
          errorMessage = errorPayload;
        }
        
        showErrorToast(errorMessage);
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
        // Show success toast
        showSuccessToast(action.payload.message);
      })
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.user };
        state.error = null;
        // Show success toast
        showSuccessToast(action.payload.message || 'Profile updated successfully!');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Show error toast
        const errorMessage = action.payload as string;
        if (errorMessage && (errorMessage.includes('image') || errorMessage.includes('2 mb'))) {
          showErrorToast('Image must be less than 2 mb');
        } else {
          showErrorToast('Failed to update profile. Please try again.');
        }
      })
      // Change password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Show success toast
        showSuccessToast('Password changed successfully!');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        // Don't set error in state for password change - let the component handle it
        state.error = null;
      })
      // Google login cases
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAuth, setNotLoading } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

// Legacy exports for backward compatibility
export const login = loginUser;
export const register = registerUser;
export const logout = logoutUser;