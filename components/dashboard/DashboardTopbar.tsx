'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@lib/reduxHooks'
import { logoutUser } from '@/features/auth/authSlice'
import { getUserImageUrl } from '@lib/image-utils'
import { ChevronDown, Menu, Settings, LogOut, User } from 'lucide-react'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'

interface DashboardTopbarProps {
  onMenuToggle: () => void
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}

export function DashboardTopbar({
  onMenuToggle,
  user = {
    name: 'John Doe',
    email: 'john@kapasbeauty.com',
    role: 'admin'
  }
}: DashboardTopbarProps) {
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
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={getUserImageUrl(user.avatar)} 
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
