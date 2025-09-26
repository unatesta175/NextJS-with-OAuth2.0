'use client'

import React, { useState } from 'react'
import { BookingsDataTable } from '@components/dashboard/BookingsDataTable'
import { BookingsCalendarView } from '@components/dashboard/BookingsCalendarView'
import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Calendar, Table, Plus } from 'lucide-react'

export default function BookingsPage() {
  const [activeView, setActiveView] = useState('table')

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Bookings</h1>
            <p className="text-gray-600 mt-1">Manage appointments and view schedule</p>
          </div>
          <Button className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* View Toggle */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Data Table
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Bookings Data Table</h2>
                <p className="text-gray-600 text-sm">View and manage all bookings in a detailed table format</p>
              </div>
              <BookingsDataTable />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Calendar Schedule</h2>
                <p className="text-gray-600 text-sm">Day-view scheduling interface with staff and time slots</p>
              </div>
              <BookingsCalendarView />
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
