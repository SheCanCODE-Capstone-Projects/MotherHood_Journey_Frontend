"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";

type TopBarProps = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

export function TopBar({ fallbackRole, previewRole }: TopBarProps) {
  const router = useRouter();
  const {
    role,
    roleTheme,
    displayName,
    organizationLabel,
    organizationName,
    logout,
  } = useRole({ fallbackRole, previewRole });

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-white/95 px-4 py-4 backdrop-blur sm:px-6"
      style={{ borderColor: roleTheme.border }}
    >
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
        className="h-10 rounded-xl bg-white px-4"
        style={{ borderColor: roleTheme.border, color: roleTheme.text }}
        onClick={() => void handleLogout()}
      >
        <LogOut className="size-4" />
        <span>Logout</span>
      </Button>
    </header>
  );
}
