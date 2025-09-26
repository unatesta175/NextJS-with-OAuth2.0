"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { login } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [error, setError] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "client") router.push("/client");
      else if (user.role === "therapist") router.push("/therapist");
      else if (user.role === "admin") router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginForm) => {
    setError("");
    try {
      await dispatch(login(data)).unwrap();
      // handled by useEffect
    } catch (err: any) {
      setError(err || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded shadow space-y-6"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account? <a href="/auth/register" className="underline">Register</a>
        </div>
      </form>
    </div>
  );
}
