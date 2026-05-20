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
  // Use a module-scoped flag so nested PortalShells rendered in the same
  // render pass do not duplicate the UI. This avoids the race where two
  // shells both render because an effect hasn't set a window marker yet.
  // The root PortalShell will listen for `portal:preview-role` events and
  // pass the active preview role down to Sidebar/TopBar/MobileNav.
  // Subsequent nested PortalShell instances will render children only.
  // Note: this is a client-only module flag (this file is a client component).
  // eslint-disable-next-line no-var
  if (typeof (globalThis as any).__portalShellMounted === "undefined") {
    (globalThis as any).__portalShellMounted = false;
  }

  const alreadyMounted = (globalThis as any).__portalShellMounted === true;

  if (!alreadyMounted) {
    (globalThis as any).__portalShellMounted = true;
  }

  if (alreadyMounted) {
    return <>{children}</>;
  }

  const [runtimePreviewRole, setRuntimePreviewRole] = useState<UserRole | undefined>(previewRole);

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
