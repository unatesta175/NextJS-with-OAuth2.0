"use client";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";

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
      <div className="font-medium">
        {isAuthenticated && user ? (
          <span>
            {user.name} <span className="text-xs text-zinc-500">({user.role})</span>
          </span>
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
