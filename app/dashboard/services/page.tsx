'use client'

import React, { useState } from 'react'
import Image from 'next/image'
// DashboardLayout is now handled by layout.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Switch } from '@components/ui/switch'
import { Checkbox } from '@components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  MoreHorizontal,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: number
  status: 'active' | 'inactive'
  image?: string
  staffAssigned: string[]
  branchesAvailable: string[]
  bookingsCount?: number
  revenue?: number
}

interface Staff {
  id: string
  name: string
  avatar?: string
}

interface Branch {
  id: string
  name: string
  address: string
}

interface Category {
  id: string
  name: string
}

// Sample data
const categoriesData: Category[] = [
  { id: 'facial', name: 'Facial Treatment' },
  { id: 'body', name: 'Body Treatment' },
  { id: 'hair', name: 'Hair Care' },
  { id: 'nail', name: 'Nail Care' },
  { id: 'eye', name: 'Eye Treatment' }
]

const staffData: Staff[] = [
  { id: 'staff1', name: 'Maya Chen' },
  { id: 'staff2', name: 'Lisa Wong' },
  { id: 'staff3', name: 'Amy Tan' },
  { id: 'staff4', name: 'Sarah Lee' }
]

const branchesData: Branch[] = [
  { id: 'main', name: 'Main Branch', address: 'Kuala Lumpur' },
  { id: 'pj', name: 'Petaling Jaya', address: 'PJ' },
  { id: 'shah-alam', name: 'Shah Alam', address: 'Shah Alam' }
]

const servicesData: Service[] = [
  {
    id: 'S001',
    name: 'Deep Cleansing Facial',
    description: 'A thorough facial treatment that cleanses and purifies the skin',
    category: 'facial',
    price: 150.00,
    duration: 90,
    status: 'active',
    staffAssigned: ['staff1', 'staff2'],
    branchesAvailable: ['main', 'pj'],
    bookingsCount: 45,
    revenue: 6750.00
  },
  {
    id: 'S002',
    name: 'Relaxing Body Massage',
    description: 'Full body massage for ultimate relaxation and stress relief',
    category: 'body',
    price: 200.00,
    duration: 120,
    status: 'active',
    staffAssigned: ['staff2', 'staff3'],
    branchesAvailable: ['main', 'pj', 'shah-alam'],
    bookingsCount: 38,
    revenue: 7600.00
  },
  {
    id: 'S003',
    name: 'Hair Treatment & Styling',
    description: 'Professional hair treatment and styling service',
    category: 'hair',
    price: 80.00,
    duration: 60,
    status: 'active',
    staffAssigned: ['staff3', 'staff4'],
    branchesAvailable: ['main'],
    bookingsCount: 32,
    revenue: 2560.00
  },
  {
    id: 'S004',
    name: 'Luxury Manicure & Pedicure',
    description: 'Complete nail care with luxury treatment',
    category: 'nail',
    price: 120.00,
    duration: 75,
    status: 'active',
    staffAssigned: ['staff1', 'staff4'],
    branchesAvailable: ['pj', 'shah-alam'],
    bookingsCount: 28,
    revenue: 3360.00
  },
  {
    id: 'S005',
    name: 'Anti-Aging Eye Treatment',
    description: 'Specialized treatment for eye area rejuvenation',
    category: 'eye',
    price: 100.00,
    duration: 45,
    status: 'inactive',
    staffAssigned: ['staff1'],
    branchesAvailable: ['main'],
    bookingsCount: 15,
    revenue: 1500.00
  }
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [staffFilter, setStaffFilter] = useState<string>('all')
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    duration: 0,
    status: 'active' as Service['status'],
    staffAssigned: [] as string[],
    branchesAvailable: [] as string[]
  })


  // Filter and search services
  const filteredServices = servicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter
    const matchesStaff = staffFilter === 'all' || service.staffAssigned.includes(staffFilter)
    const matchesBranch = branchFilter === 'all' || service.branchesAvailable.includes(branchFilter)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStaff && matchesBranch
  })

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / pageSize)
  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleAddService = () => {
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      duration: 0,
      status: 'active',
      staffAssigned: [],
      branchesAvailable: []
    })
    setIsDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      status: service.status,
      staffAssigned: service.staffAssigned,
      branchesAvailable: service.branchesAvailable
    })
    setIsDialogOpen(true)
  }

  const handleSaveService = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement save service logic
      console.log('Save service:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save service:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = (service: Service) => {
    // TODO: Implement delete service logic with confirmation
    console.log('Delete service:', service.id)
  }

  const handleStatusToggle = (service: Service) => {
    // TODO: Implement status toggle
    console.log('Toggle status for service:', service.id)
  }

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action, selectedServices)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export services data')
  }

  const getCategoryName = (categoryId: string) => {
    return categoriesData.find(cat => cat.id === categoryId)?.name || categoryId
  }

  // const getStaffNames = (staffIds: string[]) => {
  //   return staffIds.map(id => staffData.find(staff => staff.id === id)?.name || id)
  // }

  // const getBranchNames = (branchIds: string[]) => {
  //   return branchIds.map(id => branchesData.find(branch => branch.id === id)?.name || id)
  // }

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage spa services, pricing, and availability</p>
          </div>
          <Button onClick={handleAddService} className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staffData.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {selectedServices.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions ({selectedServices.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                      Deactivate Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-600"
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedServices.length === paginatedServices.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedServices(paginatedServices.map(s => s.id))
                        } else {
                          setSelectedServices([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Branches</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedServices([...selectedServices, service.id])
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {service.image ? (
                            <Image src={service.image} alt={service.name} className="w-full h-full object-cover rounded-lg" width={48} height={48} />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getCategoryName(service.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">RM {service.price.toFixed(2)}</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {service.staffAssigned.slice(0, 3).map((staffId) => {
                          const staff = staffData.find(s => s.id === staffId)
                          return (
                            <Avatar key={staffId} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src={staff?.avatar} />
                              <AvatarFallback className="text-xs">
                                {staff?.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )
                        })}
                        {service.staffAssigned.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{service.staffAssigned.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.branchesAvailable.slice(0, 2).map((branchId) => {
                          const branch = branchesData.find(b => b.id === branchId)
                          return (
                            <Badge key={branchId} variant="outline" className="text-xs">
                              {branch?.name}
                            </Badge>
                          )
                        })}
                        {service.branchesAvailable.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.branchesAvailable.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[service.status].color}>
                          {statusConfig[service.status].label}
                        </Badge>
                        <Switch
                          checked={service.status === 'active'}
                          onCheckedChange={() => handleStatusToggle(service)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{service.bookingsCount} bookings</div>
                        <div className="text-gray-500">RM {service.revenue?.toFixed(2)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => console.log('View service:', service.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditService(service)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">
                of {filteredServices.length} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Add/Edit Service Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService ? 'Update service information and settings.' : 'Create a new spa service.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: Service['status']) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (RM)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Staff Assignment</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {staffData.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`staff-${staff.id}`}
                        checked={formData.staffAssigned.includes(staff.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              staffAssigned: [...formData.staffAssigned, staff.id]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              staffAssigned: formData.staffAssigned.filter(id => id !== staff.id)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`staff-${staff.id}`} className="text-sm">
                        {staff.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Branch Availability</Label>
                <div className="grid grid-cols-2 gap-2">
                  {branchesData.map((branch) => (
                    <div key={branch.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`branch-${branch.id}`}
                        checked={formData.branchesAvailable.includes(branch.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              branchesAvailable: [...formData.branchesAvailable, branch.id]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              branchesAvailable: formData.branchesAvailable.filter(id => id !== branch.id)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`branch-${branch.id}`} className="text-sm">
                        {branch.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSaveService}
                loading={isSaving}
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
