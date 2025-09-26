import { Skeleton } from "@components/ui/skeleton"

export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-32" />
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        
        {/* Table Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
