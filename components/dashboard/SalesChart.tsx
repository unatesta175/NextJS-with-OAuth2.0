'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface SalesChartProps {
  data: Array<{
    date: string
    sales: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
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
            <LineChart data={data}>
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
  )
}
