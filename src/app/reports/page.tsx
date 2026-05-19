"use client";

import { PageHeader, WorkspacePanel } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function ReportsPage() {
  const { role, roleTheme } = useRole();

  const isGovernment = role === "government";
  const title = isGovernment ? "National Reports" : "Reports";
  const subtitle = isGovernment ? "Facility performance and operational reports." : "National maternal health program reports and statistics.";

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={isGovernment ? "Government" : "Facility Admin"} title={title} subtitle={subtitle} />

      <WorkspacePanel
        eyebrow={isGovernment ? "National reporting" : "Facility reporting"}
        title={isGovernment ? "Program reports and national summaries" : "Operational reports and facility summaries"}
        subtitle={isGovernment ? "Keep national program data visible and ready for executive review." : "Open the reports that matter most to day-to-day facility operations."}
        summary={isGovernment ? "The report area is designed for national indicators, program summaries, and ministry-level review." : "The report area is designed for facility summaries, operational metrics, and review actions."}
        highlights={isGovernment ? ["Review national indicators", "Monitor reporting health", "Keep ministry summaries visible"] : ["Review facility performance", "Track operational metrics", "Keep summary views close at hand"]}
        sidebarTitle={isGovernment ? "National view" : "Facility view"}
        sidebarCopy={isGovernment ? "Reports can be expanded with national indicators and cross-region comparisons." : "Reports can be expanded with staffing, coverage, and service delivery views."}
        sidebarStats={isGovernment ? [
          { label: "Programs", value: "0" },
          { label: "Regions", value: "0" },
          { label: "Reports", value: "0" },
        ] : [
          { label: "Active reports", value: "0" },
          { label: "Open issues", value: "0" },
          { label: "Completed", value: "0" },
        ]}
        primaryAction={{ label: isGovernment ? "Open sync" : "Open staff", href: isGovernment ? "/sync" : "/staff" }}
        secondaryAction={{ label: "Open dashboard", href: "/dashboard" }}
        accent={roleTheme.accent}
        border={roleTheme.border}
        text={roleTheme.text}
      />
    </div>
  );
}
