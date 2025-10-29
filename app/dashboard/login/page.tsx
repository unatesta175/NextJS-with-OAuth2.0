"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { login } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@components/ui/input";
import { LoadingButton } from "@components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Building2, Shield, UserCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@components/ui/button";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof schema>;

export default function DashboardLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      
      // Check if user has dashboard access (admin or therapist)
      if (result.user.role === 'client') {
        throw new Error('Access denied. This login is for staff members only.');
      }
    } catch (error: unknown) {
      setError("root", { 
        type: "manual", 
        message: error instanceof Error ? error.message : "Login failed" 
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Only allow admin and therapist to access dashboard
      if (user.role === "admin" || user.role === "therapist") {
        router.push("/dashboard");
      } else if (user.role === "client") {
        // Redirect clients to main site
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff0a85] rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-4 pb-6">
            <CardTitle className="text-xl font-semibold text-center">Staff Access</CardTitle>
            
            {/* Role Badges */}
            <div className="flex justify-center gap-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <UserCheck className="w-3 h-3 mr-1" />
                Therapist
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kapasbeauty.com"
                  {...formRegister("email")}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...formRegister("password")}
                    disabled={isSubmitting}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Error Display */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{errors.root.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <LoadingButton 
                type="submit" 
                isLoading={isSubmitting} 
                className="w-full h-11 bg-[#ff0a85] hover:bg-[#ff0a85]/90"
              >
                Sign In to Dashboard
              </LoadingButton>

              {/* Footer Links */}
              <div className="text-center space-y-2 pt-4">
                <p className="text-sm text-gray-600">
                  Client login? {" "}
                  <a href="/auth/login" className="text-[#ff0a85] hover:underline font-medium">
                    Go to main site
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  For staff members only
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-amber-800 mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">Admin:</span>
                <span className="font-mono text-amber-900">admin@lunaraspa.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Therapist:</span>
                <span className="font-mono text-amber-900">alicia@lunaraspa.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Password:</span>
                <span className="font-mono text-amber-900">password123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}