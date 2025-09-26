"use client";
import { TypographyH2, TypographyP } from "@components/ui/typography";

const dummySchedule = [
  { id: 1, date: "2024-07-10", time: "10:00", service: "Classic Facial", client: "Sarah Lim" },
  { id: 2, date: "2024-07-10", time: "14:00", service: "Swedish Massage", client: "Aminah Tan" },
  { id: 3, date: "2024-07-11", time: "09:00", service: "Full Leg Wax", client: "Nadia Wong" },
];

export default function TherapistSchedulePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <TypographyH2>My Schedule</TypographyH2>
      <TypographyP className="mb-6">Upcoming bookings:</TypographyP>
      <div className="space-y-4">
        {dummySchedule.map((b) => (
          <div key={b.id} className="border rounded p-4 bg-white dark:bg-zinc-900">
            <div className="font-semibold">{b.service}</div>
            <div className="text-sm text-zinc-500">Client: {b.client}</div>
            <div className="text-sm">{b.date} at {b.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
