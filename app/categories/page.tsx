"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { Clock, Users, ArrowRight, Tag } from "lucide-react";
import axios from "@lib/axios";

interface ServiceCategoryTag {
  id: number;
  name: string;
  is_active: boolean;
}

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
  tags: ServiceCategoryTag[];
  services_count?: number;
}

const colorGradients = [
  "from-blue-500 to-cyan-400",
  "from-pink-500 to-rose-400", 
  "from-green-500 to-emerald-400",
  "from-purple-500 to-violet-400",
  "from-yellow-500 to-orange-400",
  "from-teal-500 to-cyan-400"
];


export default function CategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/service-categories');
        setCategories(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
       
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
            Kategori Spa Premium Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temui rangkaian lengkap rawatan spa kami yang direka untuk memupuk badan, 
            minda, dan jiwa anda. Setiap kategori menawarkan perkhidmatan khusus yang dihasilkan oleh ahli terapi pakar kami.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`http://localhost:8000/${category.image}`}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${colorGradients[index % colorGradients.length]} opacity-20 group-hover:opacity-30 transition-opacity`} />
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tags Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                    <Tag className="w-3 h-3" />
                    <span>Sesuai untuk:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.tags?.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="outline" 
                        className="text-xs bg-primary/5 border-primary/20 text-primary"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {category.tags && category.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.tags.length - 3} lagi
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{category.services_count || 0} Perkhidmatan</span>
                  </div>
                  <Button 
                    asChild
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Link href={`/services?category=${category.id}`}>
                      Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
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
            Bersedia untuk Memulakan Perjalanan Kesihatan Anda?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Tempah rawatan pilihan anda hari ini dan alami kesempurnaan dalam relaksasi dan pemulihan.
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4"
          >
            <Link href="/booking">Tempah Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}




