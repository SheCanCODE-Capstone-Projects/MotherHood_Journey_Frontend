"use client";

import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

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

declare global {
  interface Window {
    __portalPreviewRole?: UserRole;
  }
}

export function PortalShell({
  children,
  fallbackRole,
  previewRole,
}: PortalShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";

  // Always render the shell at the root layout. The previous module-scoped
  // global guard caused the shell to be skipped in some dev hot-reload
  // scenarios (leaving only children rendered). Removing the guard keeps the
  // UI consistent; nested role layouts were already reverted to render
  // children-only so duplicate shells should not occur.

  const [runtimePreviewRole, setRuntimePreviewRole] = useState<UserRole | undefined>(() => {
    if (typeof window !== "undefined") {
<<<<<<< HEAD
      return (window as any).__portalPreviewRole ?? previewRole;
=======
      return window.__portalPreviewRole ?? previewRole;
>>>>>>> main
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

<<<<<<< HEAD
  return (
    isLoginRoute ? (
      <div className="min-h-screen bg-[#F8FBFB] print:bg-white">
        {children}
      </div>
    ) : (
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
=======
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F8F7] text-[#163F42] print:bg-white">
      <SkipLink />
      <Sidebar fallbackRole={fallbackRole} previewRole={runtimePreviewRole ?? previewRole} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopBar fallbackRole={fallbackRole} previewRole={runtimePreviewRole ?? previewRole} />

        <main id="main-content" className="flex-1 px-4 py-5 pb-24 print:px-0 print:py-0 print:pb-0 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>

          <MobileNav fallbackRole={fallbackRole} previewRole={runtimePreviewRole ?? previewRole} />
        </div>
      </div>
>>>>>>> main
    )
  );
}
