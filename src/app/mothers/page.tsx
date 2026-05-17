"use client";

import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function MothersPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Health Worker"
        title="Mothers"
        subtitle="Manage and track pregnant mothers under your care."
      />

      <WorkspacePanel
        eyebrow="Mother registry"
        title="Pregnant mothers under your care"
        subtitle="Open maternal profiles, track follow-up status, and keep the care queue clean and visible."
        summary="The view is prepared to show each mother’s profile, care history, and urgent follow-up notes when the data source is connected."
        highlights={[
          "Review all active mothers in one place",
          "Open each maternal profile quickly",
          "Keep follow-up reminders visible for the team",
        ]}
        sidebarTitle="Program overview"
        sidebarCopy="This section will list mothers, pregnancy status, and recent follow-ups once patient records are loaded."
        sidebarStats={[
          { label: "Active mothers", value: "0" },
          { label: "Follow-ups", value: "0" },
          { label: "Risk alerts", value: "0" },
        ]}
        primaryAction={{ label: "Open visits", href: "/visits" }}
        secondaryAction={{ label: "Open diagnoses", href: "/diagnoses" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
    </div>
  );
}
