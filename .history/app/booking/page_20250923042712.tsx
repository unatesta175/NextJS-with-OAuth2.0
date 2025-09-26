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

export default function BookingPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <div className="max-w-xl mx-auto py-8">
      <TypographyH2>Book a Service</TypographyH2>
      <TypographyP>Select a category to get started:</TypographyP>
      <div className="grid gap-4 mt-6">
        {isLoading && <div>Loading...</div>}
        {categories && categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selected === cat.id ? "default" : "outline"}
            className="justify-start"
            onClick={() => setSelected(cat.id)}
          >
            <span className="font-semibold mr-2">{cat.name}</span>
            <span className="text-xs text-zinc-500">{cat.description}</span>
          </Button>
        ))}
      </div>
      {selected && (
        <div className="mt-8">
          <TypographyP>Next: Show services for selected category (ID: {selected})</TypographyP>
        </div>
      )}
    </div>
  );
}
