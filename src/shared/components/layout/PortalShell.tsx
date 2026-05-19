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
    <div className="relative flex min-h-screen overflow-hidden bg-[#F4FAF8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(44,111,115,0.15),transparent_30%),radial-gradient(circle_at_top_right,rgba(111,195,180,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,250,248,0.95))]" />
      <div className="pointer-events-none absolute -left-24 top-28 size-72 rounded-full bg-[#D7F0EA]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 size-80 rounded-full bg-[#DFF1F0]/50 blur-3xl" />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar fallbackRole={fallbackRole} previewRole={previewRole} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopBar fallbackRole={fallbackRole} previewRole={previewRole} />

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>

          <MobileNav fallbackRole={fallbackRole} previewRole={previewRole} />
        </div>
      </div>
    </div>
  );
}
