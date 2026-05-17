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
      className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-6"
      style={{ borderColor: roleTheme.border }}
    >
      <div className="min-w-0 flex items-center gap-3">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-2xl font-semibold text-white shadow-sm"
          style={{ backgroundColor: roleTheme.accent }}
        >
          {displayName.slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}
          >
            {role.replaceAll("_", " ")}
          </div>
          <h1 className="truncate text-lg font-semibold text-[#1D5052] sm:text-xl">
            {displayName}
          </h1>
          <p className="truncate text-sm text-[#54797C]">
            {organizationLabel}: {organizationName}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-xl border bg-white px-4 shadow-sm"
        style={{ borderColor: roleTheme.border, color: roleTheme.text }}
        onClick={() => void handleLogout()}
      >
        <LogOut className="size-4" />
        <span>Logout</span>
      </Button>
    </header>
  );
}
