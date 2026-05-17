"use client";

import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function SyncPage() {
  const { roleTheme } = useRole({ fallbackRole: "government" });

  return (
    <div className="space-y-6">
      <PageHeader
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
    </div>
  );
}
