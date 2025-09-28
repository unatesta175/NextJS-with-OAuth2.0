import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi, serviceApi, categoryApi, User, Service, ServiceCategory, PaginatedResponse } from './api';
import { showSuccessToast, showErrorToast } from '@lib/toast';

interface AdminState {
  users: {
    data: User[];
    pagination: Omit<PaginatedResponse<User>, 'data'> | null;
    loading: boolean;
    error: string | null;
  };
  services: {
    data: Service[];
    pagination: Omit<PaginatedResponse<Service>, 'data'> | null;
    loading: boolean;
    error: string | null;
  };
  categories: {
    data: ServiceCategory[];
    pagination: Omit<PaginatedResponse<ServiceCategory>, 'data'> | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminState = {
  users: {
    data: [],
    pagination: null,
    loading: false,
    error: null,
  },
  services: {
    data: [],
    pagination: null,
    loading: false,
    error: null,
  },
  categories: {
    data: [],
    pagination: null,
    loading: false,
    error: null,
  },
};

// User Management Thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params?: { page?: number; per_page?: number; role?: string; search?: string }) => {
    return await userApi.getAll(params);
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData: Parameters<typeof userApi.create>[0], { rejectWithValue }) => {
    try {
      const user = await userApi.create(userData);
      showSuccessToast('User created successfully!');
      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create user';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, userData }: { id: number; userData: Parameters<typeof userApi.update>[1] }, { rejectWithValue }) => {
    try {
      const user = await userApi.update(id, userData);
      showSuccessToast('User updated successfully!');
      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userApi.delete(id);
      showSuccessToast('User deleted successfully!');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

// Service Management Thunks
export const fetchServices = createAsyncThunk(
  'admin/fetchServices',
  async (params?: { page?: number; per_page?: number; category?: number; search?: string }) => {
    return await serviceApi.getAll(params);
  }
);

export const createService = createAsyncThunk(
  'admin/createService',
  async (serviceData: Parameters<typeof serviceApi.create>[0], { rejectWithValue }) => {
    try {
      const service = await serviceApi.create(serviceData);
      showSuccessToast('Service created successfully!');
      return service;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create service';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

export const updateService = createAsyncThunk(
  'admin/updateService',
  async ({ id, serviceData }: { id: number; serviceData: Parameters<typeof serviceApi.update>[1] }, { rejectWithValue }) => {
    try {
      const service = await serviceApi.update(id, serviceData);
      showSuccessToast('Service updated successfully!');
      return service;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update service';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteService = createAsyncThunk(
  'admin/deleteService',
  async (id: number, { rejectWithValue }) => {
    try {
      await serviceApi.delete(id);
      showSuccessToast('Service deleted successfully!');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete service';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

// Category Management Thunks
export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (params?: { page?: number; per_page?: number; search?: string }) => {
    return await categoryApi.getAll(params);
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData: Parameters<typeof categoryApi.create>[0], { rejectWithValue }) => {
    try {
      const category = await categoryApi.create(categoryData);
      showSuccessToast('Category created successfully!');
      return category;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create category';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, categoryData }: { id: number; categoryData: Parameters<typeof categoryApi.update>[1] }, { rejectWithValue }) => {
    try {
      const category = await categoryApi.update(id, categoryData);
      showSuccessToast('Category updated successfully!');
      return category;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update category';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      showSuccessToast('Category deleted successfully!');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete category';
      showErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.users.error = null;
      state.services.error = null;
      state.categories.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Management
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload.data;
        state.users.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          from: action.payload.from,
          to: action.payload.to,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.pending, (state) => {
        state.users.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state) => {
        state.users.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.users.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users.loading = false;
        const index = state.users.data.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users.data[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state) => {
        state.users.loading = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.users.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = state.users.data.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state) => {
        state.users.loading = false;
      })
      
      // Service Management
      .addCase(fetchServices.pending, (state) => {
        state.services.loading = true;
        state.services.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services.loading = false;
        state.services.data = action.payload.data;
        state.services.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          from: action.payload.from,
          to: action.payload.to,
        };
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.services.loading = false;
        state.services.error = action.error.message || 'Failed to fetch services';
      })
      .addCase(createService.pending, (state) => {
        state.services.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.loading = false;
        state.services.data.unshift(action.payload);
      })
      .addCase(createService.rejected, (state) => {
        state.services.loading = false;
      })
      .addCase(updateService.pending, (state) => {
        state.services.loading = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.services.loading = false;
        const index = state.services.data.findIndex(service => service.id === action.payload.id);
        if (index !== -1) {
          state.services.data[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state) => {
        state.services.loading = false;
      })
      .addCase(deleteService.pending, (state) => {
        state.services.loading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services.loading = false;
        state.services.data = state.services.data.filter(service => service.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state) => {
        state.services.loading = false;
      })
      
      // Category Management
      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload.data;
        state.categories.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          from: action.payload.from,
          to: action.payload.to,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createCategory.pending, (state) => {
        state.categories.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state) => {
        state.categories.loading = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.categories.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        const index = state.categories.data.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories.data[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state) => {
        state.categories.loading = false;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.categories.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = state.categories.data.filter(category => category.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.categories.loading = false;
      });
  },
});

export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
