'use client'

import React, { useState, useEffect } from 'react'
import api from '@lib/axios'
import { StatsCard } from '@components/dashboard/StatsCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Star,
  RefreshCw,
  AlertCircle
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
import { Button } from '@components/ui/button'
import { showErrorToast } from '@lib/toast'

// Types
interface DashboardStats {
  upcomingAppointments: {
    value: number
    trend: number
    isPositive: boolean
  }
  totalAppointments: {
    value: number
    trend: number
    isPositive: boolean
  }
  totalRevenue: {
    value: number
    trend: number
    isPositive: boolean
  }
  totalCustomers: {
    value: number
    trend: number
    isPositive: boolean
  }
}

interface SalesDataPoint {
  date: string
  sales: number
}

interface ServiceData {
  name: string
  bookings: number
  color: string
}

interface StatusData {
  name: string
  value: number
  count?: number
  color: string
  [key: string]: string | number | undefined
}

interface Activity {
  type: string
  message: string
  time: string
  color: string
}

interface DashboardData {
  stats: DashboardStats
  salesData: SalesDataPoint[]
  topServices: ServiceData[]
  appointmentStatus: StatusData[]
  recentActivity: Activity[]
}

export default function DashboardHomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.get('/dashboard')
      if (response.data.success) {
        setDashboardData(response.data.data)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data')
      showErrorToast('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-600" />
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-600 mb-4">{error || 'An unexpected error occurred'}</p>
              <Button onClick={fetchDashboardData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { stats, salesData, topServices, appointmentStatus, recentActivity } = dashboardData

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening at your spa.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments.value.toString()}
          icon={Calendar}
          color="blue"
          trend={{ 
            value: Math.abs(stats.upcomingAppointments.trend), 
            isPositive: stats.upcomingAppointments.isPositive, 
            period: 'last week' 
          }}
        />
        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments.value.toString()}
          icon={Clock}
          color="green"
          trend={{ 
            value: Math.abs(stats.totalAppointments.trend), 
            isPositive: stats.totalAppointments.isPositive, 
            period: 'last month' 
          }}
        />
        <StatsCard
          title="Total Revenue"
          value={`RM ${stats.totalRevenue.value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="purple"
          trend={{ 
            value: Math.abs(stats.totalRevenue.trend), 
            isPositive: stats.totalRevenue.isPositive, 
            period: 'last month' 
          }}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.value.toString()}
          icon={Users}
          color="orange"
          trend={{ 
            value: Math.abs(stats.totalCustomers.trend), 
            isPositive: stats.totalCustomers.isPositive, 
            period: 'last month' 
          }}
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
            {salesData.length > 0 ? (
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
                      formatter={(value: any) => [`RM ${value}`, 'Sales']}
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
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No sales data available</p>
              </div>
            )}
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
            {topServices.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topServices} layout="horizontal">
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
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No service data available</p>
              </div>
            )}
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
            {appointmentStatus.some(status => status.value > 0) ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {appointmentStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col space-y-2 mt-4">
                  {appointmentStatus.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}% ({item.count || 0})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                <p>No appointment data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.color.split(' ')[0]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
