"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { useRole } from "@/shared/hooks/useRole";
import { BarChart3, TrendingUp, Users, Heart, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const { role } = useRole();
  const roleTheme = role === "government" ? ROLE_THEMES.government : ROLE_THEMES.facility_admin;
  const isGovernment = role === "government";

  const handleCreateReport = () => {
    window.location.assign("/reports/rpt-vaccination-001");
  };

  const handleScheduleReport = () => {
    window.location.assign("/reports/rpt-anc-002");
  };

  const reportCategories = [
    {
      id: 1,
      name: "Maternal Health Summary",
      icon: Heart,
      metrics: isGovernment ? "2,456 mothers" : "156 mothers",
      lastGenerated: "Apr 10, 2024",
      frequency: "Monthly",
    },
    {
      id: 2,
      name: "Performance Dashboard",
      icon: BarChart3,
      metrics: isGovernment ? "98% completion rate" : "94% targets met",
      lastGenerated: "Apr 12, 2024",
      frequency: "Real-time",
    },
    {
      id: 3,
      name: "Staff Productivity",
      icon: Users,
      metrics: isGovernment ? "2,341 visits" : "89 visits",
      lastGenerated: "Apr 11, 2024",
      frequency: "Weekly",
    },
    {
      id: 4,
      name: "Trend Analysis",
      icon: TrendingUp,
      metrics: isGovernment ? "+12% YoY growth" : "+5% improvement",
      lastGenerated: "Apr 10, 2024",
      frequency: "Monthly",
    },
  ];

  const recentReports = [
    { name: "Monthly Performance Report - March 2024", type: "PDF", size: "2.4 MB", date: "Apr 1, 2024", downloads: 45 },
    { name: "Vaccination Coverage Report", type: "Excel", size: "1.2 MB", date: "Apr 5, 2024", downloads: 23 },
    { name: "Staff Attendance Report - Q1 2024", type: "PDF", size: "890 KB", date: "Apr 8, 2024", downloads: 12 },
    { name: "Maternal Health Indicators", type: "Excel", size: "1.8 MB", date: "Apr 10, 2024", downloads: 34 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isGovernment ? "National Reports" : "Reports"}
        subtitle={isGovernment ? "National maternal health program reports and statistics." : "Facility performance and operational reports."}
      />

      {/* Report Categories */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="rounded-2xl border-2 p-5" style={{ borderColor: roleTheme.border }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg p-2" style={{ backgroundColor: roleTheme.accentSoft }}>
                        <Icon className="size-5" style={{ color: roleTheme.accent }} />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>{category.name}</h3>
                    </div>
                    <p className="mt-3 font-medium" style={{ color: roleTheme.text }}>{category.metrics}</p>
                    <div className="mt-3 flex gap-3 text-sm" style={{ color: roleTheme.text }}>
                      <span>📅 {category.lastGenerated}</span>
                      <span>🔄 {category.frequency}</span>
                    </div>
                  </div>
                  <button className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ backgroundColor: roleTheme.accent, color: "white" }}>
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Reports */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Recent Reports</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-4 rounded-2xl border-2 p-4 font-semibold text-sm" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>
            <div>Report Name</div>
            <div>Type</div>
            <div>Size</div>
            <div>Generated</div>
            <div className="text-center">Actions</div>
          </div>
          {recentReports.map((report, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-4 rounded-2xl border p-4 items-center text-sm" style={{ borderColor: roleTheme.border }}>
              <div className="font-medium" style={{ color: roleTheme.text }}>{report.name}</div>
              <div style={{ color: roleTheme.text }}>{report.type}</div>
              <div style={{ color: roleTheme.text }}>{report.size}</div>
              <div style={{ color: roleTheme.text }}>{report.date}</div>
              <div className="flex justify-center gap-2">
                <button className="rounded-lg p-2 hover:opacity-75" style={{ backgroundColor: roleTheme.accentSoft }}>
                  <Download className="size-4" style={{ color: roleTheme.accent }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Generate Custom Report */}
      <section className="rounded-2xl border-2 p-6" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft }}>
        <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>Generate Custom Report</h3>
        <p className="mt-2 text-sm" style={{ color: roleTheme.text }}>Create a customized report with specific metrics and date ranges for your needs.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCreateReport}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: roleTheme.accent, color: "white" }}
          >
            Create Report
          </button>
          <button
            type="button"
            onClick={handleScheduleReport}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, border: "2px solid", color: roleTheme.text }}
          >
            Schedule Report
          </button>
        </div>
      </section>
    </div>
  );
}
