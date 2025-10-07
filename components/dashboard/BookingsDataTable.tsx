'use client'

import React, { useState, useEffect } from 'react'
import api from '@lib/axios'
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
  Trash2,
  RefreshCw
} from 'lucide-react'
import { DatePicker } from '@components/ui/date-picker'

interface Booking {
  id: number
  user_id: number
  service_id: number
  therapist_id: number
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  total_amount: number
  created_at: string
  updated_at: string
  service: {
    id: number
    name: string
    description: string
    price: number
    duration: number
    image?: string
    category: {
      id: number
      name: string
    }
  }
  therapist: {
    id: number
    name: string
    email: string
    phone?: string
    image?: string
  }
  client: {
    id: number
    name: string
    email: string
    phone?: string
  }
  payment?: {
    id: number
    amount: number
    status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded'
    payment_method: 'cash' | 'toyyibpay'
    toyyibpay_transaction_id?: string
    paid_at?: string
  }
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Helper function to format time
const formatTime = (timeString: string): string => {
  if (!timeString) return 'N/A'
  let timeOnly = timeString
  if (timeString.includes('T')) {
    timeOnly = timeString.split('T')[1].split('.')[0]
  }
  const [hours, minutes] = timeOnly.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  checked_in: { label: 'Checked In', color: 'bg-indigo-100 text-indigo-800' },
  checked_out: { label: 'Checked Out', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-800' }
}

export function BookingsDataTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [staffFilter, setStaffFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<{key: keyof Booking | 'client.name' | 'therapist.name', order: 'asc' | 'desc'}>({
    key: 'appointment_date',
    order: 'desc'
  })
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/admin/bookings')
        setBookingsData(response.data.data || [])
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
        setBookingsData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBookings()
  }, [])

  // Get unique staff names for filter
  const staffOptions = Array.from(new Set(bookingsData.map(booking => booking.therapist.name)))

  // Filter and sort data
  const filteredData = bookingsData
    .filter(booking => {
      const matchesSearch = booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.id.toString().includes(searchTerm.toLowerCase()) ||
                           booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesStaff = staffFilter === 'all' || booking.therapist.name === staffFilter
      
      let matchesDate = true
      if (dateRange.from && dateRange.to) {
        const [year, month, day] = booking.appointment_date.split('T')[0].split('-').map(Number)
        const bookingDate = new Date(year, month - 1, day)
        matchesDate = bookingDate >= dateRange.from && bookingDate <= dateRange.to
      }
      
      return matchesSearch && matchesStatus && matchesStaff && matchesDate
    })
    .sort((a, b) => {
      let aValue: unknown, bValue: unknown
      
      if (sortBy.key === 'client.name') {
        aValue = a.client.name
        bValue = b.client.name
      } else if (sortBy.key === 'therapist.name') {
        aValue = a.therapist.name
        bValue = b.therapist.name
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

  const handleSort = (key: keyof Booking | 'client.name' | 'therapist.name') => {
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
              <SelectValue placeholder="Therapist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Therapists</SelectItem>
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
                onClick={() => handleSort('client.name')}
              >
                <div className="flex items-center gap-2">
                  Customer
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Service</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('appointment_date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('therapist.name')}
              >
                <div className="flex items-center gap-2">
                  Therapist
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('total_amount')}
              >
                <div className="flex items-center gap-2">
                  Amount
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="text-gray-500">Loading bookings...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <span className="text-gray-500">No bookings found</span>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {booking.client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{booking.client.name}</div>
                        <div className="text-sm text-gray-500">{booking.client.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.service.name}</div>
                    <div className="text-sm text-gray-500">{booking.service.duration} min</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatDate(booking.appointment_date)}</div>
                    <div className="text-sm text-gray-500">{formatTime(booking.appointment_time)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {booking.therapist.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{booking.therapist.name}</div>
                        <div className="text-xs text-gray-500">{booking.therapist.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>RM {Number(booking.total_amount).toFixed(2)}</TableCell>
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
            ))
            )}
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
