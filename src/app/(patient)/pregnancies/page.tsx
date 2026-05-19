import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";

export default function PregnanciesPage() {
  const roleTheme = ROLE_THEMES.patient;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Care"
        title="Pregnancies"
        subtitle="View active and historical pregnancy records."
      />

      <WorkspacePanel
        eyebrow="Pregnancy timeline"
        title="Milestones, clinical notes, and planned check-ins"
        subtitle="A quieter, visual workspace for week-by-week pregnancy tracking and upcoming review points."
        summary="Use this section to surface maternal milestones, warning signs, and any care updates that need attention."
        highlights={[
          "Track the current pregnancy stage",
          "Keep historical records visible for review",
          "Flag any notes that need follow-up",
        ]}
        sidebarTitle="Timeline status"
        sidebarCopy="No pregnancy records are connected yet, but the layout is ready for clinical data."
        sidebarStats={[
          { label: "Active records", value: "0" },
          { label: "Historical records", value: "0" },
          { label: "Alerts", value: "0" },
        ]}
        primaryAction={{ label: "Open dashboard", href: "/dashboard" }}
        secondaryAction={{ label: "View appointments", href: "/appointments" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
    </div>
  );
}
