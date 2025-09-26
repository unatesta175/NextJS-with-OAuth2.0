"use client";
import Link from "next/link";
import { TypographyH2, TypographyP } from "@components/ui/typography";

export default function TherapistDashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <TypographyH2>Welcome, Therapist</TypographyH2>
      <TypographyP className="mb-6">Manage your schedule, bookings, and reviews below.</TypographyP>
      <div className="flex gap-4">
        <Link href="/therapist/schedule" className="underline text-primary">My Schedule</Link>
        <Link href="/therapist/bookings" className="underline text-primary">Manage Bookings</Link>
        <Link href="/therapist/reviews" className="underline text-primary">Reviews</Link>
      </div>
    </div>
  );
}
