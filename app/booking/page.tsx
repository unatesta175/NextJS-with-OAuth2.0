"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@lib/axios";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Calendar } from "@components/ui/calendar";
import { Form } from "@components/ui/form";
import { LoginModal } from "@components/ui/login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ArrowLeft, ArrowRight, Clock, MapPin, CreditCard, User, Star, CheckCircle, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@lib/utils";
import { showSuccessToast, showErrorToast } from "@lib/toast";
import { getUserImageUrl, getServiceImageUrl } from "@lib/image-utils";
import Image from "next/image";

// Interfaces
interface BookingData {
  service_id: number;
  therapist_id: number;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  payment_method: 'cash' | 'toyyibpay';
}

interface Therapist {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  rating?: number;
  experience?: string;
  specialties?: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Helper functions
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startHour = 8;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      
      const timeString = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      slots.push(timeString);
    }
  }
  
  return slots;
};

const formatTimeForBackend = (timeString: string): string => {
  const time = new Date(`1970-01-01 ${timeString}`);
  
  if (isNaN(time.getTime())) {
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }
    
    return timeString.includes(':') ? `${timeString}:00` : timeString;
  }
  
  return time.toTimeString().split(' ')[0];
};

const bookingSchema = z.object({
  categoryId: z.number().min(1, "Please select a category"),
  serviceId: z.number().min(1, "Please select a service"),
  therapistId: z.number().min(1, "Please select a therapist"),
  date: z.date({ message: "Please select a date" }),
  timeslot: z.string().min(1, "Please select a time slot"),
  paymentMethod: z.enum(["cash", "toyyibpay"], { message: "Please select a payment method" }),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Fetch services by category
const fetchServices = async (categoryId: number) => {
  try {
    const response = await fetch(`http://localhost:8000/api/service-categories/${categoryId}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdFromUrl = searchParams.get('service');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [step, setStep] = useState<"category" | "service" | "therapist" | "date" | "timeslot" | "payment" | "confirm">("category");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cash" | "toyyibpay" | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Data states
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  
  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [loadingTimeslots, setLoadingTimeslots] = useState(false);
  
  // Generate available time slots
  const availableTimeSlots = generateTimeSlots();
  
  // Track if toast has been shown to prevent duplicates
  const toastShownRef = useRef(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch service from URL parameter and skip to therapist step
  useEffect(() => {
    if (serviceIdFromUrl && categories.length > 0 && !selectedService) {
      const fetchServiceFromUrl = async () => {
        try {
          setLoadingServices(true);
          console.log('🔗 Fetching service from URL:', serviceIdFromUrl);
          const response = await api.get(`/services/${serviceIdFromUrl}`);
          const service = response.data.data;
          
          console.log('✅ Service fetched successfully:', service.name);
          
          // Set the service and category
          setSelectedService(service);
          if (service.category) {
            setSelectedCategory(service.category.id);
          }
          
          // Skip to therapist selection step
          setTimeout(() => {
            setStep("therapist");
            // Only show toast once
            if (!toastShownRef.current) {
              showSuccessToast(`Service "${service.name}" selected. Choose a therapist to continue.`);
              toastShownRef.current = true;
            }
          }, 100);
          
        } catch (error) {
          console.error('❌ Error fetching service from URL:', error);
          showErrorToast('Failed to load service. Starting from beginning.');
          setStep("category");
        } finally {
          setLoadingServices(false);
        }
      };
      
      fetchServiceFromUrl();
    }
  }, [serviceIdFromUrl, categories, selectedService]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      categoryId: 0,
      serviceId: 0,
      therapistId: 0,
      date: undefined,
      timeslot: "",
      paymentMethod: "cash" as const,
      notes: "",
    },
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await api.get('/service-categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showErrorToast('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Update form values when service/category are selected from URL
  useEffect(() => {
    if (selectedService && selectedCategory) {
      form.setValue("serviceId", selectedService.id);
      form.setValue("categoryId", selectedCategory);
    }
  }, [selectedService, selectedCategory, form]);

  // Fetch services when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchServicesData = async () => {
        setLoadingServices(true);
        try {
          const data = await fetchServices(selectedCategory);
          setServices(data);
        } catch (error) {
          console.error('Error fetching services:', error);
          showErrorToast('Failed to load services');
        } finally {
          setLoadingServices(false);
        }
      };
      
      fetchServicesData();
    } else {
      setServices([]);
    }
  }, [selectedCategory]);

  // Fetch therapists when service changes
  useEffect(() => {
    if (selectedService) {
      const fetchTherapists = async () => {
        setLoadingTherapists(true);
        try {
          const response = await api.get(`/services/${selectedService.id}/therapists`);
          setTherapists(response.data.data);
        } catch (error) {
          console.error('Error fetching therapists:', error);
          showErrorToast('Failed to load therapists');
        } finally {
          setLoadingTherapists(false);
        }
      };
      
      fetchTherapists();
    } else {
      setTherapists([]);
    }
  }, [selectedService]);

  // Fetch available time slots when therapist and date change
  useEffect(() => {
    console.log('=== AVAILABILITY EFFECT TRIGGERED ===');
    console.log('selectedTherapist:', selectedTherapist?.id);
    console.log('selectedDate:', selectedDate);
    console.log('selectedDate type:', typeof selectedDate);
    console.log('selectedDate toString:', selectedDate?.toString());
    
    if (!selectedTherapist || !selectedDate) {
      console.log('Missing therapist or date, clearing slots');
      setAvailableSlots([]);
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    console.log('Date validation:');
    console.log('- today:', today.toISOString().split('T')[0]);
    console.log('- selectedDateOnly:', selectedDateOnly.toISOString().split('T')[0]);
    console.log('- is past?:', selectedDateOnly < today);
    
    if (selectedDateOnly < today) {
      console.log('🚫 PREVENTING API call for past date:', selectedDate);
      console.log('🧹 Clearing invalid date and timeslot');
      // Clear the invalid date
      setSelectedDate(undefined);
      setSelectedTimeslot(null);
      setAvailableSlots([]);
      return;
    }
    
    const fetchAvailability = async () => {
      setLoadingTimeslots(true);
      try {
        // Fix timezone issue: use local date format instead of ISO
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // +1 because getMonth() is 0-based
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        console.log('🔧 TIMEZONE FIX:');
        console.log('- selectedDate object:', selectedDate);
        console.log('- getFullYear():', selectedDate.getFullYear());
        console.log('- getMonth() (0-based):', selectedDate.getMonth());
        console.log('- getDate():', selectedDate.getDate());
        console.log('- OLD toISOString():', selectedDate.toISOString().split('T')[0]);
        console.log('- NEW local format:', dateStr);
        
        console.log('✅ MAKING API CALL - Fetching availability for therapist:', selectedTherapist.id, 'date:', dateStr);
        const response = await api.get(`/therapists/${selectedTherapist.id}/availability`, {
          params: { date: dateStr }
        });
        const data = response.data.data;
        console.log('✅ API SUCCESS - Received availability data:', data);
        setAvailableSlots(data);
      } catch (error: any) {
        console.error('❌ API ERROR - Error fetching availability:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        showErrorToast('Failed to load available time slots');
        setAvailableSlots([]);
      } finally {
        setLoadingTimeslots(false);
      }
    };
    
    fetchAvailability();
  }, [selectedTherapist, selectedDate]);

  const selectedCategoryObj = categories?.find((c) => c.id === selectedCategory);
  
  // Clear invalid dates on component mount or when date becomes invalid
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateOnly = new Date(selectedDate);
      selectedDateOnly.setHours(0, 0, 0, 0);
      
      if (selectedDateOnly < today) {
        console.log('Clearing invalid date:', selectedDate);
        setSelectedDate(undefined);
        setSelectedTimeslot(null);
      }
    }
  }, [selectedDate]);

  // Clear invalid dates on component mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate) {
      const selectedDateOnly = new Date(selectedDate);
      selectedDateOnly.setHours(0, 0, 0, 0);
      
      if (selectedDateOnly < today) {
        console.log('Clearing past date on mount:', selectedDate);
        setSelectedDate(undefined);
        setSelectedTimeslot(null);
      }
    }
  }, []); // Run once on mount

  const steps = ["category", "service", "therapist", "date", "timeslot", "payment", "confirm"];
  const currentStepIndex = steps.indexOf(step);

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!selectedService || !selectedTherapist || !selectedDate || !selectedTimeslot || !selectedPaymentMethod) {
      showErrorToast('Please complete all booking details');
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Fix timezone issue for booking submission
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const appointmentDate = `${year}-${month}-${day}`;
      
      console.log('🔧 BOOKING TIMEZONE FIX:');
      console.log('- selectedDate:', selectedDate);
      console.log('- OLD toISOString():', selectedDate.toISOString().split('T')[0]);
      console.log('- NEW local format:', appointmentDate);

      const bookingData: BookingData = {
        service_id: selectedService.id,
        therapist_id: selectedTherapist.id,
        appointment_date: appointmentDate,
        appointment_time: formatTimeForBackend(selectedTimeslot),
        payment_method: selectedPaymentMethod,
        notes: notes || undefined,
      };

      console.log('Submitting booking data:', bookingData);
      const apiResponse = await api.post('/bookings', bookingData);
      const response = apiResponse.data;
      
      console.log('Booking response:', response);
      console.log('Payment method:', selectedPaymentMethod);
      console.log('Payment URL:', response.payment_url);
      
      // Check if ToyyibPay payment URL is provided
      console.log('Checking redirect conditions:', {
        hasPaymentUrl: !!response.payment_url,
        paymentMethod: selectedPaymentMethod,
        isToyyibpay: selectedPaymentMethod === 'toyyibpay',
        shouldRedirect: response.payment_url && selectedPaymentMethod === 'toyyibpay'
      });
      
      if (response.payment_url && selectedPaymentMethod === 'toyyibpay') {
        showSuccessToast('Booking created! Redirecting to payment...');
        console.log('Redirecting to:', response.payment_url);
        // Redirect to ToyyibPay payment page
        window.location.href = response.payment_url;
        return;
      }
      
      showSuccessToast('Booking created successfully!');
      router.push('/my-bookings');
    } catch (error: any) {
      console.error('Booking creation failed:', error);
      showErrorToast(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSubmit = async () => {
    await onSubmit(form.getValues());
  };

  const nextStep = () => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setStep(steps[nextIndex] as any);
  };

  const prevStep = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setStep(steps[prevIndex] as any);
  };

  const resetBooking = () => {
    setStep("category");
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedTherapist(null);
    setSelectedDate(undefined);
    setSelectedTimeslot(null);
    setSelectedPaymentMethod(null);
    setNotes("");
    form.reset();
  };

  const resetDateSelection = () => {
    console.log('Manually clearing state and resetting date selection');
    setSelectedDate(undefined);
    setSelectedTimeslot(null);
    setAvailableSlots([]);
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#ff0a85' }}></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose your perfect spa experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepName, index) => (
              <div
                key={stepName}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                    index <= currentStepIndex
                      ? "text-white"
                      : "bg-gray-300 text-gray-600"
                  )}
                  style={index <= currentStepIndex ? { backgroundColor: '#ff0a85' } : {}}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium capitalize",
                    index <= currentStepIndex
                      ? ""
                      : "text-gray-500"
                  )}
                  style={index <= currentStepIndex ? { color: '#ff0a85' } : {}}
                >
                  {stepName}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4",
                      index < currentStepIndex
                        ? ""
                        : "bg-gray-300"
                    )}
                    style={index < currentStepIndex ? { backgroundColor: '#ff0a85' } : {}}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Category Selection */}
            {step === "category" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Select Category</CardTitle>
                  <CardDescription>Choose the type of service you're looking for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-lg",
                          selectedCategory === category.id
                            ? "ring-2 ring-pink-400 bg-pink-50 dark:bg-pink-950"
                            : "hover:shadow-md"
                        )}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          form.setValue("categoryId", category.id);
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #ff0a85, #ff69b4)' }}>
                              {category.image ? (
                                <Image
                                  src={getServiceImageUrl(category.image)}
                                  alt={category.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to letter if image fails to load
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-2xl text-white">
                                  {category.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={resetBooking}>
                      Reset
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!selectedCategory}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Service Selection */}
            {step === "service" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Select Service</CardTitle>
                  <CardDescription>
                    Choose from our {selectedCategoryObj?.name} services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingServices ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#ff0a85' }}></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading services...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <Card
                          key={service.id}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-lg",
                            selectedService?.id === service.id
                              ? "ring-2 ring-pink-400 bg-pink-50 dark:bg-pink-950"
                              : "hover:shadow-md"
                          )}
                          onClick={() => {
                            setSelectedService(service);
                            form.setValue("serviceId", service.id);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {service.name}
                              </h3>
                              <Badge variant="secondary">
                                RM{service.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {service.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration} minutes
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!selectedService}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Therapist Selection */}
            {step === "therapist" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Select Therapist</CardTitle>
                  <CardDescription>Choose your preferred therapist</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTherapists ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#ff0a85' }}></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading therapists...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {therapists.map((therapist) => (
                        <Card
                          key={therapist.id}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-lg",
                            selectedTherapist?.id === therapist.id
                              ? "ring-2 ring-pink-400 bg-pink-50 dark:bg-pink-950"
                              : "hover:shadow-md"
                          )}
                          onClick={() => {
                            setSelectedTherapist(therapist);
                            form.setValue("therapistId", therapist.id);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="text-center">
                              <Avatar className="w-16 h-16 mx-auto mb-4">
                                <AvatarImage 
                                  src={getUserImageUrl(therapist.image)} 
                                  alt={therapist.name}
                                  onError={(e) => {
                                    console.log('Therapist avatar image failed to load:', therapist.image);
                                    (e.target as HTMLImageElement).src = "/placeholder-avatar.svg";
                                  }}
                                />
                                <AvatarFallback className="bg-primary text-white text-xl">
                                  <User className="w-8 h-8" />
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {therapist.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {therapist.email}
                              </p>
                             
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!selectedTherapist}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Date Selection */}
            {step === "date" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Select Date</CardTitle>
                  <CardDescription>Choose your preferred appointment date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
                    <p className="text-sm dark:text-pink-300" style={{ color: '#ff0a85' }}>
                      📅 Select a date for your appointment. Past dates and Sundays are not available.
                    </p>
                    <button 
                      type="button"
                      onClick={resetDateSelection}
                      className="mt-2 text-xs underline"
                      style={{ color: '#ff0a85' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d10870'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ff0a85'}
                    >
                      Reset Date Selection
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        console.log('📅 CALENDAR onSelect triggered with date:', date);
                        console.log('📅 Raw date object:', date);
                        console.log('📅 Date toString():', date?.toString());
                        console.log('📅 Date toLocaleDateString():', date?.toLocaleDateString());
                        console.log('📅 Date toISOString():', date?.toISOString());
                        console.log('📅 Date getFullYear():', date?.getFullYear());
                        console.log('📅 Date getMonth():', date?.getMonth()); // 0-based!
                        console.log('📅 Date getDate():', date?.getDate());
                        
                        if (date) {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const selectedDateOnly = new Date(date);
                          selectedDateOnly.setHours(0, 0, 0, 0);
                          
                          console.log('📅 Calendar date validation:');
                          console.log('- selected date ISO:', selectedDateOnly.toISOString().split('T')[0]);
                          console.log('- today ISO:', today.toISOString().split('T')[0]);
                          console.log('- is future/today?:', selectedDateOnly >= today);
                          console.log('- is not Sunday?:', date.getDay() !== 0);
                          
                          // Only allow future dates (including today)
                          if (selectedDateOnly >= today && date.getDay() !== 0) {
                            console.log('✅ Setting valid date:', date);
                            setSelectedDate(date);
                            // Clear selected timeslot when date changes
                            setSelectedTimeslot(null);
                            console.log('Date changed to:', date.toISOString().split('T')[0]);
                          } else {
                            console.log('❌ Rejecting invalid date:', date);
                          }
                        } else {
                          console.log('📅 Calendar onSelect: date is null/undefined');
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const selectedDateOnly = new Date(date);
                        selectedDateOnly.setHours(0, 0, 0, 0);
                        return selectedDateOnly < today || date.getDay() === 0; // Disable past dates and Sundays
                      }}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!selectedDate}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Time Slot Selection */}
            {step === "timeslot" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Select Time</CardTitle>
                  <CardDescription>
                    Choose your preferred time slot for {selectedDate?.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTimeslots ? (
                    <div className="text-center py-8">Loading available times...</div>
                  ) : (
                    <div className="space-y-4">
                      {(() => {
                        // Check if selected date is today
                        const today = new Date();
                        const isToday = selectedDate && 
                          selectedDate.getDate() === today.getDate() &&
                          selectedDate.getMonth() === today.getMonth() &&
                          selectedDate.getFullYear() === today.getFullYear();

                        // Filter available slots and also filter out past times if it's today
                        let availableSlotsList = availableTimeSlots.filter((slot) => {
                          return !availableSlots || availableSlots.some(s => s.time === slot && s.available);
                        });

                        // If the selected date is today, filter out past timeslots
                        if (isToday) {
                          const currentTime = new Date();
                          availableSlotsList = availableSlotsList.filter((slot) => {
                            // Parse the slot time (e.g., "02:00 PM")
                            const match = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
                            if (!match) return true; // Keep if we can't parse
                            
                            let hours = parseInt(match[1]);
                            const minutes = parseInt(match[2]);
                            const period = match[3].toUpperCase();
                            
                            // Convert to 24-hour format
                            if (period === 'PM' && hours !== 12) {
                              hours += 12;
                            } else if (period === 'AM' && hours === 12) {
                              hours = 0;
                            }
                            
                            // Create a date object for the slot time
                            const slotTime = new Date();
                            slotTime.setHours(hours, minutes, 0, 0);
                            
                            // Only show slots that are at least 30 minutes in the future
                            const minFutureTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
                            return slotTime > minFutureTime;
                          });
                        }
                        
                        if (availableSlotsList.length === 0) {
                          return (
                            <div className="text-center py-8">
                              <p className="text-gray-500">
                                {isToday 
                                  ? "No available time slots for today. All slots have passed or are too soon." 
                                  : "No available time slots for this date."}
                              </p>
                              <p className="text-sm text-gray-400 mt-2">Please select a different date.</p>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {availableSlotsList.map((slot) => {
                              return (
                                <Button
                                  key={slot}
                                  type="button"
                                  variant={selectedTimeslot === slot ? "default" : "outline"}
                                  onClick={() => setSelectedTimeslot(slot)}
                                  className="h-12"
                                >
                                  {slot}
                                </Button>
                              );
                            })}
                          </div>
                        );
                      })()}
                      {selectedService && (
                        <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
                          <p className="text-sm dark:text-pink-300" style={{ color: '#ff0a85' }}>
                            <Clock className="w-4 h-4 inline mr-1" />
                            Service duration: {selectedService.duration + 30} minutes (includes 30 min preparation time)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!selectedTimeslot}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Payment Method */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-lg",
                        selectedPaymentMethod === "cash"
                          ? "ring-2 ring-pink-400 bg-pink-50 dark:bg-pink-950"
                          : "hover:shadow-md"
                      )}
                      onClick={() => {
                        setSelectedPaymentMethod("cash");
                        form.setValue("paymentMethod", "cash");
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Pay at Spa
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay with cash when you arrive
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-lg",
                        selectedPaymentMethod === "toyyibpay"
                          ? "ring-2 ring-pink-400 bg-pink-50 dark:bg-pink-950"
                          : "hover:shadow-md"
                      )}
                      onClick={() => {
                        setSelectedPaymentMethod("toyyibpay");
                        form.setValue("paymentMethod", "toyyibpay");
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 dark:text-pink-400" style={{ color: '#ff0a85' }} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              ToyyibPay
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay online with card or FPX
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or notes..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
                      style={{ 
                        outlineColor: '#ff0a85'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#ff0a85';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 10, 133, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.boxShadow = '';
                      }}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!selectedPaymentMethod}
                    >
                      Review Booking <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 7: Confirmation */}
            {step === "confirm" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Confirm Booking</CardTitle>
                  <CardDescription>Review your appointment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Booking Summary
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedCategoryObj?.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Service:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedService?.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Therapist:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedTherapist?.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDate?.toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedTimeslot}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Payment:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedPaymentMethod === "cash" ? "Pay at Spa" : "ToyyibPay"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Notes:</span>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">{notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-pink-50 dark:bg-pink-950 rounded-lg p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold dark:text-pink-400" style={{ color: '#ff0a85' }}>
                          RM{selectedService?.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Duration: {selectedService?.duration} minutes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePaymentSubmit}
                      disabled={isProcessingPayment}
                      className="text-white"
                      style={{ backgroundColor: '#ff0a85' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d10870'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff0a85'}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>

        {/* Login Modal */}
        <LoginModal 
          open={showLoginModal} 
          onOpenChange={setShowLoginModal}
          onLoginSuccess={() => {
            // Re-check authentication after successful login
            checkAuth();
          }}
        />
      </div>
    </div>
  );
}