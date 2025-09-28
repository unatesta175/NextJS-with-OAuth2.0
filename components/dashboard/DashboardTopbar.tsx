'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAppDispatch } from '@lib/reduxHooks'
import { logoutUser } from '@/features/auth/authSlice'
import { Bell, ChevronDown, Menu, MapPin, Settings, LogOut, User } from 'lucide-react'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Badge } from '@components/ui/badge'

interface DashboardTopbarProps {
  onMenuToggle: () => void
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
  selectedBranch?: string
  onBranchChange?: (branchId: string) => void
  branches?: Array<{
    id: string
    name: string
    address: string
  }>
  notificationCount?: number
}

export function DashboardTopbar({
  onMenuToggle,
  user = {
    name: 'John Doe',
    email: 'john@kapasbeauty.com',
    role: 'admin'
  },
  selectedBranch = 'main',
  onBranchChange,
  branches = [
    { id: 'main', name: 'Main Branch', address: 'Kuala Lumpur' },
    { id: 'pj', name: 'Petaling Jaya', address: 'PJ' },
    { id: 'shah-alam', name: 'Shah Alam', address: 'Shah Alam' }
  ],
  notificationCount = 3
}: DashboardTopbarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Dispatch logout action and wait for completion
      await dispatch(logoutUser()).unwrap()
      // Redirect to login page after successful logout
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, redirect to login page
      router.push('/auth/login')
    }
  }

  const handleProfileSettings = () => {
    // Navigate to profile settings page
    router.push('/dashboard/profile')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - Hidden on mobile, visible on larger screens */}
          <Link href="/" className="hidden md:flex items-center">
            <div className="relative h-8 w-24">
              <Image
                src="/Logo/big-logo.png"
                alt="Kapas Beauty Spa"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Branch Selector */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <Select value={selectedBranch} onValueChange={onBranchChange}>
              <SelectTrigger className="w-48 border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-xs text-gray-500">{branch.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#ff0a85]"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {/* Sample notifications */}
                <DropdownMenuItem className="flex-col items-start p-3">
                  <div className="font-medium text-sm">New booking received</div>
                  <div className="text-xs text-gray-500">Sarah Johnson booked a massage for tomorrow</div>
                  <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-3">
                  <div className="font-medium text-sm">Payment confirmed</div>
                  <div className="text-xs text-gray-500">RM 150.00 payment received from client</div>
                  <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-3">
                  <div className="font-medium text-sm">Staff schedule updated</div>
                  <div className="text-xs text-gray-500">Maya updated her availability for next week</div>
                  <div className="text-xs text-gray-400 mt-1">3 hours ago</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-[#ff0a85] cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user.avatar || "/placeholder-avatar.svg"} 
                    alt={user.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-avatar.svg";
                    }}
                  />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
