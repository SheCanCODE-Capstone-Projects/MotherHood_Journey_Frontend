"use client";

import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function AnalyticsPage() {
  const { roleTheme } = useRole({ fallbackRole: "district_officer" });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="District Officer"
        title="Analytics"
        subtitle="District health metrics and performance analytics."
      />

      <WorkspacePanel
        eyebrow="Key metrics"
        title="District statistics and oversight trends"
        subtitle="Track coverage, comparison points, and district performance without jumping between screens."
        summary="This layout is ready for charts, district comparisons, and actionable indicators once the analytics data is wired in."
        highlights={[
          "Compare facilities with less friction",
          "Keep performance indicators visible",
          "Move from overview to action faster",
        ]}
        sidebarTitle="Analytics snapshot"
        sidebarCopy="District indicators will appear here when dashboard analytics are connected to live metrics."
        sidebarStats={[
          { label: "Facilities", value: "0" },
          { label: "Alerts", value: "0" },
          { label: "Indicators", value: "0" },
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
