'use client'

import React from 'react'
// DashboardLayout is now handled by layout.tsx
import { StatsCard } from '@components/dashboard/StatsCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Sample data for charts
const salesData = [
  { date: '2024-01-01', sales: 4000 },
  { date: '2024-01-02', sales: 3000 },
  { date: '2024-01-03', sales: 5000 },
  { date: '2024-01-04', sales: 2780 },
  { date: '2024-01-05', sales: 1890 },
  { date: '2024-01-06', sales: 2390 },
  { date: '2024-01-07', sales: 3490 },
  { date: '2024-01-08', sales: 4200 },
  { date: '2024-01-09', sales: 3800 },
  { date: '2024-01-10', sales: 4600 },
  { date: '2024-01-11', sales: 3200 },
  { date: '2024-01-12', sales: 5100 },
  { date: '2024-01-13', sales: 4800 },
  { date: '2024-01-14', sales: 3900 },
  { date: '2024-01-15', sales: 4500 },
]

const servicesData = [
  { name: 'Facial Treatment', bookings: 45, color: '#ff0a85' },
  { name: 'Body Massage', bookings: 38, color: '#8b5cf6' },
  { name: 'Hair Care', bookings: 32, color: '#06d6a0' },
  { name: 'Nail Care', bookings: 28, color: '#f59e0b' },
  { name: 'Body Scrub', bookings: 22, color: '#ef4444' },
  { name: 'Eye Treatment', bookings: 18, color: '#3b82f6' },
]

const appointmentStatusData = [
  { name: 'Completed', value: 68, color: '#10b981' },
  { name: 'Upcoming', value: 25, color: '#3b82f6' },
  { name: 'Cancelled', value: 7, color: '#ef4444' },
]

export default function DashboardHomePage() {
  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening at your spa.</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Upcoming Appointments"
            value="24"
            icon={Calendar}
            color="blue"
            trend={{ value: 12, isPositive: true, period: 'last week' }}
          />
          <StatsCard
            title="Total Appointments"
            value="156"
            icon={Clock}
            color="green"
            trend={{ value: 8, isPositive: true, period: 'last month' }}
          />
          <StatsCard
            title="Total Revenue"
            value="RM 12,450"
            icon={DollarSign}
            color="purple"
            trend={{ value: 15, isPositive: true, period: 'last month' }}
          />
          <StatsCard
            title="Total Customers"
            value="89"
            icon={Users}
            color="orange"
            trend={{ value: 3, isPositive: false, period: 'last month' }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#ff0a85]" />
                Total Sales by Date
              </CardTitle>
              <CardDescription>Last 15 days sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tickFormatter={(value) => `RM ${value}`} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`RM ${value}`, 'Sales']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ff0a85" 
                      strokeWidth={3}
                      dot={{ fill: '#ff0a85', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ff0a85', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Services Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#ff0a85]" />
                Top Services
              </CardTitle>
              <CardDescription>Most booked services this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicesData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(value) => [`${value} bookings`, 'Bookings']} />
                    <Bar dataKey="bookings" fill="#ff0a85" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status</CardTitle>
              <CardDescription>Distribution of appointment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                {appointmentStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest bookings and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'booking',
                    message: 'New booking: Sarah Johnson - Facial Treatment',
                    time: '2 minutes ago',
                    color: 'bg-green-100 text-green-600'
                  },
                  {
                    type: 'payment',
                    message: 'Payment received: RM 150.00 from Maria Lim',
                    time: '15 minutes ago',
                    color: 'bg-blue-100 text-blue-600'
                  },
                  {
                    type: 'cancellation',
                    message: 'Booking cancelled: John Doe - Body Massage',
                    time: '1 hour ago',
                    color: 'bg-red-100 text-red-600'
                  },
                  {
                    type: 'review',
                    message: 'New review: 5 stars from Lisa Wong',
                    time: '2 hours ago',
                    color: 'bg-yellow-100 text-yellow-600'
                  },
                  {
                    type: 'staff',
                    message: 'Staff schedule updated: Maya Chen - Next week availability',
                    time: '3 hours ago',
                    color: 'bg-purple-100 text-purple-600'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.color.split(' ')[0]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}