'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@lib/reduxHooks'
import { UserRole } from '@/features/auth/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Don't redirect while still loading authentication status
    if (loading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(fallbackPath)
      return
    }

    // If authenticated but doesn't have required role, redirect appropriately
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect to their appropriate page based on role
      if (user.role === 'client') {
        router.push('/')
      } else {
        router.push('/auth/login')
      }
      return
    }
  }, [isAuthenticated, user, loading, router, allowedRoles, fallbackPath])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0a85] mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If we're not loading but still not authenticated or wrong role, the useEffect will handle redirects
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0a85] mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
