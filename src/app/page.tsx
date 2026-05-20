"use client";

import { useState } from "react";

import { PageHeader, PortalShell } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { ROLE_LABELS } from "@/shared/config/rbac";
import type { UserRole } from "@/shared/types/auth";

const USER_ROLES: UserRole[] = [
  "patient",
  "health_worker",
  "facility_admin",
  "district_officer",
  "government",
];

const previewHighlights: Record<UserRole, string[]> = {
  patient: [
    "Track pregnancy progress",
    "Review upcoming appointments",
    "Check child follow-up records",
  ],
  health_worker: [
    "Manage registered mothers",
    "Record visit outcomes",
    "Review diagnosis queue",
  ],
  facility_admin: [
    "Monitor staff activity",
    "Review facility reports",
    "Track service coverage",
  ],
  district_officer: [
    "Inspect district analytics",
    "Compare facility performance",
    "Monitor key trends",
  ],
  government: [
    "Review national reports",
    "Monitor sync status",
    "Check ministry-wide summaries",
  ],
};

export default function HomePage() {
  const [previewRole, setPreviewRole] = useState<UserRole>("patient");

  return (
    <PortalShell fallbackRole="patient" previewRole={previewRole}>
      <div className="space-y-6">
        <PageHeader
          title="Shared Layout Preview"
          subtitle="This screen previews the Sidebar, TopBar, MobileNav, and PageHeader with role-aware navigation."
          action={
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-[8px] border-[#B9D8D5] bg-white px-4 text-[#24585B]"
              onClick={() => window.location.assign("/login")}
            >
              Open Login
            </Button>
          }
        />

        <section className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5B8784]">
            Preview Role
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {USER_ROLES.map((role) => {
              const isActive = previewRole === role;

              return (
                <Button
                  key={role}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className={
                    isActive
                      ? "h-10 rounded-[8px] bg-[#2C6F73] px-4 text-white hover:bg-[#245C60]"
                      : "h-10 rounded-[8px] border-[#B9D8D5] bg-white px-4 text-[#24585B]"
                  }
                  onClick={() => setPreviewRole(role)}
                >
                  {ROLE_LABELS[role]}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {previewHighlights[previewRole].map((item) => (
            <article
              key={item}
              className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-30px_rgba(22,63,66,0.75)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">
                {ROLE_LABELS[previewRole]}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-[#163F42]">
                {item}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#54797C]">
                This is simple placeholder content so you can see the layout
                components working in the interface before wiring feature pages.
              </p>
            </article>
          ))}
        </section>
      </div>
    </PortalShell>
  );
}
