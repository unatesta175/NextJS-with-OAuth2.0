"use client";
import Link from "next/link";
import { TypographyH2, TypographyP } from "@components/ui/typography";

export default function ClientDashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <TypographyH2>Welcome to Your Dashboard</TypographyH2>
      <TypographyP className="mb-6">Book your next beauty treatment or manage your bookings below.</TypographyP>
      <div className="flex gap-4">
        <Link href="/booking" className="underline text-primary">Book a Service</Link>
        <Link href="/client/bookings" className="underline text-primary">My Bookings</Link>
      </div>
    </div>
  );
}
