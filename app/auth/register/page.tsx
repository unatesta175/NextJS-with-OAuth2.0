"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { registerUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 chars"),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const { confirmPassword, ...registerData } = data;
      // Transform to match backend expectations
      const submitData = {
        ...registerData,
        password_confirmation: confirmPassword,
      };
      await dispatch(registerUser(submitData)).unwrap();
      // handled by useEffect
    } catch (err: unknown) {
      // Handle different error formats
      if (typeof err === 'object' && err !== null) {
        // If it's a validation errors object, extract the messages
        if (typeof err === 'object' && !Array.isArray(err)) {
          const errorMessages = Object.entries(err as Record<string, unknown>)
            .map(([, messages]) => {
              if (Array.isArray(messages)) {
                return messages.join(', ');
              }
              return String(messages);
            })
            .join('; ');
          setError(errorMessages || "Registration failed");
        } else {
          setError(String(err) || "Registration failed");
        }
      } else {
        setError(String(err) || "Registration failed");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded shadow space-y-6"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Register
        </Button>
        <div className="text-center text-sm mt-2">
          Already have an account? <a href="/auth/login" className="underline">Login</a>
        </div>
      </form>
    </div>
  );
}
