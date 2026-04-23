"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import type { UserRole } from "@/shared/types/auth";

type TopBarProps = {
  role: UserRole;
  displayName: string;
  organizationLabel: string;
  organizationName: string;
  onLogout: () => void;
};

export function TopBar({
  role,
  displayName,
  organizationLabel,
  organizationName,
  onLogout,
}: TopBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#D6E7E5] bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">
          {role.replaceAll("_", " ")}
        </p>
        <h1 className="truncate text-lg font-semibold text-[#1D5052]">
          {displayName}
        </h1>
        <p className="truncate text-sm text-[#54797C]">
          {organizationLabel}: {organizationName}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-xl border-[#B9D8D5] bg-white px-4 text-[#24585B]"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
        <span>Logout</span>
      </Button>
    </header>
  );
}
