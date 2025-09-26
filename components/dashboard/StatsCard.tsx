'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
}

const colorClasses = {
  blue: {
    icon: 'bg-blue-100 text-blue-600',
    trend: 'text-blue-600'
  },
  green: {
    icon: 'bg-green-100 text-green-600',
    trend: 'text-green-600'
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600',
    trend: 'text-purple-600'
  },
  orange: {
    icon: 'bg-orange-100 text-orange-600',
    trend: 'text-orange-600'
  },
  pink: {
    icon: 'bg-pink-100 text-pink-600',
    trend: 'text-pink-600'
  }
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue'
}: StatsCardProps) {
  const colors = colorClasses[color]

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {trend && (
              <div className="flex items-center text-sm">
                <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-gray-500 ml-1">vs {trend.period}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
