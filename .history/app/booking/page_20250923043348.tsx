"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@components/ui/button";
import { TypographyH2, TypographyP } from "@components/ui/typography";

// Dummy categories (replace with API call later)
const fetchCategories = async () => [
  { id: 1, name: "Facials", description: "Rejuvenating facial treatments." },
  { id: 2, name: "Massage", description: "Relaxing massage therapies." },
  { id: 3, name: "Waxing", description: "Smooth waxing services." },
];

// Dummy services by category
const fetchServices = async (categoryId: number) => {
  const all = {
    1: [
      { id: 101, name: "Classic Facial", price: 80, duration: 60 },
      { id: 102, name: "Anti-Aging Facial", price: 120, duration: 75 },
    ],
    2: [
      { id: 201, name: "Swedish Massage", price: 100, duration: 60 },
      { id: 202, name: "Deep Tissue Massage", price: 130, duration: 75 },
    ],
    3: [
      { id: 301, name: "Full Leg Wax", price: 60, duration: 45 },
      { id: 302, name: "Bikini Wax", price: 40, duration: 30 },
    ],
  };
  return all[categoryId] || [];
};

// Dummy therapists by service
const fetchTherapists = async (serviceId: number) => {
  const all = {
    101: [
      { id: 1, name: "Alicia Tan" },
      { id: 2, name: "Siti Rahman" },
    ],
    102: [
      { id: 2, name: "Siti Rahman" },
      { id: 3, name: "Nurul Izzah" },
    ],
    201: [
      { id: 4, name: "Maya Lee" },
      { id: 5, name: "Farah Lim" },
    ],
    202: [
      { id: 4, name: "Maya Lee" },
    ],
    301: [
      { id: 6, name: "Lina Wong" },
    ],
    302: [
      { id: 6, name: "Lina Wong" },
      { id: 7, name: "Aina Tan" },
    ],
  };
  return all[serviceId] || [];
};

// Dummy timeslots by therapist
const fetchTimeslots = async (therapistId: number) => {
  const all = {
    1: ["10:00", "11:30", "14:00"],
    2: ["09:00", "13:00", "15:30"],
    3: ["12:00", "16:00"],
    4: ["10:30", "13:30", "17:00"],
    5: ["09:30", "11:00", "15:00"],
    6: ["08:00", "10:00", "14:00"],
    7: ["11:00", "13:00", "16:30"],
  };
  return all[therapistId] || [];
};

export default function BookingPage() {
  const [step, setStep] = useState<"category" | "service" | "therapist" | "timeslot" | "confirm">("category");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["services", selectedCategory],
    queryFn: () => selectedCategory ? fetchServices(selectedCategory) : [],
    enabled: !!selectedCategory,
  });

  const { data: therapists, isLoading: loadingTherapists } = useQuery({
    queryKey: ["therapists", selectedService],
    queryFn: () => selectedService ? fetchTherapists(selectedService) : [],
    enabled: !!selectedService,
  });

  const { data: timeslots, isLoading: loadingTimeslots } = useQuery({
    queryKey: ["timeslots", selectedTherapist],
    queryFn: () => selectedTherapist ? fetchTimeslots(selectedTherapist) : [],
    enabled: !!selectedTherapist,
  });

  // Get selected objects for summary
  const selectedCategoryObj = categories?.find((c) => c.id === selectedCategory);
  const selectedServiceObj = services?.find((s) => s.id === selectedService);
  const selectedTherapistObj = therapists?.find((t) => t.id === selectedTherapist);

  return (
    <div className="max-w-xl mx-auto py-8">
      <TypographyH2>Book a Service</TypographyH2>
      {step === "category" && (
        <>
          <TypographyP>Select a category to get started:</TypographyP>
          <div className="grid gap-4 mt-6">
            {loadingCategories && <div>Loading...</div>}
            {categories && categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setStep("service");
                }}
              >
                <span className="font-semibold mr-2">{cat.name}</span>
                <span className="text-xs text-zinc-500">{cat.description}</span>
              </Button>
            ))}
          </div>
        </>
      )}
      {step === "service" && selectedCategory && (
        <>
          <TypographyP>Select a service:</TypographyP>
          <div className="grid gap-4 mt-6">
            {loadingServices && <div>Loading...</div>}
            {services && services.map((svc) => (
              <Button
                key={svc.id}
                variant={selectedService === svc.id ? "default" : "outline"}
                className="justify-between"
                onClick={() => setSelectedService(svc.id)}
              >
                <span className="font-semibold">{svc.name}</span>
                <span className="text-xs text-zinc-500">${svc.price} / {svc.duration} min</span>
              </Button>
            ))}
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="outline" onClick={() => setStep("category")}>Back</Button>
            <Button
              onClick={() => setStep("therapist")}
              disabled={!selectedService}
            >
              Next: Therapist
            </Button>
          </div>
        </>
      )}
      {step === "therapist" && selectedService && (
        <>
          <TypographyP>Select a therapist:</TypographyP>
          <div className="grid gap-4 mt-6">
            {loadingTherapists && <div>Loading...</div>}
            {therapists && therapists.map((t) => (
              <Button
                key={t.id}
                variant={selectedTherapist === t.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedTherapist(t.id)}
              >
                <span className="font-semibold mr-2">{t.name}</span>
              </Button>
            ))}
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="outline" onClick={() => setStep("service")}>Back</Button>
            <Button
              onClick={() => setStep("timeslot")}
              disabled={!selectedTherapist}
            >
              Next: Timeslot
            </Button>
          </div>
        </>
      )}
      {step === "timeslot" && selectedTherapist && (
        <>
          <TypographyP>Select a timeslot:</TypographyP>
          <div className="grid gap-4 mt-6">
            {loadingTimeslots && <div>Loading...</div>}
            {timeslots && timeslots.map((slot: string) => (
              <Button
                key={slot}
                variant={selectedTimeslot === slot ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedTimeslot(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="outline" onClick={() => setStep("therapist")}>Back</Button>
            <Button
              onClick={() => setStep("confirm")}
              disabled={!selectedTimeslot}
            >
              Next: Confirm
            </Button>
          </div>
        </>
      )}
      {step === "confirm" && (
        <div className="mt-8 space-y-4">
          <TypographyH2>Confirm Your Booking</TypographyH2>
          <TypographyP>
            <strong>Category:</strong> {selectedCategoryObj?.name}
            <br />
            <strong>Service:</strong> {selectedServiceObj?.name} (${selectedServiceObj?.price}, {selectedServiceObj?.duration} min)
            <br />
            <strong>Therapist:</strong> {selectedTherapistObj?.name}
            <br />
            <strong>Timeslot:</strong> {selectedTimeslot}
          </TypographyP>
          <Button className="w-full">Confirm &amp; Pay (Stripe Placeholder)</Button>
          <Button variant="outline" className="w-full" onClick={() => setStep("timeslot")}>Back</Button>
        </div>
      )}
    </div>
  );
}
