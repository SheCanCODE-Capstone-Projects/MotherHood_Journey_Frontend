"use client";

import React, { useEffect } from "react";
import type { ReactNode } from "react";

import { MobileNav } from "@/shared/components/layout/MobileNav";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { TopBar } from "@/shared/components/layout/TopBar";
import { SkipLink } from "@/shared/components/layout/SkipLink";
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
  // Prevent rendering multiple shells when nested PortalShells exist.
  // A top-level PortalShell sets a marker on `window` so subsequent
  // PortalShell instances render only their children (avoiding duplicate
  // sidebars/topbars). This keeps the Sidebar persistent across route
  // navigation while allowing nested uses in previews or role layouts.
  const alreadyMounted = typeof window !== "undefined" && (window as any).__portalShellMounted;

  useEffect(() => {
    if (typeof window !== "undefined" && !((window as any).__portalShellMounted)) {
      (window as any).__portalShellMounted = true;
    }
  }, []);

  if (alreadyMounted) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FBFB] print:bg-white">
      <SkipLink />
      <Sidebar fallbackRole={fallbackRole} previewRole={previewRole} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar fallbackRole={fallbackRole} previewRole={previewRole} />

        <main id="main-content" className="flex-1 px-4 py-6 pb-24 print:px-0 print:py-0 print:pb-0 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>

        <MobileNav fallbackRole={fallbackRole} previewRole={previewRole} />
      </div>
    </div>
  );
}
