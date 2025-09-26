"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { Calendar, Clock, User, MapPin, Download } from "lucide-react";

// Mock booking data
const mockBookings = [
  {
    id: 1,
    service: "Hydrating Facial Treatment",
    therapist: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "60 mins",
    status: "confirmed",
    branch: "KL Central",
    price: "RM 150",
    category: "Facial",
    canReschedule: true,
    canCancel: true
  },
  {
    id: 2,
    service: "Deep Tissue Massage",
    therapist: "Maria Rodriguez",
    date: "2024-01-20",
    time: "2:00 PM", 
    duration: "90 mins",
    status: "pending",
    branch: "Mont Kiara",
    price: "RM 200",
    category: "Massage",
    canReschedule: true,
    canCancel: true
  },
  {
    id: 3,
    service: "Manicure & Pedicure",
    therapist: "Lisa Chen",
    date: "2024-01-10",
    time: "3:00 PM",
    duration: "120 mins", 
    status: "completed",
    branch: "KLCC",
    price: "RM 120",
    category: "Nail Care",
    canReschedule: false,
    canCancel: false
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MyBookingsPage() {
  const [bookings] = useState(mockBookings);
  const [isLoading] = useState(false);

  const handleReschedule = (bookingId: number) => {
    console.log("Reschedule booking:", bookingId);
    // Add reschedule logic here
  };

  const handleCancel = (bookingId: number) => {
    console.log("Cancel booking:", bookingId);
    // Add cancel logic here
  };

  const handleDownloadInvoice = (bookingId: number) => {
    console.log("Download invoice:", bookingId);
    // Add download logic here
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your spa appointments and booking history</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {bookings.filter(b => b.status === "confirmed").length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {bookings.filter(b => b.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.service}
                        </h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{booking.price}</div>
                        <div className="text-sm text-gray-600">{booking.category}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{booking.time} ({booking.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{booking.therapist}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{booking.branch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                    {booking.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(booking.id)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Invoice</span>
                      </Button>
                    )}
                    
                    {booking.canReschedule && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReschedule(booking.id)}
                      >
                        Reschedule
                      </Button>
                    )}
                    
                    {booking.canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                You haven&apos;t made any bookings yet. Start your wellness journey today!
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/booking">Book Your First Treatment</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}




