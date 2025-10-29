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

// Fallback categories in case API fails - images will be loaded from backend
const fallbackCategories = [
  { 
    id: 1, 
    name: "Relaxing", 
    image: "",
    description: "Rejuvenating spa treatments"
  },
  { 
    id: 2, 
    name: "Waxing", 
    image: "",
    description: "Professional waxing services"
  },
  { 
    id: 3, 
    name: "Massage", 
    image: "",
    description: "Therapeutic massage treatments"
  },
  { 
    id: 4, 
    name: "Hair", 
    image: "",
    description: "Hair styling and care"
  },
  { 
    id: 5, 
    name: "Manicure", 
    image: "",
    description: "Nail care and treatments"
  }
];

// Removed unused mock data: experts

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
        // Don't use fallback categories - show empty state instead
        setCategories([]);
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
                                    src={(category.image && category.image.trim()) ? getAssetUrl(category.image) : '/Logo/favicon.png'}
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
                                  src={(category.image && category.image.trim()) ? getAssetUrl(category.image) : '/Logo/favicon.png'}
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
    </div>
  );
}