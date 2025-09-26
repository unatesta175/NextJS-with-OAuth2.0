import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from './types';
import { loginApi, registerApi } from './api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return await registerApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      if (typeof window !== 'undefined') localStorage.removeItem('auth');
    },
    loadAuth: (state) => {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('auth');
        if (data) {
          const parsed = JSON.parse(data);
          state.user = parsed.user;
          state.isAuthenticated = parsed.isAuthenticated;
          state.token = parsed.token;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') localStorage.setItem('auth', JSON.stringify(state));
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') localStorage.setItem('auth', JSON.stringify(state));
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(register.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { logout, loadAuth } = authSlice.actions;
export default authSlice.reducer;
