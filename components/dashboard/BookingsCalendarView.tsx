'use client'

import React, { useState } from 'react'
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
  Play
} from 'lucide-react'
import { DatePicker } from '@components/ui/date-picker'

interface Staff {
  id: string
  name: string
  avatar?: string
  color: string
}

interface CalendarBooking {
  id: string
  customer: {
    name: string
    phone: string
    email: string
    avatar?: string
  }
  service: string
  duration: number
  amount: number
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  staffId: string
  notes?: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
}

// Sample staff data
const staffData: Staff[] = [
  { id: 'staff1', name: 'Maya Chen', color: '#ff0a85' },
  { id: 'staff2', name: 'Lisa Wong', color: '#8b5cf6' },
  { id: 'staff3', name: 'Amy Tan', color: '#06d6a0' },
  { id: 'staff4', name: 'Sarah Lee', color: '#f59e0b' },
]

// Sample bookings data
const calendarBookings: CalendarBooking[] = [
  {
    id: 'BK001',
    customer: {
      name: 'Sarah Johnson',
      phone: '+60123456789',
      email: 'sarah@email.com'
    },
    service: 'Facial Treatment',
    duration: 90,
    amount: 150,
    startTime: '10:00',
    endTime: '11:30',
    status: 'confirmed',
    staffId: 'staff1',
    notes: 'First time customer, sensitive skin',
    paymentStatus: 'paid'
  },
  {
    id: 'BK002',
    customer: {
      name: 'Maria Lim',
      phone: '+60123456790',
      email: 'maria@email.com'
    },
    service: 'Body Massage',
    duration: 120,
    amount: 200,
    startTime: '14:00',
    endTime: '16:00',
    status: 'in-progress',
    staffId: 'staff2',
    paymentStatus: 'paid'
  },
  {
    id: 'BK003',
    customer: {
      name: 'John Doe',
      phone: '+60123456791',
      email: 'john@email.com'
    },
    service: 'Hair Care',
    duration: 60,
    amount: 80,
    startTime: '11:30',
    endTime: '12:30',
    status: 'pending',
    staffId: 'staff3',
    paymentStatus: 'pending'
  },
  {
    id: 'BK004',
    customer: {
      name: 'Lisa Chen',
      phone: '+60123456792',
      email: 'lisa@email.com'
    },
    service: 'Nail Care',
    duration: 75,
    amount: 120,
    startTime: '15:00',
    endTime: '16:15',
    status: 'confirmed',
    staffId: 'staff1',
    paymentStatus: 'paid'
  }
]

// Generate time slots from 8 AM to 8 PM in 30-minute intervals
const timeSlots: string[] = []
for (let hour = 8; hour <= 20; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    timeSlots.push(time)
  }
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'in-progress': { label: 'In Progress', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' }
}

export function BookingsCalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter staff based on selection
  const displayStaff = selectedStaff === 'all' ? staffData : staffData.filter(s => s.id === selectedStaff)

  // Get bookings for selected date and staff
  const filteredBookings = calendarBookings.filter(booking => {
    if (selectedStaff !== 'all' && booking.staffId !== selectedStaff) {
      return false
    }
    return true // In real app, would filter by selectedDate
  })

  const getBookingPosition = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startMinutes = (hours - 8) * 60 + minutes
    const topPercentage = (startMinutes / (12 * 60)) * 100 // 12 hours from 8 AM to 8 PM
    const heightPercentage = (duration / (12 * 60)) * 100
    
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
    setIsDetailsOpen(true)
  }

  const handleStatusChange = (newStatus: CalendarBooking['status']) => {
    if (selectedBooking) {
      // TODO: Update booking status
      console.log('Update booking status:', selectedBooking.id, newStatus)
      setSelectedBooking({...selectedBooking, status: newStatus})
    }
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
              <SelectItem value="all">All Staff</SelectItem>
              {staffData.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="grid grid-cols-[80px_1fr] h-[600px]">
          {/* Time Column */}
          <div className="border-r bg-gray-50">
            <div className="h-12 border-b flex items-center justify-center text-xs font-medium text-gray-500">
              Time
            </div>
            <div className="relative">
              {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                <div
                  key={time}
                  className="h-16 border-b flex items-start justify-center pt-1 text-xs text-gray-500"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Staff Columns */}
          <div className={`grid grid-cols-${Math.min(displayStaff.length, 4)} relative`}>
            {/* Staff Headers */}
            {displayStaff.map((staff) => (
              <div
                key={staff.id}
                className="h-12 border-b border-r last:border-r-0 flex items-center justify-center p-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback className="text-xs">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{staff.name}</span>
                </div>
              </div>
            ))}

            {/* Time Grid Background */}
            <div className="absolute inset-0 top-12">
              {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                <div
                  key={time}
                  className="h-16 border-b grid"
                  style={{ gridTemplateColumns: `repeat(${displayStaff.length}, 1fr)` }}
                >
                  {displayStaff.map((_, staffIndex) => (
                    <div
                      key={staffIndex}
                      className="border-r last:border-r-0"
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Booking Blocks */}
            {displayStaff.map((staff, staffIndex) => (
              <div key={staff.id} className="absolute inset-0 top-12">
                <div
                  className="relative h-full"
                  style={{
                    left: `${(staffIndex / displayStaff.length) * 100}%`,
                    width: `${100 / displayStaff.length}%`
                  }}
                >
                  {filteredBookings
                    .filter(booking => booking.staffId === staff.id)
                    .map((booking) => {
                      const position = getBookingPosition(booking.startTime, booking.duration)
                      const statusClass = statusConfig[booking.status]
                      
                      return (
                        <div
                          key={booking.id}
                          className={`absolute left-1 right-1 p-2 rounded-md border cursor-pointer hover:shadow-md transition-shadow ${statusClass.color}`}
                          style={position}
                          onClick={() => handleBookingClick(booking)}
                        >
                          <div className="text-xs font-medium truncate">
                            {booking.customer.name}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {booking.service}
                          </div>
                          <div className="text-xs mt-1">
                            {booking.startTime} - {booking.endTime}
                          </div>
                          <div className="text-xs font-medium">
                            RM {booking.amount}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </SheetTitle>
                <SheetDescription>
                  Booking ID: {selectedBooking.id}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Customer Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedBooking.customer.avatar} />
                        <AvatarFallback>
                          {selectedBooking.customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedBooking.customer.name}</div>
                        <div className="text-sm text-gray-500">{selectedBooking.customer.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Phone: {selectedBooking.customer.phone}
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Service Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Service:</span>
                      <span className="font-medium">{selectedBooking.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedBooking.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time:</span>
                      <span className="font-medium">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Staff:</span>
                      <span className="font-medium">
                        {staffData.find(s => s.id === selectedBooking.staffId)?.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="font-medium text-lg">RM {selectedBooking.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <Badge variant={selectedBooking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Current Status</h3>
                  <Badge className={statusConfig[selectedBooking.status].color}>
                    {statusConfig[selectedBooking.status].label}
                  </Badge>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => console.log('Edit booking')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {selectedBooking.status === 'pending' && (
                      <Button size="sm" onClick={() => handleStatusChange('confirmed')}>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    {selectedBooking.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleStatusChange('in-progress')}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    {selectedBooking.status === 'in-progress' && (
                      <Button size="sm" onClick={() => handleStatusChange('completed')}>
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange('cancelled')}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
