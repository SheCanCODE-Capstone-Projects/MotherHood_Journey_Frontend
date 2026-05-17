import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";

export default function ChildrenPage() {
  const roleTheme = ROLE_THEMES.patient;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Care"
        title="Children"
        subtitle="Track child health profile and follow-up events."
      />

      <WorkspacePanel
        eyebrow="Child follow-up"
        title="Child health records and reminders"
        subtitle="Keep immunizations, growth checks, and follow-up events visible in one place."
        summary="This view is set up to show each child’s profile once registrations and follow-up events are connected."
        highlights={[
          "Monitor growth check reminders",
          "Keep immunization due dates visible",
          "Track follow-up events for each child",
        ]}
        sidebarTitle="Record status"
        sidebarCopy="Child records will appear here once registration data is available from the health system."
        sidebarStats={[
          { label: "Registered children", value: "0" },
          { label: "Due reminders", value: "0" },
          { label: "Open follow-ups", value: "0" },
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
