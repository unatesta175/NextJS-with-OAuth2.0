'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useInstantNavigation() {
  const router = useRouter()

  // Prefetch all main routes on mount
  useEffect(() => {
    const mainRoutes = [
      '/dashboard',
      '/dashboard/bookings',
      '/dashboard/services', 
      '/dashboard/users',
      '/dashboard/categories',
      '/dashboard/products',
      '/dashboard/reviews',
      '/services',
      '/categories',
      '/booking',
      '/my-bookings',
      '/profile',
      '/auth/login',
      '/client',
      '/'
    ]

    // Prefetch all routes
    mainRoutes.forEach(route => {
      router.prefetch(route)
    })
  }, [router])

  const navigateTo = (href: string) => {
    // Prefetch the route if not already prefetched
    router.prefetch(href)
    
    // Navigate immediately
    router.push(href)
  }

  return { navigateTo, router }
}
