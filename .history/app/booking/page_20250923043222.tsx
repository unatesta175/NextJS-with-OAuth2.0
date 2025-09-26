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

export default function BookingPage() {
  const [step, setStep] = useState<"category" | "service" | "therapist" | "timeslot">("category");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);

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
      {step === "timeslot" && (
        <div className="mt-8">
          <TypographyP>Next: Show timeslot selection for therapist ID: {selectedTherapist}</TypographyP>
          <Button variant="outline" className="mt-4" onClick={() => setStep("therapist")}>Back</Button>
        </div>
      )}
    </div>
  );
}
