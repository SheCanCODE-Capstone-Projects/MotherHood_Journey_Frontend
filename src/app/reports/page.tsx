"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { useReportList, getReportTypeLabel, getStatusLabel } from "@/hooks/useReports";
import { AlertCircle, BarChart3, Calendar, Heart, RefreshCw, TrendingUp, Users, Download } from "lucide-react";

const REPORT_TYPES = [
  "VACCINATION_COVERAGE",
  "ANC_ATTENDANCE",
  "BIRTH_REGISTRATION",
  "MATERNAL_HEALTH",
] as const;

export default function ReportsPage() {
  const router = useRouter();
  const { role, roleTheme } = useRole();
  const isGovernment = role === "government";
  const { reports, loading, error } = useReportList();

  const handleCreateReport = () => {
    router.push("/reports/new");
  };

  const handleScheduleReport = () => {
    router.push("/reports/schedule");
  };

  const summary = useMemo(() => {
    const totals = reports.reduce(
      (accumulator, report) => {
        accumulator.total += 1;
        accumulator.status[report.status] = (accumulator.status[report.status] ?? 0) + 1;
        return accumulator;
      },
      {
        total: 0,
        status: {} as Record<string, number>,
      },
    );

    return {
      total: totals.total,
      pushed: totals.status.PUSHED ?? 0,
      queued: totals.status.QUEUED ?? 0,
      failed: totals.status.FAILED ?? 0,
    };
  }, [reports]);

  const sortedReports = useMemo(
    () => [...reports].sort((left, right) => Date.parse(right.generatedAt) - Date.parse(left.generatedAt)),
    [reports],
  );

  const reportCategories = REPORT_TYPES.map((type) => {
    const latest = sortedReports.find((report) => report.reportType === type);
    const count = reports.filter((report) => report.reportType === type).length;

    return {
      id: type,
      name: getReportTypeLabel(type),
      icon: type === "VACCINATION_COVERAGE" ? Heart : type === "ANC_ATTENDANCE" ? BarChart3 : type === "BIRTH_REGISTRATION" ? Users : TrendingUp,
      metrics: `${count} generated`,
      lastGenerated: latest
        ? new Date(latest.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "No reports yet",
      frequency: latest?.period ?? "On demand",
      reportId: latest?.id,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={isGovernment ? "Government analytics" : "Facility analytics"}
        title={isGovernment ? "National Reports" : "Reports"}
        subtitle={isGovernment ? "Backend-backed national maternal health analytics and HMIS reporting." : "Facility performance and operational reports."}
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Reports", value: summary.total, icon: BarChart3 },
          { label: "Pushed", value: summary.pushed, icon: TrendingUp },
          { label: "Queued", value: summary.queued, icon: RefreshCw },
          { label: "Failed", value: summary.failed, icon: AlertCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: roleTheme.text }}>
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: roleTheme.text }}>
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-xl p-2" style={{ backgroundColor: roleTheme.accentSoft }}>
                  <Icon className="size-5" style={{ color: roleTheme.accent }} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Report Categories */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="rounded-2xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
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
                    {category.reportId ? (
                      <Link href={`/reports/${category.reportId}`} className="mt-4 inline-flex text-sm font-semibold" style={{ color: roleTheme.accent }}>
                        Open latest report
                      </Link>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => category.reportId && router.push(`/reports/${category.reportId}`)}
                    style={{ backgroundColor: roleTheme.accent, color: "white" }}
                    disabled={!category.reportId}
                  >
                    View
                  </button>
                </div>
                <Button variant="outline" className="h-9 rounded-[8px] border-[#D5E7E4] text-[#153F42]">
                  View
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Recent Reports */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Recent Reports</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-4 rounded-2xl border-2 p-4 font-semibold text-sm" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>
            <div>Report Name</div>
            <div>Type</div>
            <div>Status</div>
            <div>Generated</div>
            <div className="text-center">Actions</div>
          </div>
          {sortedReports.slice(0, 4).map((report) => (
            <div key={report.id} className="grid grid-cols-5 items-center gap-4 rounded-2xl border bg-white p-4 text-sm" style={{ borderColor: roleTheme.border }}>
              <div className="font-medium" style={{ color: roleTheme.text }}>{report.title}</div>
              <div style={{ color: roleTheme.text }}>{getReportTypeLabel(report.reportType)}</div>
              <div style={{ color: roleTheme.text }}>{getStatusLabel(report.status)}</div>
              <div style={{ color: roleTheme.text }}>{new Date(report.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div className="flex justify-center gap-2">
                <Link href={`/reports/${report.id}`} className="rounded-lg p-2 hover:opacity-75" style={{ backgroundColor: roleTheme.accentSoft }}>
                  <Download className="size-4" style={{ color: roleTheme.accent }} />
                </Link>
              </div>
            </div>
          ))}
          {!loading && !sortedReports.length ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm" style={{ borderColor: roleTheme.border, color: roleTheme.text }}>
              No government reports have been generated yet.
            </div>
          ) : null}
        </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load government reports: {error}
        </div>
      ) : null}

      {/* Generate Custom Report */}
      <section className="rounded-2xl border-2 p-6" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft }}>
        <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>Generate Custom Report</h3>
        <p className="mt-2 text-sm" style={{ color: roleTheme.text }}>Create a backend-backed government report and store it in the reporting history.</p>
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
