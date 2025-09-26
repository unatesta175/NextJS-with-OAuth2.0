'use client'

import { usePathname } from 'next/navigation'


import Header from "@components/layout/Header"
import Footer from "@components/layout/Footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current route is dashboard (excluding dashboard login)
  const isDashboardRoute = pathname.startsWith('/dashboard') && pathname !== '/dashboard/login'
  
  // Check if current route is auth (including dashboard login)
  const isAuthRoute = pathname.startsWith('/auth') || pathname === '/dashboard/login'
  
  // Check if current route is client-specific (includes client pages and public pages used by clients)
  const isClientRoute = pathname.startsWith('/client') || 
                        pathname.startsWith('/booking') || 
                        pathname.startsWith('/services') || 
                        pathname.startsWith('/categories') || 
                        pathname.startsWith('/my-bookings') ||
                        pathname.startsWith('/profile') ||
                        pathname === '/'

  if (isDashboardRoute) {
    // Dashboard routes: No client UI, just the children (dashboard has its own layout)
    return <>{children}</>
  }

  if (isAuthRoute) {
    // Auth routes: Clean layout without sidebar/topbar/header/footer
    return <>{children}</>
  }

  // Client routes: Show the main site layout with sidebar and topbar
  return (
    <div className={`min-h-screen flex flex-col ${isClientRoute ? 'client-theme' : ''}`}>
      <Header />
      <div className="flex flex-1">
     
        <div className="flex-1 flex flex-col">
         
          <main className="flex-1 p-4 bg-background">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

