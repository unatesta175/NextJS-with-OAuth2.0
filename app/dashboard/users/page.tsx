'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { showConfirmationToast, showUpdateConfirmationToast, showSuccessToast, showErrorToast, showValidationErrorToast } from '@lib/toast'
import { getUserImageUrl } from '@lib/image-utils'
import axios from '@lib/axios'

// Local User Interface
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'therapist' | 'client';
  image?: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Components
import UsersDataTable from '@components/dashboard/UsersDataTable'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card'
import { 
  Users, 
  UserPlus, 
  Shield, 
  Briefcase, 
  User,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle 
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@components/ui/sheet'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'

// Form validation schemas
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  role: z.enum(['admin', 'therapist', 'client']),
  phone: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
  role: z.enum(['admin', 'therapist', 'client']),
  phone: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type UserFormData = z.infer<typeof userSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function DashboardUsersPage() {
  // Local state for users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form instances
  const createForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'client',
      phone: '',
    },
  });

  const editForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'client',
      phone: '',
    },
  });

  // Fetch users data using axios directly
  const fetchUsersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<PaginatedResponse>('/admin/users', {
        params: {
          page: currentPage,
          per_page: pageSize,
        },
      });
      
      setUsers(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      });
    } catch (error: any) {
      console.error('Fetch users error:', error);
      
      // Handle fetch errors (but don't spam the user with notifications)
      if (error.response?.status === 403) {
        showErrorToast('Access denied. Admin privileges required.');
      } else if (error.response?.status === 401) {
        showErrorToast('Authentication required. Please log in again.');
      }
      // For other errors like 500, we don't show toast to avoid spamming during initial load
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // Handle create user using axios directly
  const handleCreateUser = async (data: UserFormData) => {
    setLoading(true);
    try {
      await axios.post('/admin/users', data);
      setShowCreateModal(false);
      createForm.reset();
      await fetchUsersData(); // Refresh the data
      showSuccessToast('User created successfully!');
    } catch (error: any) {
      console.error('Create user error:', error);
      
      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        showValidationErrorToast(error.response.data.errors);
      } else if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
      } else if (error.message) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Failed to create user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle update user using axios directly
  const handleUpdateUser = async (data: UpdateUserFormData) => {
    if (!selectedUser) return;
    
    showUpdateConfirmationToast(
      `Are you sure you want to update ${selectedUser.name}?`,
      async () => {
        setLoading(true);
        try {
          const updateData = { ...data };
          if (!updateData.password) {
            delete updateData.password;
            delete updateData.password_confirmation;
          }
          
          await axios.put(`/admin/users/${selectedUser.id}`, updateData);
          setShowEditModal(false);
          setSelectedUser(null);
          editForm.reset();
          await fetchUsersData(); // Refresh the data
          showSuccessToast('User updated successfully!');
        } catch (error: any) {
          console.error('Update user error:', error);
          
          // Handle validation errors
          if (error.response?.status === 422 && error.response?.data?.errors) {
            showValidationErrorToast(error.response.data.errors);
          } else if (error.response?.data?.message) {
            showErrorToast(error.response.data.message);
          } else if (error.message) {
            showErrorToast(error.message);
          } else {
            showErrorToast('Failed to update user. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Handle delete user using axios directly
  const handleDeleteUser = (user: User) => {
    showConfirmationToast(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      async () => {
        setLoading(true);
        try {
          await axios.delete(`/admin/users/${user.id}`);
          await fetchUsersData(); // Refresh the data
          showSuccessToast('User deleted successfully!');
        } catch (error: any) {
          console.error('Delete user error:', error);
          
          // Handle errors
          if (error.response?.data?.message) {
            showErrorToast(error.response.data.message);
          } else if (error.message) {
            showErrorToast(error.message);
          } else {
            showErrorToast('Failed to delete user. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Handle edit modal
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      password: '',
      password_confirmation: '',
    });
    setShowEditModal(true);
  };

  // Handle view modal
  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Handle add user
  const handleAddUser = () => {
    createForm.reset();
    setShowCreateModal(true);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsersData();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate total users for table
  const totalUsers = pagination.total;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
      </div>


      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersDataTable
            data={users}
            loading={loading}
            onRefresh={fetchUsersData}
            onEdit={handleEditClick}
            onDelete={handleDeleteUser}
            onAdd={handleAddUser}
            totalCount={totalUsers}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      {/* Create User Sheet */}
      <Sheet open={showCreateModal} onOpenChange={setShowCreateModal}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Create New User</SheetTitle>
            <SheetDescription>
              Add a new user to the system.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...createForm.register('name')}
                  placeholder="Enter full name"
                />
                {createForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...createForm.register('email')}
                  placeholder="Enter email address"
                />
                {createForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.email.message}</p>
                )}
              </div>
              
                        <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => createForm.setValue('role', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                {createForm.formState.errors.role && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.role.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  {...createForm.register('phone')}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...createForm.register('password')}
                  placeholder="Enter password"
                />
                {createForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.password.message}</p>
          )}
        </div>

              <div>
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...createForm.register('password_confirmation')}
                  placeholder="Confirm password"
                />
                {createForm.formState.errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.password_confirmation.message}</p>
                )}
              </div>
            </div>
            
            <SheetFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create User
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user information. Leave password fields empty to keep current password.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateUser)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  {...editForm.register('name')}
                  placeholder="Enter full name"
                />
                {editForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  {...editForm.register('email')}
                  placeholder="Enter email address"
                />
                {editForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  onValueChange={(value) => editForm.setValue('role', value as any)} 
                  defaultValue={selectedUser?.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                {editForm.formState.errors.role && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.role.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-phone">Phone (Optional)</Label>
                <Input
                  id="edit-phone"
                  {...editForm.register('phone')}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-password">New Password (Optional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  {...editForm.register('password')}
                  placeholder="Leave empty to keep current password"
                />
                {editForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.password.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-password_confirmation">Confirm New Password</Label>
                <Input
                  id="edit-password_confirmation"
                  type="password"
                  {...editForm.register('password_confirmation')}
                  placeholder="Confirm new password"
                />
                {editForm.formState.errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.password_confirmation.message}</p>
                )}
              </div>
            </div>
            
            <SheetFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update User
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* View User Sheet */}
      <Sheet open={showViewModal} onOpenChange={setShowViewModal}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>
              View detailed information about this user.
            </SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={getUserImageUrl(selectedUser.image)} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <Badge
                    variant={
                      selectedUser.role === 'admin' 
                        ? 'destructive' 
                        : selectedUser.role === 'therapist' 
                        ? 'default' 
                        : 'secondary'
                    }
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="text-sm">{selectedUser.phone || 'Not provided'}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email Verified</Label>
                  <p className="text-sm">
                    {selectedUser.email_verified_at ? 
                      new Date(selectedUser.email_verified_at).toLocaleDateString() : 
                      'Not verified'
                    }
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created</Label>
                  <p className="text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                  <p className="text-sm">{new Date(selectedUser.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      </div>
  );
}