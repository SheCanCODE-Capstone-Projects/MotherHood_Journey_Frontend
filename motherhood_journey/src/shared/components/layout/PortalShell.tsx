"use client";

import type { ReactNode } from "react";

import { MobileNav } from "@/shared/components/layout/MobileNav";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { TopBar } from "@/shared/components/layout/TopBar";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";

type PortalShellProps = {
  children: ReactNode;
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

export function PortalShell({
  children,
  fallbackRole,
  previewRole,
}: PortalShellProps) {
  const {
    role,
    roleLabel,
    navItems,
    displayName,
    organizationLabel,
    organizationName,
    logout,
  } = useRole({ fallbackRole, previewRole });

  return (
    <div className="flex min-h-screen bg-[#F8FBFB]">
      <Sidebar role={role} roleLabel={roleLabel} navItems={navItems} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar
          role={role}
          displayName={displayName}
          organizationLabel={organizationLabel}
          organizationName={organizationName}
          onLogout={logout}
        />

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>

        <MobileNav role={role} navItems={navItems} />
      </div>
    </div>
  );
}
