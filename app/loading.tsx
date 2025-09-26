import { Skeleton } from "@components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="relative h-[600px] bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-32" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Quick Booking Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
          <div className="text-center">
            <Skeleton className="h-10 w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Why Choose Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
