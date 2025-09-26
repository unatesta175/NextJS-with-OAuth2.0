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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import {
  MoreHorizontal,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Package,
  BarChart3
} from 'lucide-react'

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  staffCount: number
  servicesCount: number
  status: 'active' | 'inactive'
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
  availableServices: string[]
  assignedStaff: string[]
  image?: string
  revenue?: number
  bookingsCount?: number
}

interface Staff {
  id: string
  name: string
  role: string
  avatar?: string
}

interface Service {
  id: string
  name: string
  category: string
}

// Sample data
const staffData: Staff[] = [
  { id: 'staff1', name: 'Maya Chen', role: 'Senior Therapist' },
  { id: 'staff2', name: 'Lisa Wong', role: 'Massage Therapist' },
  { id: 'staff3', name: 'Amy Tan', role: 'Hair Stylist' },
  { id: 'staff4', name: 'Sarah Lee', role: 'Nail Technician' },
  { id: 'staff5', name: 'Manager One', role: 'Branch Manager' },
  { id: 'staff6', name: 'Manager Two', role: 'Branch Manager' }
]

const servicesData: Service[] = [
  { id: 'S001', name: 'Deep Cleansing Facial', category: 'Facial' },
  { id: 'S002', name: 'Relaxing Body Massage', category: 'Body' },
  { id: 'S003', name: 'Hair Treatment & Styling', category: 'Hair' },
  { id: 'S004', name: 'Luxury Manicure & Pedicure', category: 'Nail' },
  { id: 'S005', name: 'Anti-Aging Eye Treatment', category: 'Eye' }
]

const branchesData: Branch[] = [
  {
    id: 'main',
    name: 'Kapas Beauty Main Branch',
    address: 'Lot 1.23, Level 1, Suria KLCC, Kuala Lumpur City Centre, 50088 Kuala Lumpur',
    phone: '+603-2382-8888',
    email: 'main@kapasbeauty.com',
    manager: 'staff5',
    staffCount: 12,
    servicesCount: 15,
    status: 'active',
    operatingHours: {
      monday: { open: '09:00', close: '21:00', isOpen: true },
      tuesday: { open: '09:00', close: '21:00', isOpen: true },
      wednesday: { open: '09:00', close: '21:00', isOpen: true },
      thursday: { open: '09:00', close: '21:00', isOpen: true },
      friday: { open: '09:00', close: '22:00', isOpen: true },
      saturday: { open: '09:00', close: '22:00', isOpen: true },
      sunday: { open: '10:00', close: '20:00', isOpen: true }
    },
    availableServices: ['S001', 'S002', 'S003', 'S004', 'S005'],
    assignedStaff: ['staff1', 'staff2', 'staff3', 'staff4'],
    revenue: 125000,
    bookingsCount: 450
  },
  {
    id: 'pj',
    name: 'Kapas Beauty Petaling Jaya',
    address: '3-G-1, Jalan PJU 7/3, Mutiara Damansara, 47800 Petaling Jaya, Selangor',
    phone: '+603-7728-9999',
    email: 'pj@kapasbeauty.com',
    manager: 'staff6',
    staffCount: 8,
    servicesCount: 12,
    status: 'active',
    operatingHours: {
      monday: { open: '10:00', close: '20:00', isOpen: true },
      tuesday: { open: '10:00', close: '20:00', isOpen: true },
      wednesday: { open: '10:00', close: '20:00', isOpen: true },
      thursday: { open: '10:00', close: '20:00', isOpen: true },
      friday: { open: '10:00', close: '21:00', isOpen: true },
      saturday: { open: '10:00', close: '21:00', isOpen: true },
      sunday: { open: '11:00', close: '19:00', isOpen: true }
    },
    availableServices: ['S001', 'S002', 'S004'],
    assignedStaff: ['staff1', 'staff2'],
    revenue: 85000,
    bookingsCount: 320
  },
  {
    id: 'shah-alam',
    name: 'Kapas Beauty Shah Alam',
    address: 'L2-15, i-City Mall, Persiaran Multimedia, Seksyen 7, 40000 Shah Alam, Selangor',
    phone: '+603-5521-7777',
    email: 'shahalam@kapasbeauty.com',
    manager: 'staff5',
    staffCount: 6,
    servicesCount: 10,
    status: 'inactive',
    operatingHours: {
      monday: { open: '10:00', close: '19:00', isOpen: true },
      tuesday: { open: '10:00', close: '19:00', isOpen: true },
      wednesday: { open: '10:00', close: '19:00', isOpen: true },
      thursday: { open: '10:00', close: '19:00', isOpen: true },
      friday: { open: '10:00', close: '20:00', isOpen: true },
      saturday: { open: '10:00', close: '20:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false }
    },
    availableServices: ['S001', 'S004'],
    assignedStaff: ['staff3', 'staff4'],
    revenue: 45000,
    bookingsCount: 180
  }
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
]

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    status: 'active' as Branch['status'],
    operatingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '18:00', isOpen: true },
      sunday: { open: '10:00', close: '17:00', isOpen: true }
    },
    availableServices: [] as string[],
    assignedStaff: [] as string[]
  })


  // Filter and search branches
  const filteredBranches = branchesData.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredBranches.length / pageSize)
  const paginatedBranches = filteredBranches.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleAddBranch = () => {
    setEditingBranch(null)
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      status: 'active',
      operatingHours: {
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '09:00', close: '18:00', isOpen: true },
        sunday: { open: '10:00', close: '17:00', isOpen: true }
      },
      availableServices: [],
      assignedStaff: []
    })
    setIsDialogOpen(true)
  }

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      status: branch.status,
      operatingHours: branch.operatingHours,
      availableServices: branch.availableServices,
      assignedStaff: branch.assignedStaff
    })
    setIsDialogOpen(true)
  }

  const handleViewBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsDetailsOpen(true)
  }

  const handleSaveBranch = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement save branch logic
      console.log('Save branch:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save branch:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBranch = (branch: Branch) => {
    // TODO: Implement delete branch logic with confirmation
    console.log('Delete branch:', branch.id)
  }

  const handleStatusToggle = (branch: Branch) => {
    // TODO: Implement status toggle
    console.log('Toggle status for branch:', branch.id)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export branches data')
  }

  const getManagerName = (managerId: string) => {
    return staffData.find(staff => staff.id === managerId)?.name || 'Unassigned'
  }

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => servicesData.find(service => service.id === id)?.name || id)
  }

  const getStaffNames = (staffIds: string[]) => {
    return staffIds.map(id => staffData.find(staff => staff.id === id)?.name || id)
  }

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branches Management</h1>
            <p className="text-gray-600 mt-1">Manage spa branches, locations, and operations</p>
          </div>
          <Button onClick={handleAddBranch} className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
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
            </div>

            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Staff Count</TableHead>
                  <TableHead>Services Count</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {branch.image ? (
                            <Image src={branch.image} alt={branch.name} className="w-full h-full object-cover rounded-lg" width={48} height={48} />
                          ) : (
                            <MapPin className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{branch.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{branch.address}</div>
                          <div className="text-sm text-gray-500">{branch.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={staffData.find(s => s.id === branch.manager)?.avatar} />
                          <AvatarFallback className="text-xs">
                            {getManagerName(branch.manager).split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{getManagerName(branch.manager)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{branch.staffCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{branch.servicesCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 text-gray-400" />
                          <span>{branch.bookingsCount} bookings</span>
                        </div>
                        <div className="text-gray-500">RM {branch.revenue?.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[branch.status].color}>
                          {statusConfig[branch.status].label}
                        </Badge>
                        <Switch
                          checked={branch.status === 'active'}
                          onCheckedChange={() => handleStatusToggle(branch)}
                        />
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
                          <DropdownMenuItem onClick={() => handleViewBranch(branch)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditBranch(branch)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteBranch(branch)}
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
                of {filteredBranches.length} results
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

        {/* Add/Edit Branch Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </DialogTitle>
              <DialogDescription>
                {editingBranch ? 'Update branch information and settings.' : 'Create a new spa branch location.'}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="hours">Operating Hours</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Branch Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="manager">Manager</Label>
                      <Select value={formData.manager} onValueChange={(value) => setFormData({...formData, manager: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffData.filter(staff => staff.role.includes('Manager')).map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name} - {staff.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: Branch['status']) => setFormData({...formData, status: value})}>
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
                </div>
              </TabsContent>

              <TabsContent value="hours" className="space-y-4">
                <div className="space-y-4">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={formData.operatingHours[day.key as keyof typeof formData.operatingHours]?.isOpen}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              operatingHours: {
                                ...formData.operatingHours,
                                [day.key]: {
                                  ...formData.operatingHours[day.key as keyof typeof formData.operatingHours],
                                  isOpen: !!checked
                                }
                              }
                            })
                          }}
                        />
                        <Label className="text-sm font-medium w-20">{day.label}</Label>
                      </div>
                      {formData.operatingHours[day.key as keyof typeof formData.operatingHours]?.isOpen && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={formData.operatingHours[day.key as keyof typeof formData.operatingHours]?.open}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                operatingHours: {
                                  ...formData.operatingHours,
                                  [day.key]: {
                                    ...formData.operatingHours[day.key as keyof typeof formData.operatingHours],
                                    open: e.target.value
                                  }
                                }
                              })
                            }}
                            className="w-32"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={formData.operatingHours[day.key as keyof typeof formData.operatingHours]?.close}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                operatingHours: {
                                  ...formData.operatingHours,
                                  [day.key]: {
                                    ...formData.operatingHours[day.key as keyof typeof formData.operatingHours],
                                    close: e.target.value
                                  }
                                }
                              })
                            }}
                            className="w-32"
                          />
                        </div>
                      )}
                      {!formData.operatingHours[day.key as keyof typeof formData.operatingHours]?.isOpen && (
                        <span className="text-gray-500 text-sm">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="grid gap-2">
                  <Label>Available Services</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {servicesData.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formData.availableServices.includes(service.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                availableServices: [...formData.availableServices, service.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                availableServices: formData.availableServices.filter(id => id !== service.id)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`service-${service.id}`} className="text-sm">
                          {service.name}
                          <span className="text-gray-500 ml-1">({service.category})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <div className="grid gap-2">
                  <Label>Assigned Staff</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {staffData.filter(staff => !staff.role.includes('Manager')).map((staff) => (
                      <div key={staff.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`staff-${staff.id}`}
                          checked={formData.assignedStaff.includes(staff.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                assignedStaff: [...formData.assignedStaff, staff.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                assignedStaff: formData.assignedStaff.filter(id => id !== staff.id)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`staff-${staff.id}`} className="text-sm">
                          {staff.name}
                          <span className="text-gray-500 ml-1">({staff.role})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSaveBranch}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                ) : (
                  editingBranch ? 'Update Branch' : 'Create Branch'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Branch Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            {selectedBranch && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {selectedBranch.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <span className="text-sm">{selectedBranch.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedBranch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedBranch.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">Manager: {getManagerName(selectedBranch.manager)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Operating Hours */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Operating Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {daysOfWeek.map((day) => (
                          <div key={day.key} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{day.label}</span>
                            <span className="text-sm text-gray-600">
                              {selectedBranch.operatingHours[day.key as keyof typeof selectedBranch.operatingHours]?.isOpen 
                                ? `${selectedBranch.operatingHours[day.key as keyof typeof selectedBranch.operatingHours].open} - ${selectedBranch.operatingHours[day.key as keyof typeof selectedBranch.operatingHours].close}`
                                : 'Closed'
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{selectedBranch.bookingsCount}</div>
                          <div className="text-sm text-gray-600">Bookings</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">RM {selectedBranch.revenue?.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{selectedBranch.staffCount}</div>
                          <div className="text-sm text-gray-600">Staff</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{selectedBranch.servicesCount}</div>
                          <div className="text-sm text-gray-600">Services</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Staff List */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Assigned Staff
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getStaffNames(selectedBranch.assignedStaff).map((staffName, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {staffName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{staffName}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Available Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Available Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {getServiceNames(selectedBranch.availableServices).map((serviceName, index) => (
                          <Badge key={index} variant="secondary">
                            {serviceName}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
}
