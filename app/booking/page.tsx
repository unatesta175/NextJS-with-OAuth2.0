"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Calendar } from "@components/ui/calendar";
import { Form } from "@components/ui/form";
import { ArrowLeft, ArrowRight, Clock, MapPin, CreditCard } from "lucide-react";
import { cn } from "@lib/utils";

const bookingSchema = z.object({
  categoryId: z.number().min(1, "Please select a category"),
  serviceId: z.number().min(1, "Please select a service"),
  branchId: z.number().min(1, "Please select a branch"),
  therapistId: z.number().min(1, "Please select a therapist"),
  date: z.date({ message: "Please select a date" }),
  timeslot: z.string().min(1, "Please select a time slot"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Dummy data (will be replaced with API calls)
const fetchCategories = async () => [
  { id: 1, name: "Facial Treatments", description: "Rejuvenating facial therapies for glowing skin", icon: "✨" },
  { id: 2, name: "Body Treatments", description: "Relaxing full-body wellness experiences", icon: "💆" },
  { id: 3, name: "Hair & Scalp", description: "Professional hair care and scalp treatments", icon: "💇" },
];

const fetchServices = async (categoryId: number) => {
  const all: Record<number, Array<{id: number; name: string; price: number; duration: number; description: string}>> = {
    1: [
      { id: 101, name: "Deep Cleansing Facial", price: 120, duration: 60, description: "Deep pore cleansing with extraction" },
      { id: 102, name: "Anti-Aging Treatment", price: 180, duration: 90, description: "Advanced anti-aging therapy" },
      { id: 103, name: "Hydrating Facial", price: 150, duration: 75, description: "Intense hydration for dry skin" },
    ],
    2: [
      { id: 201, name: "Full Body Massage", price: 200, duration: 90, description: "Complete relaxation massage" },
      { id: 202, name: "Hot Stone Therapy", price: 250, duration: 120, description: "Therapeutic hot stone treatment" },
      { id: 203, name: "Body Scrub & Wrap", price: 180, duration: 90, description: "Exfoliating scrub with nourishing wrap" },
    ],
    3: [
      { id: 301, name: "Hair Treatment", price: 100, duration: 60, description: "Nourishing hair restoration" },
      { id: 302, name: "Scalp Massage", price: 80, duration: 45, description: "Relaxing scalp therapy" },
      { id: 303, name: "Hair Styling", price: 60, duration: 30, description: "Professional hair styling" },
    ],
  };
  return all[categoryId] || [];
};

const fetchBranches = async () => [
  { id: 1, name: "Kapas Spa KL Central", address: "123 Wellness Street, KL", distance: "2.5 km" },
  { id: 2, name: "Kapas Spa Mont Kiara", address: "456 Mont Kiara, KL", distance: "5.1 km" },
  { id: 3, name: "Kapas Spa KLCC", address: "789 KLCC, KL", distance: "3.2 km" },
];

const fetchTherapists = async (serviceId: number) => {
  const all: Record<number, Array<{id: number; name: string; rating: number; experience: string; specialties: string[]}>> = {
    101: [
      { id: 1, name: "Alicia Tan", rating: 4.9, experience: "5 years", specialties: ["Facial", "Anti-aging"] },
      { id: 2, name: "Siti Rahman", rating: 4.8, experience: "3 years", specialties: ["Facial", "Hydration"] },
    ],
    102: [
      { id: 2, name: "Siti Rahman", rating: 4.8, experience: "3 years", specialties: ["Facial", "Hydration"] },
      { id: 3, name: "Nurul Izzah", rating: 4.9, experience: "7 years", specialties: ["Anti-aging", "Luxury"] },
    ],
    201: [
      { id: 4, name: "Maya Lee", rating: 4.9, experience: "6 years", specialties: ["Swedish", "Deep tissue"] },
      { id: 5, name: "Farah Lim", rating: 4.7, experience: "4 years", specialties: ["Relaxation", "Sports"] },
    ],
  };
  return all[serviceId] || [];
};

const fetchTimeslots = async () => {
  // Mock available timeslots based on date and therapist
  const baseSlots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];
  // Randomly remove some slots to simulate booking
  return baseSlots.filter(() => Math.random() > 0.3);
};

export default function BookingPage() {
  const [step, setStep] = useState<"category" | "service" | "branch" | "date" | "therapist" | "timeslot" | "confirm">("category");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<{id: number; name: string; price: number; duration: number; description: string} | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<{id: number; name: string; address: string; distance: string} | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTherapist, setSelectedTherapist] = useState<{id: number; name: string; rating: number; experience: string; specialties: string[]} | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      categoryId: 0,
      serviceId: 0,
      branchId: 0,
      therapistId: 0,
      date: undefined,
      timeslot: "",
    },
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["services", selectedCategory],
    queryFn: () => selectedCategory ? fetchServices(selectedCategory) : [],
    enabled: !!selectedCategory,
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: therapists, isLoading: loadingTherapists } = useQuery({
    queryKey: ["therapists", selectedService?.id],
    queryFn: () => selectedService ? fetchTherapists(selectedService.id) : [],
    enabled: !!selectedService,
  });

  const { data: timeslots, isLoading: loadingTimeslots } = useQuery({
    queryKey: ["timeslots", selectedDate, selectedTherapist?.id],
    queryFn: () => selectedDate && selectedTherapist ? fetchTimeslots() : [],
    enabled: !!selectedDate && !!selectedTherapist,
  });

  const selectedCategoryObj = categories?.find((c) => c.id === selectedCategory);

  const steps = ["category", "service", "branch", "date", "therapist", "timeslot", "confirm"];
  const currentStepIndex = steps.indexOf(step);

  const onSubmit = async (data: BookingFormData) => {
    setIsProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // TODO: Implement actual booking API call
      console.log('Processing booking:', data);
      console.log('Booking details:', {
        service: selectedService,
        therapist: selectedTherapist,
        branch: selectedBranch,
        date: selectedDate,
        timeslot: selectedTimeslot,
        amount: selectedService?.price
      });
      // On success, redirect to success page or show confirmation
      alert('Booking confirmed! You will receive a confirmation email shortly.');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSubmit = () => {
    // Update form values before submission
    if (selectedService && selectedBranch && selectedTherapist && selectedDate && selectedTimeslot) {
      form.setValue("categoryId", selectedCategory || 0);
      form.setValue("serviceId", selectedService.id);
      form.setValue("branchId", selectedBranch.id);
      form.setValue("therapistId", selectedTherapist.id);
      form.setValue("date", selectedDate);
      form.setValue("timeslot", selectedTimeslot);
      
      form.handleSubmit(onSubmit)();
    }
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex] as typeof step);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex] as typeof step);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s} className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Selection */}
        {step === "category" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose a Treatment Category</CardTitle>
              <CardDescription>Select the type of service you&apos;re looking for</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCategories ? (
                <div className="text-center py-8">Loading categories...</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {categories?.map((category) => (
                    <Card
                      key={category.id}
                      className={cn(
                        "cursor-pointer hover:shadow-lg transition-all",
                        selectedCategory === category.id && "ring-2 ring-primary"
                      )}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        goToNextStep();
                      }}
                    >
                      <CardContent className="pt-6 text-center">
                        <div className="text-4xl mb-3">{category.icon}</div>
                        <h3 className="font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service Selection */}
        {step === "service" && selectedCategory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose Your Service</CardTitle>
              <CardDescription>Select from {selectedCategoryObj?.name} treatments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingServices ? (
                  <div className="text-center py-8">Loading services...</div>
                ) : (
                  services?.map((service) => (
                    <Card
                      key={service.id}
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-all",
                        selectedService?.id === service.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedService(service)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{service.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.duration} min
                              </Badge>
                              <Badge variant="outline">RM {service.price}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextStep} disabled={!selectedService}>
                  Next: Choose Branch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Branch Selection */}
        {step === "branch" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose Location</CardTitle>
              <CardDescription>Select your preferred spa branch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branches?.map((branch) => (
                  <Card
                    key={branch.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all",
                      selectedBranch?.id === branch.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{branch.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {branch.address}
                          </div>
                        </div>
                        <Badge variant="outline">{branch.distance}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextStep} disabled={!selectedBranch}>
                  Next: Choose Date
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Selection */}
        {step === "date" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Select Date</CardTitle>
              <CardDescription>Choose your preferred appointment date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                  className="rounded-md border"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextStep} disabled={!selectedDate}>
                  Next: Choose Therapist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Therapist Selection */}
        {step === "therapist" && selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose Therapist</CardTitle>
              <CardDescription>Select your preferred therapist for {selectedService?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingTherapists ? (
                  <div className="text-center py-8">Loading therapists...</div>
                ) : (
                  therapists?.map((therapist) => (
                    <Card
                      key={therapist.id}
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-all",
                        selectedTherapist?.id === therapist.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedTherapist(therapist)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {therapist.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{therapist.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>⭐ {therapist.rating}</span>
                              <span>{therapist.experience} experience</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                              {therapist.specialties.map((specialty: string) => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextStep} disabled={!selectedTherapist}>
                  Next: Choose Time
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeslot Selection */}
        {step === "timeslot" && selectedTherapist && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose Time</CardTitle>
              <CardDescription>
                Available slots for {selectedDate?.toLocaleDateString()} with {selectedTherapist.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTimeslots ? (
                <div className="text-center py-8">Loading available times...</div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeslots?.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTimeslot === slot ? "default" : "outline"}
                      onClick={() => setSelectedTimeslot(slot)}
                      className="h-12"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextStep} disabled={!selectedTimeslot}>
                  Next: Confirm
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation */}
        {step === "confirm" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Confirm Your Booking</CardTitle>
              <CardDescription>Please review your appointment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Service:</span>
                    <span>{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{selectedService?.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Therapist:</span>
                    <span>{selectedTherapist?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{selectedBranch?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date & Time:</span>
                    <span>{selectedDate?.toLocaleDateString()} at {selectedTimeslot}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>RM {selectedService?.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handlePaymentSubmit}
                    loading={isProcessingPayment}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={goToPrevStep}
                    disabled={isProcessingPayment}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </Form>
      </div>
    </div>
  );
}