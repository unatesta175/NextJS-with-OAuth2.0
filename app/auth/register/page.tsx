"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { registerUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters long"),
  email: z.string().email("Incorrect email format"),
  password: z.string().min(8, "At least 8 charachters"),
  confirmPassword: z.string().min(8, "At least 8 charachters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/client");
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const submitData = {
        ...registerData,
        password_confirmation: confirmPassword,
      };
      await dispatch(registerUser(submitData)).unwrap();
    } catch {
      // Error is handled in authSlice and shown in toast
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 py-12">
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
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Join Lunara Spa for exclusive wellness experiences</p>
        <div>
          <Input
            type="text"
            placeholder="Name"
            {...formRegister("name")}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...formRegister("email")}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...formRegister("confirmPassword")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white">
          Create Account
        </Button>
        <div className="text-center text-sm mt-4">
          Already have an account? <a href="/auth/login" className="text-primary hover:text-primary/80 underline font-medium">Sign In</a>
        </div>
      </form>
    </div>
  );
}