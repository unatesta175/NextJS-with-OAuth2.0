'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardLayout as DashboardLayoutComponent } from '@components/dashboard/DashboardLayout'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  // Don't apply dashboard layout to login page
  if (pathname === '/dashboard/login') {
    return <>{children}</>
  }

  return (
    <DashboardLayoutComponent>
      {children}
    </DashboardLayoutComponent>
  )
}