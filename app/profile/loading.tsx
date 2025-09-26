import { Skeleton } from "@components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center mb-6">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-40 mx-auto" />
                  </div>
                  
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>

                    <div>
                      <Skeleton className="h-4 w-12 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>

                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-24 w-full" />
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
