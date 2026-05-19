import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";

export default function VisitsPage() {
  const roleTheme = ROLE_THEMES.health_worker;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Health Worker"
        title="Visits"
        subtitle="Manage health facility visits and patient follow-ups."
      />

      <WorkspacePanel
        eyebrow="Visit schedule"
        title="Clinic visits and home follow-ups"
        subtitle="Keep today’s schedule visible while you move between community and facility checks."
        summary="This view can host visit records, patient notes, and follow-up actions as the workflow grows."
        highlights={[
          "See scheduled visits first",
          "Track follow-up notes in context",
          "Keep clinic and community work aligned",
        ]}
        sidebarTitle="Workload snapshot"
        sidebarCopy="No visits are loaded yet, but this layout is ready for the day’s schedule and follow-up list."
        sidebarStats={[
          { label: "Today’s visits", value: "0" },
          { label: "Pending follow-ups", value: "0" },
          { label: "Escalations", value: "0" },
        ]}
        primaryAction={{ label: "Open mothers", href: "/mothers" }}
        secondaryAction={{ label: "Open diagnoses", href: "/diagnoses" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
    </div>
  );
}
