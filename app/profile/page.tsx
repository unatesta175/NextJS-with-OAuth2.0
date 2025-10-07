"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { User, Mail, Phone, Camera, Save, Edit, Lock } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@lib/reduxHooks";
import { getUserImageUrl } from "@lib/image-utils";
import { updateProfile } from "@/features/auth/authSlice";
import { PasswordChangeModal } from "@components/ui/password-change-modal";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  const { formState: { isSubmitting, errors }, handleSubmit, register, setError, reset } = form;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync form data when user data becomes available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const profileData = {
        name: data.name,
        phone: data.phone,
        ...(selectedImage && { image: selectedImage })
      };
      await dispatch(updateProfile(profileData)).unwrap();
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error: unknown) {
      setError("root", { 
        type: "manual", 
        message: error instanceof Error ? error.message : "Profile update failed" 
      });
    }
  };

  const handleSave = () => {
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Show loading skeleton while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full md:col-span-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <Button asChild>
              <a href="/auth/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Profile Information</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    loading={isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage 
                      src={imagePreview || getUserImageUrl((user as any)?.image)} 
                      alt={user?.name}
                      onError={(e) => {
                        console.log('Avatar image failed to load:', (user as any)?.image);
                        (e.target as HTMLImageElement).src = "/placeholder-avatar.svg";
                      }}
                    />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                      </label>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      disabled={!isEditing || isSubmitting}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled={true} // Email usually shouldn't be editable
                      className="pl-10 bg-gray-50"
                      placeholder="your@email.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      disabled={!isEditing || isSubmitting}
                      className="pl-10"
                      placeholder="+60 12-345 6789"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800 text-sm">{errors.root.message}</p>
                </div>
              )}

              {/* Account Stats */}
              <div className="pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Account Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.8</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setShowPasswordModal(true)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Change Password</h3>
                <p className="text-sm text-gray-600">Update your account password for security</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Preferences</h3>
                <p className="text-sm text-gray-600">Manage your notification and privacy settings</p>
              </CardContent>
            </Card>
          </div>

          {/* Password Change Modal */}
          <PasswordChangeModal 
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        </div>
      </div>
    </div>
  );
}