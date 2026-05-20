"use client";

import type { ReactNode } from "react";

import { MobileNav } from "@/shared/components/layout/MobileNav";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { TopBar } from "@/shared/components/layout/TopBar";
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
  return (
    <div className="flex min-h-screen bg-[#F4F8F7] text-[#163F42] print:bg-white">
      <Sidebar fallbackRole={fallbackRole} previewRole={previewRole} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar fallbackRole={fallbackRole} previewRole={previewRole} />

        <main className="flex-1 px-4 py-5 pb-24 print:px-0 print:py-0 print:pb-0 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>

        <MobileNav fallbackRole={fallbackRole} previewRole={previewRole} />
      </div>
    </div>
  );
}
