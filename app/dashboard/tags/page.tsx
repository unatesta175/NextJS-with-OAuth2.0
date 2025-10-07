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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { MoreHorizontal, Search, Plus, Edit, Trash2, Tags, RefreshCw } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@lib/toast'

interface ServiceCategoryTag {
  id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(255, 'Name too long'),
  is_active: z.boolean().default(true),
})

type TagFormData = z.infer<typeof tagSchema>

const statusConfig = {
  true: { label: 'Active', color: 'bg-green-100 text-green-800' },
  false: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
}

export default function TagsPage() {
  const [tags, setTags] = useState<ServiceCategoryTag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<ServiceCategoryTag | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      is_active: true
    }
  })

  const isActive = watch('is_active')

  const fetchTags = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/admin/service-category-tags')
      setTags(response.data.data || response.data || [])
    } catch (error: any) {
      console.error('Failed to fetch tags:', error)
      showErrorToast(error.response?.data?.message || 'Failed to fetch tags')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const handleAddTag = () => {
    setEditingTag(null)
    reset({
      name: '',
      is_active: true
    })
    setIsDialogOpen(true)
  }

  const handleEditTag = (tag: ServiceCategoryTag) => {
    setEditingTag(tag)
    reset({
      name: tag.name,
      is_active: tag.is_active
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: TagFormData) => {
    try {
      if (editingTag) {
        await axios.put(`/admin/service-category-tags/${editingTag.id}`, data)
        showSuccessToast('Tag updated successfully!')
      } else {
        await axios.post('/admin/service-category-tags', data)
        showSuccessToast('Tag created successfully!')
      }
      setIsDialogOpen(false)
      fetchTags()
    } catch (error: any) {
      console.error('Failed to save tag:', error)
      showErrorToast(error.response?.data?.message || 'Failed to save tag')
    }
  }

  const handleDeleteTag = async (tag: ServiceCategoryTag) => {
    if (!confirm(`Are you sure you want to delete "${tag.name}"?`)) {
      return
    }

    try {
      await axios.delete(`/admin/service-category-tags/${tag.id}`)
      showSuccessToast('Tag deleted successfully!')
      fetchTags()
    } catch (error: any) {
      console.error('Failed to delete tag:', error)
      showErrorToast(error.response?.data?.message || 'Failed to delete tag')
    }
  }

  const handleToggleStatus = async (tag: ServiceCategoryTag) => {
    try {
      await axios.put(`/admin/service-category-tags/${tag.id}`, {
        name: tag.name,
        is_active: !tag.is_active
      })
      showSuccessToast('Tag status updated!')
      fetchTags()
    } catch (error: any) {
      console.error('Failed to update status:', error)
      showErrorToast('Failed to update status')
    }
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && tag.is_active) ||
                         (statusFilter === 'inactive' && !tag.is_active)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Tags</h1>
          <p className="text-gray-600 mt-1">Manage tags for service categories</p>
        </div>
        <Button onClick={handleAddTag} className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tags..."
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
          <Button variant="outline" onClick={fetchTags} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading tags...
                  </TableCell>
                </TableRow>
              ) : filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No tags found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                          <Tags className="h-5 w-5 text-[#8b5cf6]" />
                        </div>
                        <div>
                          <div className="font-medium">{tag.name}</div>
                          <div className="text-sm text-gray-500">ID: {tag.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[tag.is_active.toString() as 'true' | 'false'].color}>
                          {statusConfig[tag.is_active.toString() as 'true' | 'false'].label}
                        </Badge>
                        <Switch
                          checked={tag.is_active}
                          onCheckedChange={() => handleToggleStatus(tag)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(tag.created_at).toLocaleDateString()}
                      </span>
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
                          <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTag(tag)}
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

        <div className="mt-4 text-sm text-gray-600">
          Total: {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              {editingTag ? 'Edit Tag' : 'Add New Tag'}
            </DialogTitle>
            <DialogDescription>
              {editingTag ? 'Update tag information.' : 'Create a new category tag.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tag Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Popular, New, Premium"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active Status</Label>
                  <p className="text-sm text-gray-500">
                    Make this tag visible to customers
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
                  editingTag ? 'Update Tag' : 'Create Tag'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


