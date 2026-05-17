import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";

export default function AppointmentsPage() {
  const roleTheme = ROLE_THEMES.patient;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Care"
        title="Appointments"
        subtitle="Manage upcoming visits and review past appointments."
      />

      <WorkspacePanel
        eyebrow="Upcoming visits"
        title="Visit bookings and follow-up reminders"
        subtitle="Keep scheduled care visible, along with the next step after each appointment."
        summary="This panel is ready for booking data, visit notes, and reschedule actions when the backend is connected."
        highlights={[
          "See the next appointment at a glance",
          "Keep follow-up reminders in the same view",
          "Surface reschedule or transport notes when needed",
        ]}
        sidebarTitle="Current status"
        sidebarCopy="No appointments are synced yet, so this view stays clear until bookings are connected."
        sidebarStats={[
          { label: "Open slots", value: "0" },
          { label: "Upcoming visits", value: "0" },
          { label: "Follow-ups", value: "0" },
        ]}
        primaryAction={{ label: "Open dashboard", href: "/dashboard" }}
        secondaryAction={{ label: "View pregnancies", href: "/pregnancies" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
    </div>
  );
}
