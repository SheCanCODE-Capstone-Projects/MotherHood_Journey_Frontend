"use client";

<<<<<<< HEAD
import Link from "next/link";
import { RefreshCw, Check } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
=======
import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";
>>>>>>> main

export default function SyncPage() {
  const { roleTheme } = useRole({ fallbackRole: "government" });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
<<<<<<< HEAD
        title="Data Synchronization"
        subtitle="Manage system data synchronization and network status."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">System status</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Data Sync Management</h3>
              <p className="mt-2 text-sm text-[#54797C]">Monitor and manage system data synchronization.</p>
            </div>
            <RefreshCw className="size-8 text-[#1D5551]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Button variant="default" size="sm">Sync now</Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Check className="mt-0.5 size-6 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">System synchronized</p>
              <p className="mt-1 text-sm text-emerald-800">All data has been successfully synchronized with the server.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Sync Status</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <div className="flex items-center gap-3">
              <Check className="size-5 text-emerald-600" />
              <div>
                <p className="font-medium text-[#11403F]">Last synchronization</p>
                <p className="text-xs text-[#54797C]">2 minutes ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <div className="flex items-center gap-3">
              <Check className="size-5 text-emerald-600" />
              <div>
                <p className="font-medium text-[#11403F]">Districts connected</p>
                <p className="text-xs text-[#54797C]">12 active connections</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <div className="flex items-center gap-3">
              <Check className="size-5 text-emerald-600" />
              <div>
                <p className="font-medium text-[#11403F]">Data integrity</p>
                <p className="text-xs text-[#54797C]">All checks passed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
=======
        eyebrow="Government"
        title="Sync"
        subtitle="Manage data synchronization across the national health system."
      />

      <WorkspacePanel
        eyebrow="Data sync"
        title="National synchronization and rollout health"
        subtitle="Monitor data movement across districts and facilities from one structured control surface."
        summary="Use this section to spot sync lag, keep jobs healthy, and review rollout coverage across the system."
        highlights={[
          "Watch sync health across the network",
          "Spot delayed districts and facilities quickly",
          "Keep rollout status visible for national teams",
        ]}
        sidebarTitle="Sync status"
        sidebarCopy="The synchronization pipeline is ready for dashboard data, job health, and rollout metrics."
        sidebarStats={[
          { label: "Healthy jobs", value: "0" },
          { label: "Delayed jobs", value: "0" },
          { label: "Regions covered", value: "0" },
        ]}
        primaryAction={{ label: "Open reports", href: "/reports" }}
        secondaryAction={{ label: "Open dashboard", href: "/dashboard" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
>>>>>>> main
    </div>
  );
}
