"use client";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Calendar, Heart, Sparkles } from "lucide-react";

export default function ClientDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-primary">Welcome to Kapas Beauty Spa</h2>
        <p className="leading-7 text-lg text-muted-foreground">
          Discover relaxation and rejuvenation with our premium beauty treatments
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calendar className="w-5 h-5" />
              Book a Service
            </CardTitle>
            <CardDescription>
              Schedule your next beauty treatment with our expert therapists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/booking">Book Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Heart className="w-5 h-5" />
              My Bookings
            </CardTitle>
            <CardDescription>
              View and manage your upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/client/bookings">View Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-primary">Featured Services</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Discover our most popular treatments and special offers
          </p>
          <Button asChild variant="outline">
            <Link href="/services">Explore Services</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
