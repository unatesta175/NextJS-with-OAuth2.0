"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { login } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import GoogleLoginButton from "@components/ui/google-login-button";
import Link from "next/link";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("incorrect email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAppSelector((s) => s.auth);

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
      await dispatch(login(data)).unwrap();
    } catch{
      
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "client") router.push("/");
      else if (user.role === "therapist") router.push("/dashboard");
      else if (user.role === "admin") router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative h-16 w-40">
            <Image
              src="/Logo/big-logo.png"
              alt="Lunara Spa"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to your account to continue</p>
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...formRegister("email")}
            disabled={isSubmitting || loading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...formRegister("password")}
            disabled={isSubmitting || loading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        {/* {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>} */}
        <div className="text-right text-sm mb-4">
          <a href="/auth/forgot-password" className="text-primary hover:text-primary/80 underline font-medium">
            Forgot your password?
          </a>
        </div>
        
        <Button type="submit" loading={isSubmitting || loading} className="w-full bg-primary hover:bg-primary/90 text-white">
          Sign In
        </Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <GoogleLoginButton className="mb-4" />
        
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account? <a href="/auth/register" className="text-primary hover:text-primary/80 underline font-medium">Create Account</a>
        </div>
        
        <div className="text-center text-sm mt-3 pt-4 border-t border-gray-200">
          <p className="text-gray-600 mb-2">Staff member?</p>
          <a 
            href="/dashboard/login" 
            className="text-primary hover:text-primary/80 underline font-medium inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Login to Dashboard
          </a>
        </div>
      </form>
    </div>
  );
}
