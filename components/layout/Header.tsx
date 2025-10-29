"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@components/ui/dropdown-menu";
import { Search, Menu, User, Calendar, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@lib/reduxHooks";
import { logoutUser } from "@/features/auth/authSlice";
import { getUserImageUrl } from "@lib/image-utils";

const Header = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/categories" },
    { label: "Services", href: "/services" },
    { label: "Booking", href: "/my-bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-32">
              <Image
                src="/Logo/big-logo.png"
                alt="Lunara Spa"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search services, treatments..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-primary"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Book Now Button */}
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 hidden md:flex"
            >
              <Link href="/booking">Book Now</Link>
            </Button>

            {/* Profile */}
            {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
                        <AvatarImage 
                          src={(() => {
                            const imageUrl = getUserImageUrl((user as any)?.image);
                            console.log('🔍 Header Avatar - Original path:', (user as any)?.image);
                            console.log('🔍 Header Avatar - Generated URL:', imageUrl);
                            return imageUrl;
                          })()} 
                          alt={user?.name}
                          onError={(e) => {
                            console.log('🚨 Header Avatar failed to load, falling back to placeholder');
                            (e.target as HTMLImageElement).src = "/placeholder-avatar.svg";
                          }}
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-bookings" className="cursor-pointer">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
            ) : (
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-full"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Action Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white w-full">
                      <Link href="/booking">Book Now</Link>
                    </Button>
                    {!isAuthenticated && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;