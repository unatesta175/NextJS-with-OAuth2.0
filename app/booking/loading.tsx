import { Skeleton } from "@components/ui/skeleton"

export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-16 ml-2" />
                    {i < 3 && <Skeleton className="h-px w-8 ml-4" />}
                  </div>
                ))}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-18 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="mb-8">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <Skeleton className="h-20 w-full mb-3" />
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
