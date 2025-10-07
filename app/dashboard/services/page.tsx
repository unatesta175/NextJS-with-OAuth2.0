'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { showConfirmationToast, showUpdateConfirmationToast, showSuccessToast, showErrorToast, showValidationErrorToast } from '@lib/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from '@lib/axios'

// Local interfaces
interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  extradescription?: string;
  price: number;
  duration: number;
  type: string;
  image: string;
  is_active: boolean;
  category_id: number;
  category: ServiceCategory;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Service[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Components
import ServicesDataTable from '@components/dashboard/ServicesDataTable'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Switch } from '@components/ui/switch'
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Badge } from '@components/ui/badge'

// Validation schemas
const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  category_id: z.number().min(1, 'Category is required'),
  is_active: z.boolean().optional(),
  image: z.instanceof(FileList).optional(),
});

const updateServiceSchema = serviceSchema.partial().extend({
  id: z.number(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;
type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;

export default function DashboardServicesPage() {
  // Local state for services and categories
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form instances
  const createForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
    name: '',
    description: '',
    price: 0,
      duration: 60,
      category_id: undefined, // Don't set a default, force user to select
      is_active: true,
    },
  });

  const editForm = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category_id: undefined,
      is_active: true,
    },
  });

  // Fetch data functions using axios directly
  const fetchServicesData = useCallback(async () => {
    setServicesLoading(true);
    try {
      const response = await axios.get<PaginatedResponse>('/admin/services', {
        params: {
          page: currentPage,
          per_page: pageSize,
        },
      });
      
      setServices(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      });
    } catch (error: any) {
      console.error('Fetch services error:', error);
      showErrorToast('Failed to load services');
    } finally {
      setServicesLoading(false);
    }
  }, [currentPage, pageSize]);

  const fetchCategoriesData = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      console.log('🔄 Fetching categories...');
      const response = await axios.get('/service-categories', {
        params: {
          page: 1,
          per_page: 100,
        },
      });
      console.log('✅ Categories fetched successfully:', response.data);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      showErrorToast('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchServicesData();
    fetchCategoriesData();
  }, [fetchServicesData, fetchCategoriesData]);

  // Debug categories
  useEffect(() => {
    console.log('📋 Categories state:', categories);
    console.log('📋 Categories loading:', categoriesLoading);
  }, [categories, categoriesLoading]);

  // Handle create service using axios directly
  const handleCreateService = async (data: ServiceFormData) => {
    setServicesLoading(true);
    try {
      console.log('🚀 Creating service with data:', data);
      
      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('duration', data.duration.toString());
      formData.append('category_id', data.category_id.toString());
      formData.append('is_active', (data.is_active ?? true) ? '1' : '0');
      
      // Handle file input properly
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }
      
      console.log('🚀 Prepared service FormData');
      
      await axios.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setShowCreateModal(false);
      createForm.reset();
      await fetchServicesData(); // Refresh the data
      showSuccessToast('Service created successfully!');
    } catch (error: any) {
      console.error('Create service error:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        showValidationErrorToast(error.response.data.errors);
      } else if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
      } else if (error.message) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Failed to create service. Please try again.');
      }
    } finally {
      setServicesLoading(false);
    }
  };

  // Handle update service using axios directly
  const handleUpdateService = async (data: UpdateServiceFormData) => {
    if (!selectedService) return;
    
    showUpdateConfirmationToast(
      `Are you sure you want to update ${selectedService.name}?`,
      async () => {
        setServicesLoading(true);
        try {
          // Prepare FormData for file upload
          const formData = new FormData();
          
          if (data.name) formData.append('name', data.name);
          if (data.description) formData.append('description', data.description);
          if (data.price !== undefined) formData.append('price', data.price.toString());
          if (data.duration !== undefined) formData.append('duration', data.duration.toString());
          if (data.category_id !== undefined) formData.append('category_id', data.category_id.toString());
          if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
          
          // Handle file input properly
          if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
          }
          
          // Add _method for Laravel method spoofing
          formData.append('_method', 'PUT');

          await axios.post(`/services/${selectedService.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          setShowEditModal(false);
          setSelectedService(null);
          editForm.reset();
          await fetchServicesData();
          showSuccessToast('Service updated successfully!');
        } catch (error: any) {
          console.error('Update service error:', error);
          
          if (error.response?.status === 422 && error.response?.data?.errors) {
            showValidationErrorToast(error.response.data.errors);
          } else if (error.response?.data?.message) {
            showErrorToast(error.response.data.message);
          } else {
            showErrorToast('Failed to update service. Please try again.');
          }
        } finally {
          setServicesLoading(false);
        }
      }
    );
  };

  // Handle delete service using axios directly
  const handleDeleteService = (service: Service) => {
    showConfirmationToast(
      `Are you sure you want to delete ${service.name}? This action cannot be undone.`,
      async () => {
        setServicesLoading(true);
        try {
          await axios.delete(`/services/${service.id}`);
          await fetchServicesData();
          showSuccessToast('Service deleted successfully!');
        } catch (error: any) {
          console.error('Delete service error:', error);
          showErrorToast('Failed to delete service. Please try again.');
        } finally {
          setServicesLoading(false);
        }
      }
    );
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    editForm.reset({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category_id: service.category.id,
      is_active: service.is_active,
    });
    setShowEditModal(true);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle add service
  const handleAddService = () => {
    createForm.reset({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category_id: undefined,
      is_active: true,
    });
    setShowCreateModal(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Services Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesDataTable
            data={services || []}
            loading={servicesLoading}
            onRefresh={fetchServicesData}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onAdd={handleAddService}
            currentPage={currentPage}
            totalCount={pagination.total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      {/* Create Service Sheet */}
      <Sheet open={showCreateModal} onOpenChange={setShowCreateModal}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Service</SheetTitle>
            <SheetDescription>
              Create a new spa service with pricing and details.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateService)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="create-name">Service Name</Label>
                <Input
                  id="create-name"
                  {...createForm.register('name')}
                  placeholder="Enter service name"
                />
                {createForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  {...createForm.register('description')}
                  placeholder="Enter service description"
                  rows={3}
                />
                {createForm.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-price">Price (RM)</Label>
                  <Input
                    id="create-price"
                    type="number"
                    step="0.01"
                    {...createForm.register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {createForm.formState.errors.price && (
                    <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.price.message}</p>
                  )}
            </div>

                <div>
                  <Label htmlFor="create-duration">Duration (minutes)</Label>
                  <Input
                    id="create-duration"
                    type="number"
                    {...createForm.register('duration', { valueAsNumber: true })}
                    placeholder="60"
                  />
                  {createForm.formState.errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.duration.message}</p>
                  )}
            </div>
          </div>

              <div>
                <Label htmlFor="create-category">Category</Label>
                <Select 
                  onValueChange={(value) => {
                    if (value !== "no-categories") {
                      const categoryId = parseInt(value);
                      console.log('🏷️ Setting category_id:', categoryId);
                      createForm.setValue('category_id', categoryId);
                    }
                  }}
                  value={createForm.watch('category_id')?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.category_id.message}</p>
                          )}
                        </div>

                        <div>
                <Label htmlFor="create-image">Service Image</Label>
                <Input
                  id="create-image"
                  type="file"
                  accept="image/*"
                  {...createForm.register('image')}
                />
          </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="create-active"
                  checked={createForm.watch('is_active')}
                  onCheckedChange={(checked) => createForm.setValue('is_active', checked)}
                />
                <Label htmlFor="create-active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={servicesLoading}>
                {servicesLoading ? 'Creating...' : 'Create Service'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Edit Service Sheet */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Service</SheetTitle>
            <SheetDescription>
              Update service information and settings.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateService)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-name">Service Name</Label>
                <Input
                  id="edit-name"
                  {...editForm.register('name')}
                  placeholder="Enter service name"
                />
                {editForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  {...editForm.register('description')}
                  placeholder="Enter service description"
                  rows={3}
                />
                {editForm.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (RM)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    {...editForm.register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {editForm.formState.errors.price && (
                    <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.price.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    {...editForm.register('duration', { valueAsNumber: true })}
                    placeholder="60"
                  />
                  {editForm.formState.errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.duration.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  onValueChange={(value) => {
                    if (value !== "no-categories") {
                      const categoryId = parseInt(value);
                      editForm.setValue('category_id', categoryId);
                    }
                  }}
                  value={editForm.watch('category_id')?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {editForm.formState.errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.category_id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-image">Service Image</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  {...editForm.register('image')}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editForm.watch('is_active')}
                  onCheckedChange={(checked) => editForm.setValue('is_active', checked)}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={servicesLoading}>
                {servicesLoading ? 'Updating...' : 'Update Service'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      </div>
  )
}