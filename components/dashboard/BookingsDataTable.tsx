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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
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
  X,
  RefreshCw,
  Calendar,
  Clock,
  Mail,
  Phone
} from 'lucide-react'
import { DatePicker } from '@components/ui/date-picker'
import { showSuccessToast, showErrorToast } from '@lib/toast'

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
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800',
    badgeClass: 'text-[#e5a900] border-[#e5a900]'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'bg-blue-100 text-blue-800',
    badgeClass: 'text-[#6E6EEF] border-[#6E6EEF]'
  },
  checked_in: { 
    label: 'Check In', 
    color: 'bg-indigo-100 text-indigo-800',
    badgeClass: 'text-[#D68AF1] border-[#D68AF1]'
  },
  checked_out: { 
    label: 'Checkout', 
    color: 'bg-purple-100 text-purple-800',
    badgeClass: 'text-[#E58282] border-[#E58282]'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800',
    badgeClass: 'text-[#3ABA61] border-[#3ABA61]'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800',
    badgeClass: 'text-red-600 border-red-600'
  },
  no_show: { 
    label: 'No Show', 
    color: 'bg-gray-100 text-gray-800',
    badgeClass: 'text-gray-600 border-gray-600'
  }
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
  
  // Sheet states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [sheetView, setSheetView] = useState<'details' | 'payment' | 'completed'>('details')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Cancel modal states
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

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
    setSelectedBooking(booking)
    setSheetView('details')
    setIsDetailsOpen(true)
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setSheetView('details')
    setIsDetailsOpen(true)
  }

  const handleCancel = (booking: Booking) => {
    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      showErrorToast('Only pending or confirmed bookings can be cancelled')
      return
    }

    // Open cancel confirmation modal
    setBookingToCancel(booking)
    setIsCancelModalOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return

    setIsCancelling(true)
    try {
      const response = await api.put(`/bookings/${bookingToCancel.id}/cancel`, {
        reason: 'Cancelled by admin'
      })
      
      if (response.data.success) {
        // Update local state
        const updatedBooking = response.data.data
        setBookingsData(prev => 
          prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
        )
        
        showSuccessToast('Booking cancelled successfully')
        setIsCancelModalOpen(false)
        setBookingToCancel(null)
      }
    } catch (error: any) {
      console.error('Failed to cancel booking:', error)
      showErrorToast(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCancelModalClose = () => {
    if (!isCancelling) {
      setIsCancelModalOpen(false)
      setBookingToCancel(null)
    }
  }

  const handleStatusChange = async (newStatus: Booking['status']) => {
    if (!selectedBooking) return
    
    setIsUpdating(true)
    try {
      const response = await api.put(`/admin/bookings/${selectedBooking.id}/status`, {
        status: newStatus
      })
      
      if (response.data.success) {
        // Update local state
        const updatedBooking = response.data.data
        setSelectedBooking(updatedBooking)
        
        // Update in the bookings list
        setBookingsData(prev => 
          prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
        )
        
        showSuccessToast(`Booking status changed to ${statusConfig[newStatus].label}`)
      }
    } catch (error: any) {
      console.error('Failed to update status:', error)
      showErrorToast(error.response?.data?.message || 'Failed to update booking status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleConfirmBooking = () => {
    handleStatusChange('confirmed')
  }

  const handleCheckIn = () => {
    handleStatusChange('checked_in')
  }

  const handleCheckout = () => {
    handleStatusChange('checked_out')
  }

  const handleGoToPayment = () => {
    setSheetView('payment')
  }

  const handleCompleteBooking = () => {
    setSheetView('completed')
  }

  const handlePayNow = async () => {
    if (!selectedBooking?.payment) return
    
    setIsUpdating(true)
    try {
      // Update payment status to paid for cash payments
      const response = await api.put(`/admin/bookings/${selectedBooking.id}/status`, {
        status: 'completed'
      })
      
      if (response.data.success) {
        const updatedBooking = response.data.data
        setSelectedBooking(updatedBooking)
        
        setBookingsData(prev => 
          prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
        )
        
        setSheetView('completed')
        
        showSuccessToast('Booking completed successfully')
      }
    } catch (error: any) {
      console.error('Failed to process payment:', error)
      showErrorToast(error.response?.data?.message || 'Failed to process payment')
    } finally {
      setIsUpdating(false)
    }
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
                        onClick={() => handleCancel(booking)}
                        className="text-red-600"
                        disabled={!['pending', 'confirmed'].includes(booking.status)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
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

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={handleCancelModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
            <DialogDescription>
              {bookingToCancel && (
                <>Are you sure you want to cancel booking <span className="font-semibold">#{bookingToCancel.id}</span>? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelModalClose}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedBooking && (
            <>
              {sheetView === 'details' && (
                <>
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">
                      Booking #{selectedBooking.id}
                    </SheetTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`${statusConfig[selectedBooking.status].badgeClass} font-medium`}
                        style={{ borderWidth: '1.5px' }}
                      >
                        {statusConfig[selectedBooking.status].label}
                      </Badge>
                      {selectedBooking.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={handleConfirmBooking}
                          disabled={isUpdating}
                          className="ml-auto bg-[#6E6EEF] hover:bg-[#6E6EEF]/90"
                        >
                          {isUpdating ? 'Confirming...' : 'Confirm'}
                        </Button>
                      )}
                      {selectedBooking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          onClick={handleCheckIn}
                          disabled={isUpdating}
                          className="ml-auto bg-[#D68AF1] hover:bg-[#D68AF1]/90"
                        >
                          {isUpdating ? 'Processing...' : 'Check In'}
                        </Button>
                      )}
                      {selectedBooking.status === 'checked_in' && (
                        <Button 
                          size="sm" 
                          onClick={handleCheckout}
                          disabled={isUpdating}
                          className="ml-auto bg-[#E58282] hover:bg-[#E58282]/90"
                        >
                          {isUpdating ? 'Processing...' : 'Checkout'}
                        </Button>
                      )}
                    </div>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Date */}
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{formatDate(selectedBooking.appointment_date)}</span>
                    </div>

                    {/* Time */}
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">
                        {formatTime(selectedBooking.appointment_time)}
                      </span>
                    </div>

                    {/* Client Information */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Client Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-[#ff0a85] text-white">
                              {selectedBooking.client.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{selectedBooking.client.name}</div>
                          </div>
                        </div>
                        {selectedBooking.client.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{selectedBooking.client.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{selectedBooking.client.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Service Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Service</span>
                          <span className="font-medium text-gray-900">{selectedBooking.service.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">{selectedBooking.service.duration} minutes</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedBooking.notes && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Notes</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Payment Information */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Payment</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Payment Method</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {selectedBooking.payment?.payment_method || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="font-medium text-lg text-gray-900">
                            RM {Number(selectedBooking.total_amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Actions */}
                    {selectedBooking.status === 'checked_out' && (
                      <div className="pt-4 border-t">
                        {selectedBooking.payment?.payment_method === 'cash' ? (
                          <Button 
                            className="w-full bg-[#3ABA61] hover:bg-[#3ABA61]/90"
                            onClick={handleGoToPayment}
                          >
                            Go to Payment
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-[#3ABA61] hover:bg-[#3ABA61]/90"
                            onClick={handleCompleteBooking}
                          >
                            Complete Booking
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {sheetView === 'payment' && (
                <>
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">
                      Payment - Booking #{selectedBooking.id}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Booking ID</span>
                        <span className="font-medium text-gray-900">#{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Service</span>
                        <span className="font-medium text-gray-900">{selectedBooking.service.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="font-medium text-gray-900">{selectedBooking.service.duration} min</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="font-medium text-gray-900 uppercase">CASH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">
                          RM {Number(selectedBooking.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#3ABA61] hover:bg-[#3ABA61]/90 text-white"
                      onClick={handlePayNow}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </div>
                </>
              )}

              {sheetView === 'completed' && (
                <>
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                      Booking #{selectedBooking.id}
                      <Badge 
                        variant="outline" 
                        className="text-[#3ABA61] border-[#3ABA61] font-medium"
                        style={{ borderWidth: '1.5px' }}
                      >
                        Completed
                      </Badge>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Client Information */}
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-[#ff0a85] text-white">
                              {selectedBooking.client.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{selectedBooking.client.name}</div>
                          </div>
                        </div>
                        {selectedBooking.client.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{selectedBooking.client.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{selectedBooking.client.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service & Therapist */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Service</span>
                        <span className="font-medium text-gray-900">{selectedBooking.service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Therapist</span>
                        <span className="font-medium text-gray-900">{selectedBooking.therapist.name}</span>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Paid</span>
                        <span className="font-bold text-lg text-[#3ABA61]">
                          RM {Number(selectedBooking.total_amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="font-medium text-gray-900 uppercase">
                          {selectedBooking.payment?.payment_method || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Booking Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booked On</span>
                          <span className="font-medium text-gray-900">{formatDate(selectedBooking.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booked By</span>
                          <span className="font-medium text-gray-900">{selectedBooking.client.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updated On</span>
                          <span className="font-medium text-gray-900">{formatDate(selectedBooking.updated_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updated By</span>
                          <span className="font-medium text-gray-900">Salon Admin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
