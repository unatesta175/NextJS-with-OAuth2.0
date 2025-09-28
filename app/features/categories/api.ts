import api from '@lib/axios';

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
  tags?: Array<{
    id: number;
    name: string;
    is_active: boolean;
  }>;
  services_count?: number;
}

export interface CategoryApiResponse {
  success: boolean;
  data: Category[];
  message: string;
}

export const categoriesApi = {
  /**
   * Get all active service categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get<CategoryApiResponse>('/service-categories');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  /**
   * Get a specific category by ID
   */
  getById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get<{ success: boolean; data: Category; message: string }>(`/service-categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw error;
    }
  }
};

// Legacy export for backward compatibility
export async function fetchCategories(): Promise<Category[]> {
  return categoriesApi.getAll();
}

