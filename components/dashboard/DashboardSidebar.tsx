'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package, 
  ShoppingBag, 
  Tag, 
  Tags,
  Star, 
  BarChart3,
  ClipboardList,
  X
} from 'lucide-react'
import { cn } from '@lib/utils'
import { Button } from '@components/ui/button'

interface DashboardSidebarProps {
  userRole: 'staff' | 'admin'
  isCollapsed?: boolean
  onToggle?: () => void
}

const staffNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Calendar/Bookings', href: '/dashboard/bookings', icon: Calendar },
  { label: 'My Schedule', href: '/dashboard/schedule', icon: ClipboardList },
  { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
]

const adminNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Calendar/Bookings', href: '/dashboard/bookings', icon: Calendar },
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Services', href: '/dashboard/services', icon: Package },
  { label: 'Products', href: '/dashboard/products', icon: ShoppingBag },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Tags', href: '/dashboard/tags', icon: Tags },
  { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

export function DashboardSidebar({ userRole, isCollapsed = false, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const navItems = userRole === 'admin' ? adminNavItems : staffNavItems

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
        isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0",
        "w-64"
      )}>
        {/* Logo Section */}
        <div className="relative flex items-center justify-center p-4 border-b border-gray-200">
          <Image 
            src="/logo/big-logo.png" 
            alt="Kapas Beauty Logo" 
            width={90} 
            height={40}
            className="object-contain"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden absolute right-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-[#ff0a85]/10 text-[#ff0a85] border-r-2 border-[#ff0a85]" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onToggle?.()
                      }
                    }}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-[#ff0a85]" : "text-gray-400"
                    )} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Role Badge */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Role</div>
            <div className="text-sm font-medium text-gray-800 capitalize">{userRole}</div>
          </div>
        </div>
      </div>
    </>
  )
}
