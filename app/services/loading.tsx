import { Skeleton } from "@components/ui/skeleton"

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto mb-8" />
            
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-20" />
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
