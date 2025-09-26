import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'therapist' | 'client';
  phone?: string;
  email_verified_at?: string;
  avatar?: string;
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
      await api.post('/auth/logout');
      return null;
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
  async (profileData: { name: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] | Record<string, string[]>; message?: string } } };
      return rejectWithValue(
        axiosError.response?.data?.message || 'Profile update failed'
      );
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
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
      })
      .addCase(updateProfile.rejected, (state, action) => {
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