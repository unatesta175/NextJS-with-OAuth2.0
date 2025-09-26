"use client";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import Link from "next/link";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Topbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <Link href="/profile" className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {getInitials(user.name)}
            </span>
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-zinc-500">({user.role})</span>
          </Link>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
      {isAuthenticated && (
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </header>
  );
}
