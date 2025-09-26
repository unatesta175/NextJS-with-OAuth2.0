'use client'

import React, { useState } from 'react'
import { useAppSelector } from '@lib/reduxHooks'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'
import { ProtectedRoute } from './ProtectedRoute'

interface DashboardLayoutProps {
  children: React.ReactNode
  selectedBranch?: string
  onBranchChange?: (branchId: string) => void
  branches?: Array<{
    id: string
    name: string
    address: string
  }>
}

export function DashboardLayout({
  children,
  selectedBranch,
  onBranchChange,
  branches
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const { user } = useAppSelector(state => state.auth)

  // Map therapist to staff for consistency
  const userRole = user?.role === 'therapist' ? 'staff' : (user?.role === 'admin' ? 'admin' : 'staff')

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <ProtectedRoute allowedRoles={['therapist', 'admin']} fallbackPath="/dashboard/login">
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar
          userRole={userRole}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
        />

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Top Navigation */}
          <DashboardTopbar
            onMenuToggle={handleSidebarToggle}
            user={user ? {
              name: user.name,
              email: user.email,
              role: userRole
            } : undefined}
            selectedBranch={selectedBranch}
            onBranchChange={onBranchChange}
            branches={branches}
          />

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
