"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import { Skeleton } from "@components/ui/skeleton";
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Star,
  CheckCircle,
  Users,
  Award,
  Heart
} from "lucide-react";
import api from "@lib/axios";
import { getAssetUrl } from "@lib/config";

// Category interface
interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
  tags?: Array<{
    id: number;
    name: string;
    is_active: boolean;
  }>;
  services_count?: number;
}

// Mock data for the spa
const heroImages = [
  "/img/slider/9.png",
  "/img/slider/10.png", 
  "/img/slider/11.png"
];

const heroContent = [
  {
    title: "Relax & Rejuvenate",
    subtitle: "Experience Ultimate Wellness",
    description: "Indulge in our premium spa treatments designed to restore your inner balance and natural beauty."
  },
  {
    title: "Professional Care",
    subtitle: "Expert Therapists at Your Service", 
    description: "Our certified professionals provide personalized treatments using the finest products and techniques."
  },
  {
    title: "Luxury Experience",
    subtitle: "Escape to Tranquility",
    description: "Step into our serene environment and let us pamper you with our exclusive spa packages."
  }
];

// Fallback categories in case API fails
const fallbackCategories = [
  { 
    id: 1, 
    name: "Relaxing", 
    image: "/spa-stones.svg",
    description: "Rejuvenating spa treatments"
  },
  { 
    id: 2, 
    name: "Waxing", 
    image: "/waxing-treatment.svg",
    description: "Professional waxing services"
  },
  { 
    id: 3, 
    name: "Massage", 
    image: "/massage-therapy.svg",
    description: "Therapeutic massage treatments"
  },
  { 
    id: 4, 
    name: "Hair", 
    image: "/hair-styling.svg",
    description: "Hair styling and care"
  },
  { 
    id: 5, 
    name: "Manicure", 
    image: "/nail-treatment.svg",
    description: "Nail care and treatments"
  }
];

const experts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Senior Aesthetician",
    rating: 4.9,
    image: "/expert-1.svg"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    specialty: "Massage Therapist",
    rating: 4.8,
    image: "/expert-2.svg"
  },
  {
    id: 3,
    name: "Lisa Chen",
    specialty: "Hair Specialist",
    rating: 4.9,
    image: "/expert-3.svg"
  }
];

const products = [
  {
    id: 1,
    name: "Hydrating Face Serum",
    image: "/product-1.svg",
    price: "RM 89"
  },
  {
    id: 2,
    name: "Anti-Aging Cream",
    image: "/product-2.svg",
    price: "RM 129"
  },
  {
    id: 3,
    name: "Essential Oil Set",
    image: "/product-3.svg",
    price: "RM 159"
  },
  {
    id: 4,
    name: "Cleansing Kit",
    image: "/product-4.svg",
    price: "RM 79"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Emily Davis",
    rating: 5,
    text: "Amazing experience! The staff was so professional and the facial treatment left my skin glowing.",
    image: "/customer-1.svg"
  },
  {
    id: 2,
    name: "Michael Brown",
    rating: 5,
    text: "The massage was incredibly relaxing. I felt completely refreshed afterwards.",
    image: "/customer-2.svg"
  },
  {
    id: 3,
    name: "Jessica Wilson",
    rating: 5,
    text: "Best spa in town! The ambiance and service quality are exceptional.",
    image: "/customer-3.svg"
  }
];

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment through our website, mobile app, or by calling our customer service team."
  },
  {
    question: "What should I bring to my appointment?",
    answer: "Just bring yourself! We provide all necessary towels, robes, and amenities for your comfort."
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes, you can cancel or reschedule up to 24 hours before your appointment without any charges."
  },
  {
    question: "Do you offer packages or memberships?",
    answer: "Yes, we offer various spa packages and membership programs with exclusive discounts and benefits."
  }
];

export default function HomePage() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        
        // Fetch categories using the configured api instance
        const response = await api.get('/service-categories');
        
        const data = response.data.data;
        setCategories(data);
        // Set initial position for infinite scroll (start after the duplicate set)
        if (data.length > 5) {
          setCurrentCategoryIndex(1);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategoriesError('Failed to load categories');
        // Use fallback categories if API fails
        setCategories(fallbackCategories as Category[]);
        if (fallbackCategories.length > 5) {
          setCurrentCategoryIndex(1);
        }
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate categories carousel (infinite)
  useEffect(() => {
    if (categories.length > 5) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prev) => prev + 1);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [categories.length]);

  // Reset position for infinite scroll when needed
  useEffect(() => {
    if (categories.length > 5) {
      const totalSlides = Math.ceil((categories.length + 10) / 5); // +10 for extra slides
      const actualCategorySlides = Math.ceil(categories.length / 5);
      
      if (currentCategoryIndex >= actualCategorySlides + 1) {
        // Reset to the beginning (after the first duplicate set)
        const timer = setTimeout(() => {
          setCurrentCategoryIndex(1);
        }, 500);
        return () => clearTimeout(timer);
      } else if (currentCategoryIndex < 0) {
        // Reset to the end (before the last duplicate set)
        const timer = setTimeout(() => {
          setCurrentCategoryIndex(actualCategorySlides);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentCategoryIndex, categories.length]);

  const nextImage = () => {
    setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentHeroImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const nextCategories = () => {
    setCurrentCategoryIndex((prev) => prev + 1);
  };

  const prevCategories = () => {
    setCurrentCategoryIndex((prev) => prev - 1);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Skeleton */}
        <div className="container mx-auto px-4 py-8 rounded-5">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center px-4">
        {/* Image Slider Container */}
        <div className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden shadow-2xl">
          {/* Background Image Slider */}
          <div className="flex transition-transform duration-2000 ease-in-out h-full" style={{ transform: `translateX(-${currentHeroImage * 100}%)` }}>
            {heroImages.map((image, index) => (
              <div key={index} className="relative min-w-full h-full">
                <Image
                  src={image}
                  alt={`Spa Treatment ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center px-8 lg:px-16">
            <div className="max-w-2xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white drop-shadow-lg">
                    {heroContent[currentHeroImage].subtitle}
                  </h3>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                    {heroContent[currentHeroImage].title}
                  </h1>
                </div>
                <p className="text-lg text-white leading-relaxed drop-shadow-md max-w-xl">
                  {heroContent[currentHeroImage].description}
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/95 hover:text-primary/90 px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 z-30"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 z-30"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentHeroImage ? 'bg-white scale-110' : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quickly Book Your Appointment Now
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your preferred date, service, and therapist to book your appointment instantly
            </p>
          </div>

          <Card className="max-w-4xl mx-auto p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <Select>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Service</label>
                <Select>
                  <SelectTrigger>
                    <Heart className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facial">Facial Treatment</SelectItem>
                    <SelectItem value="massage">Full Body Massage</SelectItem>
                    <SelectItem value="manicure">Manicure & Pedicure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Therapist</label>
                <Select>
                  <SelectTrigger>
                    <User className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Therapist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="maria">Maria Rodriguez</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time</label>
                <Select>
                  <SelectTrigger>
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9am">9:00 AM</SelectItem>
                    <SelectItem value="10am">10:00 AM</SelectItem>
                    <SelectItem value="2pm">2:00 PM</SelectItem>
                    <SelectItem value="3pm">3:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-12"
                asChild
              >
                <Link href="/booking">Book Now</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Premium Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Premium Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our range of premium spa services designed to rejuvenate your mind, body, and soul
            </p>
          </div>

          {/* Categories Carousel Container */}
          <div className="relative">
            {categoriesLoading ? (
              // Loading skeleton for categories
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                {[...Array(5)].map((_, index) => (
                  <Card key={index} className="group">
                    <CardContent className="p-6 text-center">
                      <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-full" />
                      <Skeleton className="h-4 w-24 mx-auto mb-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <>
                {/* Categories Carousel */}
                <div className="overflow-hidden mb-8">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentCategoryIndex * 100}%)` }}
                  >
                    {/* Create slides for infinite scrolling */}
                    {categories.length > 5 ? (
                      // Infinite scroll: create extra slides for seamless loop
                      [
                        // Last 5 categories (for seamless backward scroll)
                        ...categories.slice(-5),
                        // All categories
                        ...categories,
                        // First 5 categories (for seamless forward scroll)
                        ...categories.slice(0, 5)
                      ].reduce((slides, category, index) => {
                        const slideIndex = Math.floor(index / 5);
                        if (!slides[slideIndex]) {
                          slides[slideIndex] = [];
                        }
                        slides[slideIndex].push(category);
                        return slides;
                      }, [] as Category[][]).map((slideCategories, slideIndex) => (
                        <div key={slideIndex} className="min-w-full grid grid-cols-2 md:grid-cols-5 gap-6">
                          {slideCategories.map((category, categoryIndex) => (
                            <Card key={`${slideIndex}-${category.id}-${categoryIndex}`} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                              <CardContent className="p-6 text-center">
                                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                                  <Image
                                    src={(category.image && category.image.trim()) ? getAssetUrl(category.image) : '/spa-stones.svg'}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                                {category.services_count !== undefined && (
                                  <p className="text-xs text-gray-500">
                                    {category.services_count} service{category.services_count !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                          {/* Fill remaining slots if needed */}
                          {slideCategories.length < 5 && Array.from({ length: 5 - slideCategories.length }).map((_, emptyIndex) => (
                            <div key={`empty-${slideIndex}-${emptyIndex}`} className="invisible">
                              <Card>
                                <CardContent className="p-6 text-center">
                                  <div className="w-20 h-20 mx-auto mb-4"></div>
                                  <div className="h-4 mb-2"></div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      // Single slide for 5 or fewer categories
                      <div className="min-w-full grid grid-cols-2 md:grid-cols-5 gap-6">
                        {categories.map((category) => (
                          <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-6 text-center">
                              <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                                <Image
                                  src={(category.image && category.image.trim()) ? getAssetUrl(category.image) : '/spa-stones.svg'}
                                  alt={category.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                              {category.services_count !== undefined && (
                                <p className="text-xs text-gray-500">
                                  {category.services_count} service{category.services_count !== 1 ? 's' : ''}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        {/* Fill remaining slots */}
                        {categories.length < 5 && Array.from({ length: 5 - categories.length }).map((_, emptyIndex) => (
                          <div key={`empty-${emptyIndex}`} className="invisible">
                            <Card>
                              <CardContent className="p-6 text-center">
                                <div className="w-20 h-20 mx-auto mb-4"></div>
                                <div className="h-4 mb-2"></div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Carousel Navigation */}
                {categories.length > 5 && (
                  <>
                    {/* Navigation Arrows */}
                    <button
                      onClick={prevCategories}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition-all duration-300 z-10"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextCategories}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition-all duration-300 z-10"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center space-x-2 mb-8">
                      {categories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentCategoryIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === (currentCategoryIndex % categories.length) ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              // Error state or no categories
              <div className="text-center py-8 mb-8">
                <p className="text-gray-500">
                  {categoriesError || 'No categories available at the moment.'}
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/categories">View All</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Why Choose Kapas
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expert Professionals</h3>
                    <p className="text-gray-600">Our certified therapists bring years of experience and expertise to every treatment.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                    <p className="text-gray-600">We use only the finest products and state-of-the-art equipment for all our services.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalized Care</h3>
                    <p className="text-gray-600">Every treatment is customized to meet your unique needs and preferences.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/spa-team.svg"
                  alt="Happy Spa Team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Experts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Experts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of skilled professionals is dedicated to providing you with exceptional spa experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {experts.map((expert) => (
              <Card key={expert.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{expert.name}</h3>
                  <p className="text-gray-600 mb-3">{expert.specialty}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{expert.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/experts">View All</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Seller Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Seller Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take home our premium spa products to extend your wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/shop">View All</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Quick Go Through About Kapas
          </h2>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src="/spa-facility.svg"
                alt="Spa Facility"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="bg-primary hover:bg-primary/90 p-6 rounded-full transition-all">
                  <Play className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services and policies
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              1000+ Happy Customer From Kapas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read what our satisfied customers have to say about their spa experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">Verified Customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}