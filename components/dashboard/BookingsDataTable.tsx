'use client'

import React, { useState } from 'react'
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
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
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
  ArrowUpDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { DatePicker } from '@components/ui/date-picker'

interface Booking {
  id: string
  customer: {
    name: string
    avatar?: string
    email: string
  }
  amount: number
  duration: number
  staff: {
    name: string
    avatar?: string
  }
  services: string[]
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  date: string
  time: string
}

// Sample data
const bookingsData: Booking[] = [
  {
    id: 'BK001',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah@email.com'
    },
    amount: 150.00,
    duration: 90,
    staff: {
      name: 'Maya Chen'
    },
    services: ['Facial Treatment', 'Eye Care'],
    status: 'confirmed',
    date: '2024-01-15',
    time: '10:00 AM'
  },
  {
    id: 'BK002',
    customer: {
      name: 'Maria Lim',
      email: 'maria@email.com'
    },
    amount: 200.00,
    duration: 120,
    staff: {
      name: 'Lisa Wong'
    },
    services: ['Body Massage', 'Body Scrub'],
    status: 'in-progress',
    date: '2024-01-15',
    time: '2:00 PM'
  },
  {
    id: 'BK003',
    customer: {
      name: 'John Doe',
      email: 'john@email.com'
    },
    amount: 80.00,
    duration: 60,
    staff: {
      name: 'Amy Tan'
    },
    services: ['Hair Care'],
    status: 'pending',
    date: '2024-01-16',
    time: '11:30 AM'
  },
  {
    id: 'BK004',
    customer: {
      name: 'Lisa Chen',
      email: 'lisa@email.com'
    },
    amount: 120.00,
    duration: 75,
    staff: {
      name: 'Maya Chen'
    },
    services: ['Nail Care', 'Hand Treatment'],
    status: 'completed',
    date: '2024-01-14',
    time: '3:00 PM'
  },
  {
    id: 'BK005',
    customer: {
      name: 'David Wong',
      email: 'david@email.com'
    },
    amount: 180.00,
    duration: 100,
    staff: {
      name: 'Lisa Wong'
    },
    services: ['Body Massage', 'Facial Treatment'],
    status: 'cancelled',
    date: '2024-01-16',
    time: '4:30 PM'
  }
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  'in-progress': { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
}

export function BookingsDataTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [staffFilter, setStaffFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<{key: keyof Booking | 'customer.name' | 'staff.name', order: 'asc' | 'desc'}>({
    key: 'date',
    order: 'desc'
  })

  // Get unique staff names for filter
  const staffOptions = Array.from(new Set(bookingsData.map(booking => booking.staff.name)))

  // Filter and sort data
  const filteredData = bookingsData
    .filter(booking => {
      const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesStaff = staffFilter === 'all' || booking.staff.name === staffFilter
      
      let matchesDate = true
      if (dateRange.from && dateRange.to) {
        const bookingDate = new Date(booking.date)
        matchesDate = bookingDate >= dateRange.from && bookingDate <= dateRange.to
      }
      
      return matchesSearch && matchesStatus && matchesStaff && matchesDate
    })
    .sort((a, b) => {
      let aValue: unknown, bValue: unknown
      
      if (sortBy.key === 'customer.name') {
        aValue = a.customer.name
        bValue = b.customer.name
      } else if (sortBy.key === 'staff.name') {
        aValue = a.staff.name
        bValue = b.staff.name
      } else {
        aValue = a[sortBy.key as keyof Booking]
        bValue = b[sortBy.key as keyof Booking]
      }
      
      if (sortBy.order === 'asc') {
        return String(aValue) < String(bValue) ? -1 : String(aValue) > String(bValue) ? 1 : 0
      } else {
        return String(aValue) > String(bValue) ? -1 : String(aValue) < String(bValue) ? 1 : 0
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (key: keyof Booking | 'customer.name' | 'staff.name') => {
    setSortBy(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export bookings data')
  }

  const handleView = (booking: Booking) => {
    // TODO: Open booking details
    console.log('View booking:', booking.id)
  }

  const handleEdit = (booking: Booking) => {
    // TODO: Open edit booking modal
    console.log('Edit booking:', booking.id)
  }

  const handleDelete = (booking: Booking) => {
    // TODO: Delete booking with confirmation
    console.log('Delete booking:', booking.id)
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
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

          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffOptions.map((staff) => (
                <SelectItem key={staff} value={staff}>
                  {staff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker
            date={dateRange.from}
            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
            placeholder="From date"
          />
          
          <DatePicker
            date={dateRange.to}
            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
            placeholder="To date"
          />
        </div>

        <div className="flex items-center gap-2">
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
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-2">
                  Booking ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('customer.name')}
              >
                <div className="flex items-center gap-2">
                  Customer
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-2">
                  Amount
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center gap-2">
                  Duration
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('staff.name')}
              >
                <div className="flex items-center gap-2">
                  Staff
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Services</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={booking.customer.avatar} />
                      <AvatarFallback>
                        {booking.customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.customer.name}</div>
                      <div className="text-sm text-gray-500">{booking.customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>RM {booking.amount.toFixed(2)}</TableCell>
                <TableCell>{booking.duration} min</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={booking.staff.avatar} />
                      <AvatarFallback className="text-xs">
                        {booking.staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{booking.staff.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {booking.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[booking.status].color}>
                    {statusConfig[booking.status].label}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => handleView(booking)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(booking)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(booking)}
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
      <div className="flex items-center justify-between">
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
            of {filteredData.length} results
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
  )
}
