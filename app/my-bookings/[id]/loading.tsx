import { RefreshCw } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-600" />
          <h2 className="text-xl font-semibold mb-2">Loading Booking Details...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your booking information</p>
        </div>
      </div>
    </div>
  );
}

