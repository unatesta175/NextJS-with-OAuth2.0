"use client";
import Link from "next/link";
import { useAppSelector } from "@lib/reduxHooks";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";

const nav = {
  client: [
    { href: "/client", label: "Dashboard" },
    { href: "/booking", label: "Book Service" },
    { href: "/client/bookings", label: "My Bookings" },
    { href: "/client/reviews", label: "My Reviews" },
  ],
  therapist: [
    { href: "/therapist", label: "Dashboard" },
    { href: "/therapist/schedule", label: "My Schedule" },
    { href: "/therapist/bookings", label: "Manage Bookings" },
    { href: "/therapist/reviews", label: "Reviews" },
  ],
  admin: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/therapists", label: "Therapists" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/reports", label: "Reports" },
  ],
};

export default function Sidebar() {
  const { user } = useAppSelector((s) => s.auth);
  const pathname = usePathname();
  const role = user?.role || "client";
  const links = nav[role];

  return (
    <aside className="w-56 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 min-h-screen">
      <div className="text-xl font-bold mb-8">Kapas Spa</div>
      <nav className="flex flex-col gap-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition",
              pathname === item.href && "bg-zinc-100 dark:bg-zinc-800 font-semibold"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
