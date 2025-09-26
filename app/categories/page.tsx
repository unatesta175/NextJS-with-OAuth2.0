"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { Clock, Users, ArrowRight } from "lucide-react";

// Mock categories data
const categories = [
  {
    id: 1,
    name: "Relaxing Treatments", 
    description: "Unwind and rejuvenate with our signature relaxation therapies",
    image: "/relaxing-spa.svg",
    services: [
      { name: "Swedish Massage", duration: "60 min", price: "RM 180" },
      { name: "Hot Stone Therapy", duration: "90 min", price: "RM 250" },
      { name: "Aromatherapy", duration: "75 min", price: "RM 200" }
    ],
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    name: "Waxing Services",
    description: "Professional hair removal with gentle, effective techniques",
    image: "/waxing-treatment-large.svg",
    services: [
      { name: "Full Body Wax", duration: "90 min", price: "RM 300" },
      { name: "Brazilian Wax", duration: "45 min", price: "RM 120" },
      { name: "Leg Wax", duration: "30 min", price: "RM 80" }
    ],
    color: "from-pink-500 to-rose-400"
  },
  {
    id: 3,
    name: "Massage Therapy",
    description: "Therapeutic massage treatments for muscle relief and relaxation",
    image: "/massage-therapy-large.svg",
    services: [
      { name: "Deep Tissue Massage", duration: "60 min", price: "RM 200" },
      { name: "Sports Massage", duration: "75 min", price: "RM 220" },
      { name: "Prenatal Massage", duration: "60 min", price: "RM 190" }
    ],
    color: "from-green-500 to-emerald-400"
  },
  {
    id: 4,
    name: "Hair Treatments",
    description: "Revitalize your hair with our nourishing treatments and styling",
    image: "/hair-treatment-large.svg",
    services: [
      { name: "Hair Spa Treatment", duration: "90 min", price: "RM 150" },
      { name: "Keratin Treatment", duration: "120 min", price: "RM 350" },
      { name: "Scalp Massage", duration: "45 min", price: "RM 80" }
    ],
    color: "from-purple-500 to-violet-400"
  },
  {
    id: 5,
    name: "Manicure & Pedicure",
    description: "Complete nail care with premium products and expert techniques",
    image: "/nail-treatment-large.svg", 
    services: [
      { name: "Classic Manicure", duration: "45 min", price: "RM 60" },
      { name: "Gel Pedicure", duration: "60 min", price: "RM 80" },
      { name: "Nail Art", duration: "30 min", price: "RM 40" }
    ],
    color: "from-yellow-500 to-orange-400"
  },
  {
    id: 6,
    name: "Facial Treatments",
    description: "Advanced skincare treatments for glowing, healthy skin",
    image: "/facial-treatment-large.svg",
    services: [
      { name: "Hydrating Facial", duration: "75 min", price: "RM 150" },
      { name: "Anti-Aging Treatment", duration: "90 min", price: "RM 220" },
      { name: "Acne Treatment", duration: "60 min", price: "RM 130" }
    ],
    color: "from-teal-500 to-cyan-400"
  }
];

export default function CategoriesPage() {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Premium Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of spa treatments designed to nurture your body, 
            mind, and soul. Each category offers specialized services crafted by our expert therapists.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Services Preview */}
                  <div className="space-y-2">
                    {category.services.slice(0, 3).map((service, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{service.name}</span>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration}</span>
                          <Badge variant="secondary" className="text-xs">
                            {service.price}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{category.services.length} Services</span>
                    </div>
                    <Button 
                      asChild
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Link href={`/categories/${category.id}`}>
                        View All <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your preferred treatment today and experience the ultimate in relaxation and rejuvenation.
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4"
          >
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}




