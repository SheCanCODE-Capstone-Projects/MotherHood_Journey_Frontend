"use client";

import { BarChart3, Calendar, Download, FileText, Heart, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";

type ReportCategory = {
  id: number;
  name: string;
  icon: LucideIcon;
  metrics: string;
  lastGenerated: string;
  frequency: string;
};

const recentReports = [
  { name: "Monthly Performance Report - March 2024", type: "PDF", size: "2.4 MB", date: "Apr 1, 2024", downloads: 45 },
  { name: "Vaccination Coverage Report", type: "Excel", size: "1.2 MB", date: "Apr 5, 2024", downloads: 23 },
  { name: "Staff Attendance Report - Q1 2024", type: "PDF", size: "890 KB", date: "Apr 8, 2024", downloads: 12 },
  { name: "Maternal Health Indicators", type: "Excel", size: "1.8 MB", date: "Apr 10, 2024", downloads: 34 },
];

export default function ReportsPage() {
  const router = useRouter();
  const { role, roleTheme } = useRole();
  const isGovernment = role === "government";

  const reportCategories: ReportCategory[] = [
    { id: 1, name: "Maternal Health Summary", icon: Heart, metrics: isGovernment ? "2,456 mothers" : "156 mothers", lastGenerated: "Apr 10, 2024", frequency: "Monthly" },
    { id: 2, name: "Performance Dashboard", icon: BarChart3, metrics: isGovernment ? "98% completion rate" : "94% targets met", lastGenerated: "Apr 12, 2024", frequency: "Real-time" },
    { id: 3, name: "Staff Productivity", icon: Users, metrics: isGovernment ? "2,341 visits" : "89 visits", lastGenerated: "Apr 11, 2024", frequency: "Weekly" },
    { id: 4, name: "Trend Analysis", icon: TrendingUp, metrics: isGovernment ? "+12% YoY growth" : "+5% improvement", lastGenerated: "Apr 10, 2024", frequency: "Monthly" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={isGovernment ? "Government analytics" : "Facility analytics"}
        title={isGovernment ? "National Reports" : "Reports"}
        subtitle={isGovernment ? "National maternal health reports and HMIS-ready summaries." : "Facility performance and operational reports."}
        action={
          <Button className="h-10 rounded-[8px] bg-[#064F56] px-4 text-white" onClick={() => router.push("/reports/new")}>
            <FileText className="size-4" />
            Create report
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        {reportCategories.map((category) => {
          const Icon = category.icon;

          return (
            <article key={category.id} className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-[8px] bg-[#EAF4F2] text-[#0B5554]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#153F42]">{category.name}</h3>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-[#153F42]">{category.metrics}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#6D8587]">
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {category.lastGenerated}</span>
                    <span>{category.frequency}</span>
                  </div>
                </div>
                <Button variant="outline" className="h-9 rounded-[8px] border-[#D5E7E4] text-[#153F42]">
                  View
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_18rem]">
        <div className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">Generated reports</p>
            <h2 className="mt-1 text-lg font-semibold text-[#153F42]">Recent Reports</h2>
          </div>
          <div className="overflow-hidden rounded-[8px] border border-[#E4EFED]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F7FBFA] text-xs uppercase tracking-[0.14em] text-[#5B8784]">
                <tr>
                  <th className="px-4 py-3">Report Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Generated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9F2F1]">
                {recentReports.map((report) => (
                  <tr key={report.name} className="hover:bg-[#F7FBFA]">
                    <td className="px-4 py-4 font-medium text-[#153F42]">{report.name}</td>
                    <td className="px-4 py-4 text-[#54797C]">{report.type}</td>
                    <td className="px-4 py-4 text-[#54797C]">{report.size}</td>
                    <td className="px-4 py-4 text-[#54797C]">{report.date}</td>
                    <td className="px-4 py-4 text-right">
                      <button className="inline-grid size-8 place-items-center rounded-[8px] bg-[#EAF4F2] text-[#0B5554]" title={`Download ${report.name}`}>
                        <Download className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[8px] bg-[#064F56] p-5 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">Coverage snapshot</p>
            <p className="mt-4 text-4xl font-semibold">92.4%</p>
            <p className="mt-2 text-sm leading-6 text-white/70">National program coverage for the selected reporting period.</p>
          </div>
          <div className="rounded-[8px] border border-[#D5E7E4] p-5 shadow-sm" style={{ backgroundColor: roleTheme.accentSoft }}>
            <h3 className="text-sm font-semibold" style={{ color: roleTheme.text }}>Custom Reports</h3>
            <p className="mt-2 text-sm leading-6" style={{ color: roleTheme.text }}>
              Create reports with specific metrics and date ranges.
            </p>
            <div className="mt-4 space-y-2">
              <Button className="h-10 w-full rounded-[8px] text-white" style={{ backgroundColor: roleTheme.accent }} onClick={() => router.push("/reports/new")}>
                Create Report
              </Button>
              <Button variant="outline" className="h-10 w-full rounded-[8px] border-[#D5E7E4] text-[#153F42]" onClick={() => router.push("/reports/schedule")}>
                Schedule Report
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
