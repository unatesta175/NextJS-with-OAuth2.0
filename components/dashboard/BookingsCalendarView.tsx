'use client'

import React, { useState, useEffect } from 'react'
import api from '@lib/axios'
import { Button } from '@components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Badge } from '@components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  CreditCard,
  FileText,
  Edit,
  X,
  Check,
  Play,
  RefreshCw,
  Clock,
  Mail,
  Phone
} from 'lucide-react'
import { DatePicker } from '@components/ui/date-picker'
import { showSuccessToast, showErrorToast } from '@lib/toast'

interface Staff {
  id: number
  name: string
  email: string
  avatar?: string
  phone?: string
  color: string
}

interface CalendarBooking {
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
    duration: number
    price: number
  }
  therapist: {
    id: number
    name: string
    email: string
    phone?: string
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
  }
}

// Color palette for therapists
const therapistColors = ['#ff0a85', '#8b5cf6', '#06d6a0', '#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#f97316']

// Helper function to format time from datetime string to AM/PM format
const formatTime = (timeString: string): string => {
  if (!timeString) return ''
  let timeOnly = timeString
  if (timeString.includes('T')) {
    timeOnly = timeString.split('T')[1].split('.')[0]
  }
  const [hours, minutes] = timeOnly.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours)
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Helper function to calculate end time in AM/PM format
const calculateEndTime = (startTime: string, duration: number): string => {
  // Remove AM/PM if present and get just the time
  const timeOnly = startTime.replace(/ AM| PM/g, '')
  const [hours, minutes] = timeOnly.split(':').map(Number)
  
  // Convert to 24-hour for calculation if it was in 12-hour format
  let hour24 = hours
  if (startTime.includes('PM') && hours !== 12) {
    hour24 = hours + 12
  } else if (startTime.includes('AM') && hours === 12) {
    hour24 = 0
  }
  
  const totalMinutes = hour24 * 60 + minutes + duration
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60
  
  const period = endHours >= 12 ? 'PM' : 'AM'
  const displayHours = endHours > 12 ? endHours - 12 : (endHours === 0 ? 12 : endHours)
  return `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${period}`
}

// Helper function to format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Generate time slots from 8 AM to 8 PM in 30-minute intervals
const timeSlots: string[] = []
for (let hour = 8; hour <= 20; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour)
    const time = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`
    timeSlots.push(time)
  }
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: '#e5a900',
    bgColor: 'rgba(229, 169, 0, 0.1)',
    badgeClass: 'text-[#e5a900] border-[#e5a900]'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: '#6E6EEF',
    bgColor: 'rgba(110, 110, 239, 0.1)',
    badgeClass: 'text-[#6E6EEF] border-[#6E6EEF]'
  },
  checked_in: { 
    label: 'Check In', 
    color: '#D68AF1',
    bgColor: 'rgba(214, 138, 241, 0.1)',
    badgeClass: 'text-[#D68AF1] border-[#D68AF1]'
  },
  checked_out: { 
    label: 'Checkout', 
    color: '#E58282',
    bgColor: 'rgba(229, 130, 130, 0.1)',
    badgeClass: 'text-[#E58282] border-[#E58282]'
  },
  completed: { 
    label: 'Completed', 
    color: '#3ABA61',
    bgColor: 'rgba(58, 186, 97, 0.1)',
    badgeClass: 'text-[#3ABA61] border-[#3ABA61]'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    badgeClass: 'text-red-600 border-red-600'
  },
  no_show: { 
    label: 'No Show', 
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    badgeClass: 'text-gray-600 border-gray-600'
  }
}

export function BookingsCalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [sheetView, setSheetView] = useState<'details' | 'payment' | 'completed'>('details')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Data states
  const [staffData, setStaffData] = useState<Staff[]>([])
  const [calendarBookings, setCalendarBookings] = useState<CalendarBooking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Ref for scroll container
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Fetch therapists
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await api.get('/admin/users?role=therapist')
        const therapists = response.data.data || response.data
        const therapistsWithColors = therapists.map((therapist: any, index: number) => ({
          id: therapist.id,
          name: therapist.name,
          email: therapist.email,
          phone: therapist.phone,
          color: therapistColors[index % therapistColors.length]
        }))
        setStaffData(therapistsWithColors)
      } catch (error) {
        console.error('Failed to fetch therapists:', error)
        setStaffData([])
      }
    }
    
    fetchTherapists()
  }, [])

  // Fetch bookings for selected date
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/admin/bookings')
        const allBookings = response.data.data || []
        
        // Filter bookings for selected date
        const dateStr = formatDateForAPI(selectedDate)
        const filtered = allBookings.filter((booking: CalendarBooking) => {
          const bookingDate = booking.appointment_date.split('T')[0]
          return bookingDate === dateStr
        })
        
        setCalendarBookings(filtered)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
        setCalendarBookings([])
      } finally {
        setIsLoading(false)
      }
    }
    
    if (staffData.length > 0) {
      fetchBookings()
    }
  }, [selectedDate, staffData.length])

  // No auto-scroll needed since 8 AM is at the top

  // Filter staff based on selection
  const displayStaff = selectedStaff === 'all' 
    ? staffData 
    : staffData.filter(s => s.id.toString() === selectedStaff)

  // Get bookings for selected date and staff
  const filteredBookings = calendarBookings.filter(booking => {
    if (selectedStaff !== 'all' && booking.therapist_id.toString() !== selectedStaff) {
      return false
    }
    return true
  })

  const getBookingPosition = (startTime: string, duration: number) => {
    // Remove AM/PM and parse time
    const timeOnly = startTime.replace(/ AM| PM/g, '')
    const [hours, minutes] = timeOnly.split(':').map(Number)
    
    // Convert to 24-hour format if needed
    let hour24 = hours
    if (startTime.includes('PM') && hours !== 12) {
      hour24 = hours + 12
    } else if (startTime.includes('AM') && hours === 12) {
      hour24 = 0
    }
    
    // Calculate from 8 AM start (8 AM = 480 minutes from midnight)
    const startMinutes = hour24 * 60 + minutes
    const calendarStartMinutes = 8 * 60 // 8 AM in minutes
    const calendarTotalMinutes = 12 * 60 + 30 // 8 AM to 8:30 PM (12.5 hours)
    const minutesFromStart = startMinutes - calendarStartMinutes
    
    const topPercentage = (minutesFromStart / calendarTotalMinutes) * 100
    const heightPercentage = (duration / calendarTotalMinutes) * 100
    
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`
    }
  }

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSelectedDate(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSelectedDate(nextDay)
  }

  const handleBookingClick = (booking: CalendarBooking) => {
    setSelectedBooking(booking)
    setSheetView('details')
    setIsDetailsOpen(true)
  }

  const handleStatusChange = async (newStatus: CalendarBooking['status']) => {
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
        
        // Update in the calendar bookings list
        setCalendarBookings(prev => 
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
        
        setCalendarBookings(prev => 
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <DatePicker
            date={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            placeholder="Select date"
          />

          <div className="font-semibold text-lg">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Therapists</SelectItem>
              {staffData.map((staff) => (
                <SelectItem key={staff.id} value={staff.id.toString()}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg bg-white overflow-hidden">
        {/* Fixed Headers - Reserve space for scrollbar */}
        <div 
          className="grid border-b bg-gray-50"
          style={{ 
            gridTemplateColumns: `80px repeat(${displayStaff.length}, 1fr)`,
            paddingRight: '17px' // Reserve space for scrollbar (Windows default: 17px)
          }}
        >
          {/* Time Header */}
          <div className="h-12 border-r flex items-center justify-center text-xs font-medium text-gray-500">
            Time
          </div>
          
          {/* Staff Headers */}
          {displayStaff.map((staff) => (
            <div
              key={staff.id}
              className="h-12 border-r last:border-r-0 flex items-center justify-center p-2"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">{staff.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="h-[700px] overflow-y-scroll scroll-smooth">
          <div 
            className="grid relative"
            style={{ gridTemplateColumns: `80px repeat(${displayStaff.length}, 1fr)` }}
          >
            {/* Time Column */}
            <div className="border-r bg-gray-50">
              {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                <div
                  key={time}
                  className="h-16 border-b flex items-start justify-center pt-1 text-xs text-gray-500"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Staff Columns - Each as direct grid item */}
            {displayStaff.map((staff) => (
              <div 
                key={staff.id}
                className="relative border-r last:border-r-0"
              >
                {/* Time Grid Lines */}
                {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                  <div
                    key={time}
                    className="h-16 border-b"
                  />
                ))}

                {/* Booking Blocks for this staff */}
                {!isLoading && filteredBookings
                  .filter(booking => booking.therapist_id === staff.id)
                  .map((booking) => {
                    const startTime = formatTime(booking.appointment_time)
                    const endTime = calculateEndTime(startTime, booking.service.duration)
                    const position = getBookingPosition(startTime, booking.service.duration)
                    const statusStyle = statusConfig[booking.status]
                    
                    return (
                      <div
                        key={booking.id}
                        className="absolute left-1 right-1 p-2 rounded-md border cursor-pointer hover:shadow-md transition-shadow"
                        style={{
                          ...position,
                          backgroundColor: statusStyle.bgColor,
                          borderColor: statusStyle.color,
                          borderWidth: '2px'
                        }}
                        onClick={() => handleBookingClick(booking)}
                      >
                        <div className="text-xs font-medium truncate">
                          {booking.client.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {booking.service.name}
                        </div>
                        <div className="text-xs mt-1">
                          {startTime} - {endTime}
                        </div>
                        <div className="text-xs font-medium">
                          RM {Number(booking.total_amount).toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ))}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50" style={{ gridColumn: '1 / -1' }}>
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

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
