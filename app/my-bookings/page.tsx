"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@lib/reduxHooks";
import { selectAuth } from "app/features/auth/authSlice";
import api from "@lib/axios";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Calendar } from "@components/ui/calendar";
import { 
  Clock, 
  User, 
  Calendar as CalendarIcon, 
  MapPin, 
  CreditCard, 
  Download,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye
} from "lucide-react";
import { cn } from "@lib/utils";
import { showSuccessToast, showErrorToast } from "@lib/toast";

// Types
interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  therapist_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  service: {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
    image?: string;
    category: {
      id: number;
      name: string;
    };
  };
  therapist: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };
  payment?: {
    id: number;
    amount: number;
    status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: 'cash' | 'toyyibpay';
    toyyibpay_transaction_id?: string;
    paid_at?: string;
  };
}

// Helper function to format date in Laravel default style (e.g., "October 4, 2025")
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date not set';
  
  try {
    // Handle ISO format (2025-10-04T10:00:00.000000Z) or simple format (2025-10-04)
    const dateOnly = dateString.split('T')[0].split(' ')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return dateString;
    }
    
    // Create date in local timezone
    const date = new Date(year, month - 1, day);
    
    // Format like Laravel: "October 4, 2025"
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString;
  }
};

// Helper function to format time with error handling (e.g., "10:00 AM")
const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return 'Time not set';
  
  try {
    let timeOnly = timeString;
    
    // If it's an ISO datetime string (2025-10-04T10:00:00.000000Z), extract time part
    if (timeString.includes('T')) {
      const timePart = timeString.split('T')[1];
      // Remove milliseconds and timezone (10:00:00.000000Z -> 10:00:00)
      timeOnly = timePart.split('.')[0];
    }
    
    // Parse time (HH:MM:SS format)
    const [hours, minutes] = timeOnly.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString;
    }
    
    // Format to 12-hour time with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes} ${period}`;
  } catch (error) {
    return timeString;
  }
};

export default function MyBookingsPage() {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Manual state management instead of React Query
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch bookings function
  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data);
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment callback from ToyyibPay
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const message = searchParams.get('message');

    if (paymentStatus && message) {
      // Show appropriate toast based on payment status
      if (paymentStatus === 'success') {
        showSuccessToast(decodeURIComponent(message));
      } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
        showErrorToast(decodeURIComponent(message));
      }

      // Clear query parameters from URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.pathname);

      // Refresh bookings to show updated status
      fetchBookings();
    }
  }, [searchParams]);

  // Fetch bookings on mount and when authentication changes
  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleViewDetails = (booking: Booking) => {
    router.push(`/my-bookings/${booking.id}`);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    try {
      await api.put(`/bookings/${selectedBooking.id}/cancel`, { reason: 'Cancelled by user' });
      
      showSuccessToast('Booking cancelled successfully');
      setShowCancelModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      showErrorToast(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">Please log in to view your bookings</p>
              <Button onClick={() => window.location.href = '/auth/login'}>
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Bookings</h2>
              <p className="text-muted-foreground mb-4">Failed to load your bookings. Please try again.</p>
              <Button onClick={fetchBookings}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">Manage your spa appointments</p>
          </div>
          <Button onClick={fetchBookings} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {!bookings || bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Bookings Yet</h2>
              <p className="text-muted-foreground mb-4">You haven't made any bookings yet. Book your first spa treatment!</p>
              <Button onClick={() => window.location.href = '/booking'}>
                Book Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm text-muted-foreground">Booking #{booking.id}</span>
                    <div className="text-2xl font-bold" style={{ color: '#ff0a85' }}>RM {booking.total_amount}</div>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    {/* Service Image */}
                    <div className="flex-shrink-0">
                      {booking.service.image ? (
                        <Image
                          src={booking.service.image.startsWith('http') ? booking.service.image : `http://localhost:8000/${booking.service.image}`}
                          alt={booking.service.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 flex items-center justify-center">
                          <span className="text-3xl text-pink-600 dark:text-pink-400">
                            {booking.service.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Booking Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-3">{booking.service.name}</h3>
                      
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {/* Left Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground font-medium">Date:</span>
                            <span className="text-foreground">{formatDate(booking.appointment_date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground font-medium">Time:</span>
                            <span className="text-foreground">{formatTime(booking.appointment_time)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground font-medium">Therapist:</span>
                            <span className="text-foreground">{booking.therapist.name}</span>
                          </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground font-medium">Booking Status:</span>
                            <Badge 
                              variant="outline"
                              className={cn(
                                "capitalize font-medium",
                                booking.status === 'completed' && "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
                                booking.status === 'confirmed' && "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
                                booking.status === 'checked_in' && "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
                                booking.status === 'checked_out' && "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
                                booking.status === 'cancelled' && "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
                                booking.status === 'pending' && "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
                                booking.status === 'no_show' && "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                              )}
                            >
                              {booking.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {booking.payment && (
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground font-medium">Payment Status:</span>
                              <Badge 
                                variant="outline"
                                className={cn(
                                  "capitalize font-medium",
                                  booking.payment.status === 'paid' && "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
                                  booking.payment.status === 'unpaid' && "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
                                  booking.payment.status === 'pending' && "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
                                  booking.payment.status === 'failed' && "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
                                  booking.payment.status === 'refunded' && "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                )}
                              >
                                {booking.payment.status}
                              </Badge>
                            </div>
                          )}
                          
                          {booking.payment && (
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground font-medium">Payment Method:</span>
                              <span className="text-foreground capitalize">
                                {booking.payment.payment_method === 'toyyibpay' ? 'ToyyibPay' : 'Cash'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    {/* Show "Complete Payment" button for unpaid ToyyibPay bookings */}
                    {booking.payment?.payment_method === 'toyyibpay' && 
                     booking.payment?.status === 'unpaid' && 
                     booking.status !== 'cancelled' && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                        onClick={async () => {
                          try {
                            const response = await api.post(`/bookings/${booking.id}/retry-payment`);
                            if (response.data.payment_url) {
                              showSuccessToast('Redirecting to payment gateway...');
                              window.location.href = response.data.payment_url;
                            } else {
                              showErrorToast('Payment gateway unavailable. Please try again later.');
                            }
                          } catch (error) {
                            showErrorToast('Failed to initiate payment. Please try again.');
                          }
                        }}
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        Complete Payment
                      </Button>
                    )}
                    
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    
                    {booking.payment?.status === 'paid' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const receiptUrl = `http://localhost:8000/api/bookings/${booking.id}/receipt`;
                            const token = localStorage.getItem('token');
                            
                            if (!token) {
                              showErrorToast('Please log in to view receipt');
                              return;
                            }
                            
                            // Fetch the receipt HTML with authentication
                            const response = await fetch(receiptUrl, {
                              method: 'GET',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'text/html',
                              },
                              credentials: 'include'
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to load receipt');
                            }
                            
                            const html = await response.text();
                            
                            // Create a blob URL for the HTML content
                            const blob = new Blob([html], { type: 'text/html' });
                            const blobUrl = URL.createObjectURL(blob);
                            
                            // Open receipt in a new window with a proper URL
                            const newWindow = window.open(blobUrl, '_blank');
                            
                            if (newWindow) {
                              showSuccessToast('Receipt opened! Click "Save as PDF" to download');
                              
                              // Clean up the blob URL after window is likely loaded (or let browser handle it)
                              // The blob URL will persist until browser closes or cleanup happens
                              setTimeout(() => {
                                URL.revokeObjectURL(blobUrl);
                              }, 30000); // 30 seconds should be enough for the page to load
                            } else {
                              // Fallback: Download as HTML file
                              const a = document.createElement('a');
                              a.href = blobUrl;
                              a.download = `receipt-booking-${booking.id}.html`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(blobUrl);
                              showSuccessToast('Receipt downloaded! Open it in your browser to save as PDF');
                            }
                          } catch (error) {
                            console.error('Error loading receipt:', error);
                            showErrorToast('Failed to load receipt. Please try again.');
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Are you sure?</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Do you really want to cancel this booking?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setSelectedBooking(null);
              }}
              disabled={isCancelling}
            >
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, cancel'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
