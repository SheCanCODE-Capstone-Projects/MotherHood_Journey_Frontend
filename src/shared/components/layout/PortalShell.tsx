"use client";

import React, { useEffect, useState } from "react";
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
  // Always render the shell at the root layout. The previous module-scoped
  // global guard caused the shell to be skipped in some dev hot-reload
  // scenarios (leaving only children rendered). Removing the guard keeps the
  // UI consistent; nested role layouts were already reverted to render
  // children-only so duplicate shells should not occur.

  const [runtimePreviewRole, setRuntimePreviewRole] = useState<UserRole | undefined>(() => {
    if (typeof window !== "undefined") {
      return (window as any).__portalPreviewRole ?? previewRole;
    }
    return previewRole;
  });

  useEffect(() => {
    const handler = (e: Event) => {
      // Expect a CustomEvent with detail set to the UserRole string
      const role = (e as CustomEvent).detail as UserRole | undefined;
      setRuntimePreviewRole(role);
    };

    window.addEventListener("portal:preview-role", handler as EventListener);
    return () => window.removeEventListener("portal:preview-role", handler as EventListener);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FBFB] print:bg-white">
      <SkipLink />
      <Sidebar fallbackRole={fallbackRole} previewRole={runtimePreviewRole ?? previewRole} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar fallbackRole={fallbackRole} previewRole={runtimePreviewRole ?? previewRole} />

        <main id="main-content" className="flex-1 px-4 py-6 pb-24 print:px-0 print:py-0 print:pb-0 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>

        <MobileNav fallbackRole={fallbackRole} previewRole={runtimePreviewRole ?? previewRole} />
      </div>
    </div>
  );
}
