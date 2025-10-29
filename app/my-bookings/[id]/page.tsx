"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@lib/reduxHooks";
import { selectAuth } from "app/features/auth/authSlice";
import api from "@lib/axios";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { 
  Clock, 
  User, 
  Calendar as CalendarIcon, 
  CreditCard, 
  Download,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  DollarSign,
  FileText
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

// Helper function to format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date not set';
  
  try {
    const dateOnly = dateString.split('T')[0].split(' ')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return dateString;
    }
    
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString;
  }
};

// Helper function to format time
const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return 'Time not set';
  
  try {
    let timeOnly = timeString;
    
    if (timeString.includes('T')) {
      const timePart = timeString.split('T')[1];
      timeOnly = timePart.split('.')[0];
    }
    
    const [hours, minutes] = timeOnly.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString;
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes} ${period}`;
  } catch (error) {
    return timeString;
  }
};

// Helper function to format datetime
const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not available';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateString;
  }
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector(selectAuth);
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch booking details
  const fetchBookingDetails = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data.data);
    } catch (err: any) {
      console.error('❌ Error fetching booking details:', err);
      setError(err);
      if (err.response?.status === 404) {
        showErrorToast('Booking not found');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [isAuthenticated, bookingId]);

  // Handle retry payment
  const handleRetryPayment = async () => {
    if (!booking) return;
    
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
  };

  // Handle download receipt
  const handleDownloadReceipt = async () => {
    if (!booking) return;
    
    try {
      const receiptUrl = `http://localhost:8000/api/bookings/${booking.id}/receipt`;
      const token = localStorage.getItem('token');
      
      if (!token) {
        showErrorToast('Please log in to view receipt');
        return;
      }
      
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
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      
      const newWindow = window.open(blobUrl, '_blank');
      
      if (newWindow) {
        showSuccessToast('Receipt opened! Click "Save as PDF" to download');
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 30000);
      } else {
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
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">Please log in to view booking details</p>
              <Button onClick={() => router.push('/auth/login')}>
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
            <p>Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Booking</h2>
              <p className="text-muted-foreground mb-4">
                {error?.message || 'Booking not found'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push('/my-bookings')} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Bookings
                </Button>
                <Button onClick={fetchBookingDetails}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/my-bookings')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Bookings
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
              <p className="text-muted-foreground">Booking #{booking.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-3xl font-bold" style={{ color: '#ff0a85' }}>
                RM {booking.total_amount}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Service Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* Service Image */}
                <div className="flex-shrink-0">
                  {booking.service.image ? (
                    <Image
                      src={booking.service.image.startsWith('http') 
                        ? booking.service.image 
                        : `http://localhost:8000/${booking.service.image}`}
                      alt={booking.service.name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 flex items-center justify-center">
                      <span className="text-5xl text-pink-600 dark:text-pink-400">
                        {booking.service.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Service Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{booking.service.name}</h3>
                  <Badge variant="outline" className="mb-4">
                    {booking.service.category.name}
                  </Badge>
                  <p className="text-muted-foreground mb-4">{booking.service.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Price</p>
                      <p className="text-lg font-semibold">RM {booking.service.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-lg font-semibold">{booking.service.duration} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Appointment Date</p>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-pink-600" />
                        <p className="text-lg font-medium">{formatDate(booking.appointment_date)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Appointment Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-600" />
                        <p className="text-lg font-medium">{formatTime(booking.appointment_time)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Therapist</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-pink-600" />
                        <p className="text-lg font-medium">{booking.therapist.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Booking Status</p>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "capitalize font-medium text-base px-3 py-1",
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

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Booked On</p>
                      <p className="text-base">{formatDateTime(booking.created_at)}</p>
                    </div>

                    {booking.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notes</p>
                        <p className="text-base">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          {booking.payment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "capitalize font-medium text-base px-3 py-1",
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

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="text-lg font-medium capitalize">
                        {booking.payment.payment_method === 'toyyibpay' ? 'ToyyibPay' : 'Cash'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount</p>
                      <p className="text-lg font-semibold">RM {booking.payment.amount}</p>
                    </div>

                    {booking.payment.paid_at && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Paid On</p>
                        <p className="text-base">{formatDateTime(booking.payment.paid_at)}</p>
                      </div>
                    )}

                    {booking.payment.toyyibpay_transaction_id && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                        <p className="text-base font-mono bg-muted px-3 py-2 rounded">
                          {booking.payment.toyyibpay_transaction_id}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Payment Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Service Amount:</span>
                      <span className="font-medium">RM {booking.service.price}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Payment:</span>
                      <span className="text-2xl font-bold" style={{ color: '#ff0a85' }}>
                        RM {booking.payment.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {/* Complete Payment Button */}
                {booking.payment?.payment_method === 'toyyibpay' && 
                 booking.payment?.status === 'unpaid' && 
                 booking.status !== 'cancelled' && (
                  <Button
                    variant="default"
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={handleRetryPayment}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Payment
                  </Button>
                )}

                {/* Download Receipt Button */}
                {booking.payment?.status === 'paid' && (
                  <Button
                    variant="outline"
                    onClick={handleDownloadReceipt}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                )}

                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => router.push('/my-bookings')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

