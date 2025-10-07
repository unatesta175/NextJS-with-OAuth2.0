"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Clock, Star, Search, Filter, ArrowLeft } from "lucide-react";
import axios from "@lib/axios";

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  extradescription: string[] | string;
  price: string;
  duration: number;
  type: 'normal' | 'promo';
  image: string;
  is_active: boolean;
  category: ServiceCategory;
}

// Mock services data (fallback)
const allServices = [
  {
    id: 1,
    name: "Hydrating Facial Treatment",
    category: "Facial",
    duration: 75,
    price: 150,
    rating: 4.9,
    reviews: 234,
    description: "Deep hydration treatment that replenishes moisture and restores skin's natural glow",
    image: "/facial-treatment.svg",
    popular: true,
    benefits: ["Deep Hydration", "Anti-Aging", "Skin Brightening"]
  },
  {
    id: 2,
    name: "Swedish Full Body Massage",
    category: "Massage",
    duration: 90,
    price: 200,
    rating: 4.8,
    reviews: 189,
    description: "Relaxing massage using long strokes to improve circulation and reduce muscle tension",
    image: "/swedish-massage.svg",
    popular: true,
    benefits: ["Muscle Relaxation", "Stress Relief", "Improved Circulation"]
  },
  {
    id: 3,
    name: "Brazilian Wax",
    category: "Waxing",
    duration: 45,
    price: 120,
    rating: 4.7,
    reviews: 156,
    description: "Professional hair removal service with premium wax for sensitive areas",
    image: "/waxing-service.svg",
    popular: false,
    benefits: ["Long-lasting", "Professional Grade", "Gentle Formula"]
  },
  {
    id: 4,
    name: "Keratin Hair Treatment",
    category: "Hair",
    duration: 120,
    price: 350,
    rating: 4.9,
    reviews: 98,
    description: "Transform your hair with this smoothing treatment that reduces frizz and adds shine",
    image: "/hair-treatment.svg",
    popular: false,
    benefits: ["Frizz Control", "Added Shine", "Smoother Hair"]
  },
  {
    id: 5,
    name: "Gel Manicure & Pedicure",
    category: "Nails",
    duration: 90,
    price: 140,
    rating: 4.6,
    reviews: 267,
    description: "Complete nail care with long-lasting gel polish and nail art options",
    image: "/nail-treatment.svg",
    popular: true,
    benefits: ["Long-lasting", "Chip Resistant", "Beautiful Finish"]
  },
  {
    id: 6,
    name: "Hot Stone Therapy",
    category: "Massage",
    duration: 90,
    price: 250,
    rating: 4.8,
    reviews: 134,
    description: "Therapeutic massage using heated stones to penetrate deep into muscles",
    image: "/hot-stone-massage.svg",
    popular: false,
    benefits: ["Deep Muscle Relief", "Improved Circulation", "Stress Reduction"]
  },
  {
    id: 7,
    name: "Anti-Aging Facial",
    category: "Facial",
    duration: 90,
    price: 220,
    rating: 4.9,
    reviews: 178,
    description: "Advanced anti-aging treatment using cutting-edge technology and premium serums",
    image: "/anti-aging-facial.svg",
    popular: true,
    benefits: ["Reduces Fine Lines", "Firms Skin", "Boosts Collagen"]
  },
  {
    id: 8,
    name: "Aromatherapy Massage",
    category: "Massage",
    duration: 75,
    price: 190,
    rating: 4.7,
    reviews: 145,
    description: "Relaxing massage with essential oils to balance mind, body, and spirit",
    image: "/aromatherapy.svg",
    popular: false,
    benefits: ["Stress Relief", "Mental Clarity", "Emotional Balance"]
  }
];

// Categories will be fetched from API

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "All");
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [servicesResponse, categoriesResponse] = await Promise.all([
          axios.get('/services'),
          axios.get('/service-categories')
        ]);
        
        setServices(servicesResponse.data.data || servicesResponse.data);
        setCategories(categoriesResponse.data.data || categoriesResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load services');
        // Use mock data as fallback
        setServices(allServices as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Get current category name for display
  const currentCategory = categories.find(cat => cat.id.toString() === selectedCategory);
  
  // Filter and sort services
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || 
                             service.category?.id.toString() === selectedCategory ||
                             service.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "duration":
          return a.duration - b.duration;
        case "popular":
        case "rating":
        default:
          return a.name.localeCompare(b.name); // Sort by name as default
      }
    });

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
          <div className="flex items-center justify-center gap-4 mb-4">
            {currentCategory && (
              <Link href="/categories" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <h1 className="text-4xl font-bold text-gray-900">
              {currentCategory ? `Perkhidmatan ${currentCategory.name}` : 'Perkhidmatan Kami'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {currentCategory 
              ? currentCategory.description
              : 'Temui rangkaian lengkap rawatan spa premium kami yang direka untuk memulihkan tenaga, bersantai, dan memulihkan kecantikan semula jadi anda.'
            }
          </p>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Cari perkhidmatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Nama A-Z</SelectItem>
                  <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                  <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                  <SelectItem value="duration">Tempoh Masa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredServices.length} services
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:8000/${service.image}`}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {service.type === 'promo' && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      Promosi
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-white text-gray-700">
                    {service.category?.name || service.category}
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{service.name}</CardTitle>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">RM {service.price}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{service.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Extra Description */}
                  {service.extradescription && (() => {
                    try {
                      const extraDesc = Array.isArray(service.extradescription) 
                        ? service.extradescription 
                        : JSON.parse(service.extradescription);
                      
                      if (extraDesc && extraDesc.length > 0) {
                        return (
                          <div>
                            <h4 className="font-medium text-sm text-gray-800 mb-2">Termasuk:</h4>
                            <div className="flex flex-wrap gap-1">
                              {extraDesc.slice(0, 3).map((item, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                              {extraDesc.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{extraDesc.length - 3} lagi
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      console.warn('Error parsing extradescription:', e);
                    }
                    return null;
                  })()}

                  {/* Action Button */}
                  <Button 
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Link href={`/booking?service=${service.id}&category=${service.category?.id || ''}`}>
                      Tempah Sekarang
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tiada perkhidmatan dijumpai</h3>
              <p className="text-gray-600 mb-6">
                Cuba laraskan istilah carian atau penapis anda untuk mencari apa yang anda cari.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}>
                Kosongkan Penapis
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our expert team can help you choose the perfect treatment for your needs. 
            Contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
            >
              <Link href="/booking">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}




