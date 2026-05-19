"use client";

import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function DiagnosesPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Health Worker"
        title="Diagnoses"
        subtitle="Review and manage maternal health diagnoses and conditions."
      />

      <WorkspacePanel
        eyebrow="Case review"
        title="Maternal conditions and diagnosis follow-up"
        subtitle="Keep the clinical queue visible while you work through assessments and escalation steps."
        summary="The panel is ready for diagnosis records, care plans, and status changes once clinical data is connected."
        highlights={[
          "Review cases waiting for assessment",
          "Keep diagnosis notes in the same workflow",
          "Surface urgent conditions clearly",
        ]}
        sidebarTitle="Clinical queue"
        sidebarCopy="Diagnosed cases will appear here as the queue is connected to your data source."
        sidebarStats={[
          { label: "Open cases", value: "0" },
          { label: "Urgent cases", value: "0" },
          { label: "Resolved", value: "0" },
        ]}
        primaryAction={{ label: "Open visits", href: "/visits" }}
        secondaryAction={{ label: "Open mothers", href: "/mothers" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
    </div>
  );
}
