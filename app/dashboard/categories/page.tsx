'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from '@lib/axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Switch } from '@components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { MoreHorizontal, Search, Plus, Edit, Trash2, Tag, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@lib/toast'

interface ServiceCategory {
  id: number
  name: string
  description: string | null
  image: string | null
  is_active: boolean
  services?: any[]
  tags?: any[]
  created_at: string
  updated_at: string
}

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Name too long'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  is_active: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

const statusConfig = {
  true: { label: 'Active', color: 'bg-green-100 text-green-800' },
  false: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 10

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      is_active: true
    }
  })

  const isActive = watch('is_active')

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/admin/service-categories', {
        params: {
          page: currentPage,
          per_page: perPage,
          search: searchTerm || undefined
        }
      })
      setCategories(response.data.data || [])
      setTotalPages(response.data.last_page || 1)
      setTotal(response.data.total || 0)
    } catch (error: any) {
      console.error('Failed to fetch categories:', error)
      showErrorToast(error.response?.data?.message || 'Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleAddCategory = () => {
    setEditingCategory(null)
    reset({
      name: '',
      description: '',
      image: '',
      is_active: true
    })
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category)
    reset({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      is_active: category.is_active
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await axios.put(`/admin/service-categories/${editingCategory.id}`, data)
        showSuccessToast('Category updated successfully!')
      } else {
        await axios.post('/admin/service-categories', data)
        showSuccessToast('Category created successfully!')
      }
      setIsDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      console.error('Failed to save category:', error)
      showErrorToast(error.response?.data?.message || 'Failed to save category')
    }
  }

  const handleDeleteCategory = async (category: ServiceCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return
    }

    try {
      await axios.delete(`/admin/service-categories/${category.id}`)
      showSuccessToast('Category deleted successfully!')
      fetchCategories()
    } catch (error: any) {
      console.error('Failed to delete category:', error)
      showErrorToast(error.response?.data?.message || 'Failed to delete category')
    }
  }

  const handleToggleStatus = async (category: ServiceCategory) => {
    try {
      await axios.put(`/admin/service-categories/${category.id}`, {
        name: category.name,
        is_active: !category.is_active
      })
      showSuccessToast('Category status updated!')
      fetchCategories()
    } catch (error: any) {
      console.error('Failed to update status:', error)
      showErrorToast('Failed to update status')
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.is_active) ||
                         (statusFilter === 'inactive' && !category.is_active)
    return matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-gray-600 mt-1">Manage service categories and organization</p>
        </div>
        <Button onClick={handleAddCategory} className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <Button variant="outline" onClick={fetchCategories} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ff0a85]/10 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-[#ff0a85]" />
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">ID: {category.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description || 'No description'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {category.services?.length || 0} services
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[category.is_active.toString() as 'true' | 'false'].color}>
                          {statusConfig[category.is_active.toString() as 'true' | 'false'].label}
                        </Badge>
                        <Switch
                          checked={category.is_active}
                          onCheckedChange={() => handleToggleStatus(category)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, total)} of {total} categories
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-3 py-1 border rounded-md text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category information.' : 'Create a new service category.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Facial Treatment"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Brief description of the category"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  {...register('image')}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="text-sm text-red-600">{errors.image.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active Status</Label>
                  <p className="text-sm text-gray-500">
                    Make this category visible to customers
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingCategory ? 'Update Category' : 'Create Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
