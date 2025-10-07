'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppSelector, useAppDispatch } from '@lib/reduxHooks'
import { updateProfile } from '@/features/auth/authSlice'
import { getUserImageUrl } from '@lib/image-utils'

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
// DashboardLayout is now handled by layout.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Badge } from '@components/ui/badge'
import { Separator } from '@components/ui/separator'
import { User, Mail, Phone, MapPin, Calendar, Settings, Camera, Lock } from 'lucide-react'
import { PasswordChangeModal } from '@components/ui/password-change-modal'

export default function ProfilePage() {
  const { user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: '+60123456789',
      address: 'Kuala Lumpur, Malaysia',
      bio: 'Dedicated spa professional with 5+ years of experience in beauty and wellness treatments.'
    }
  })

  const { formState: { isSubmitting } } = form

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

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const profileData = {
        name: data.name,
        phone: data.phone,
        ...(selectedImage && { image: selectedImage })
      };
      
      console.log('Submitting dashboard profile update:', {
        name: data.name,
        phone: data.phone,
        hasImage: !!selectedImage,
        imageSize: selectedImage?.size,
        imageName: selectedImage?.name
      });
      
      await dispatch(updateProfile(profileData)).unwrap();
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Profile update failed:', error);
      form.setError("root", { 
        type: "manual", 
        message: "Profile update failed" 
      });
    }
  }

  const handleSave = () => {
    form.handleSubmit(onSubmit)();
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedImage(null)
    setImagePreview(null)
    // Reset form data
    form.reset({
      name: user?.name || '',
      phone: '+60123456789',
      address: 'Kuala Lumpur, Malaysia',
      bio: 'Dedicated spa professional with 5+ years of experience in beauty and wellness treatments.'
    })
  }

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'default'}
            className={!isEditing ? 'bg-[#ff0a85] hover:bg-[#ff0a85]/90' : ''}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={imagePreview || getUserImageUrl((user as any)?.image)} 
                        alt={user?.name}
                        onError={(e) => {
                          console.log('Dashboard avatar image failed to load:', (user as any)?.image);
                          (e.target as HTMLImageElement).src = "/placeholder-avatar.svg";
                        }}
                      />
                      <AvatarFallback className="text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="dashboard-image-upload"
                        />
                        <label
                          htmlFor="dashboard-image-upload"
                          className="absolute -bottom-2 -right-2 bg-[#ff0a85] text-white p-2 rounded-full hover:bg-[#ff0a85]/90 transition-colors cursor-pointer shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                        </label>
                      </>
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{user?.name || 'User Name'}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {user?.role === 'therapist' ? 'Staff' : user?.role || 'Staff'}
                    </Badge>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  <Separator />

                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Joined January 2024</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Kuala Lumpur, Malaysia</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        {...form.register("name")}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        {...form.register("phone")}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        {...form.register("address")}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    {...form.register("bio")}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a bit about yourself..."
                  />
                  {form.formState.errors.bio && (
                    <p className="text-red-500 text-sm">{form.formState.errors.bio.message}</p>
                  )}
                </div>

                {form.formState.errors.root && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 text-sm">{form.formState.errors.root.message}</p>
                  </div>
                )}

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} loading={isSubmitting} className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">Last updated 3 months ago</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Password Change Modal */}
        <PasswordChangeModal 
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
  )
}


