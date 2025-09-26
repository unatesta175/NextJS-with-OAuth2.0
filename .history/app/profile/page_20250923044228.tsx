"use client";
import { useAppSelector } from "@lib/reduxHooks";
import { TypographyH2, TypographyP } from "@components/ui/typography";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAppSelector((s) => s.auth);
  if (!user) return <div className="py-8 text-center">Not logged in.</div>;
  return (
    <div className="max-w-xl mx-auto py-12 flex flex-col items-center gap-6">
      <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground font-bold text-3xl">
        {getInitials(user.name)}
      </span>
      <TypographyH2 className="mt-2">{user.name}</TypographyH2>
      <TypographyP className="text-zinc-500">{user.email}</TypographyP>
      <TypographyP className="text-xs text-zinc-400">Role: {user.role}</TypographyP>
    </div>
  );
}
