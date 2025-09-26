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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
    } catch (error: unknown) {
      setError("root", { 
        type: "manual", 
        message: error instanceof Error ? error.message : "Login failed" 
      });
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
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <Button type="submit" loading={isSubmitting || loading} className="w-full">
          Login
        </Button>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account? <a href="/auth/register" className="underline">Register</a>
        </div>
      </form>
    </div>
  );
}
