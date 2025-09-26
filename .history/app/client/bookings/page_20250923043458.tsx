"use client";
import { Button } from "@components/ui/button";
import { TypographyH2, TypographyP } from "@components/ui/typography";

const dummyBookings = [
  {
    id: 1,
    service: "Classic Facial",
    therapist: "Alicia Tan",
    date: "2024-07-10",
    time: "10:00",
    status: "Confirmed",
  },
  {
    id: 2,
    service: "Swedish Massage",
    therapist: "Maya Lee",
    date: "2024-07-12",
    time: "14:00",
    status: "Pending",
  },
];

export default function MyBookingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <TypographyH2>My Bookings</TypographyH2>
      <div className="space-y-6 mt-6">
        {dummyBookings.map((b) => (
          <div key={b.id} className="border rounded p-4 flex flex-col gap-2 bg-white dark:bg-zinc-900">
            <div className="font-semibold">{b.service}</div>
            <div className="text-sm text-zinc-500">Therapist: {b.therapist}</div>
            <div className="text-sm">{b.date} at {b.time}</div>
            <div className="text-xs">Status: <span className="font-medium">{b.status}</span></div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button variant="outline" size="sm">Invoice</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
