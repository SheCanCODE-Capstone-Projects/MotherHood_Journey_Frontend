"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Heart,
  Loader2,
  PlusCircle,
  TrendingUp,
  Users,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";

// ── Download helpers ───────────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? "")).join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const csv = buildCsv(rows);
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
}

function downloadPdf(title: string, rows: Record<string, unknown>[]) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const tableRows = rows
    .map(
      (r) =>
        `<tr>${headers.map((h) => `<td style="padding:6px 10px;border:1px solid #CEE6E1;">${r[h] ?? ""}</td>`).join("")}</tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; padding: 32px; color: #1D5551; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    p { font-size: 12px; color: #5B8784; margin-bottom: 24px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    th { background: #E4F4F1; padding: 8px 10px; border: 1px solid #CEE6E1; text-align: left; font-weight: 600; }
    tr:nth-child(even) td { background: #F7FBFA; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Generated on ${new Date().toLocaleString()} — Motherhood Journey</p>
  <table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;

  // Use a hidden same-origin iframe to avoid the cross-origin SecurityError
  // that occurs when calling print() on a window.open("", "_blank") target.
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;width:0;height:0;border:0;opacity:0;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Remove the iframe after the print dialog closes (or after a safe delay)
    setTimeout(() => document.body.removeChild(iframe), 2000);
  }, 300);
}

// ── Report data ────────────────────────────────────────────────────────────

const REPORT_DATA: Record<string, Record<string, unknown>[]> = {
  maternal: [
    { "Patient Name": "Grace Mukamana", "Age": 24, "ANC Visits": 4, "Gestational Age (wks)": 32, "Last Visit": "May 10, 2026", "Status": "Active" },
    { "Patient Name": "Marie Uwase", "Age": 29, "ANC Visits": 3, "Gestational Age (wks)": 28, "Last Visit": "May 8, 2026", "Status": "Active" },
    { "Patient Name": "Jeanne d'Arc Umutoni", "Age": 31, "ANC Visits": 6, "Gestational Age (wks)": 40, "Last Visit": "May 12, 2026", "Status": "Postnatal" },
    { "Patient Name": "Emilie Nyiraneza", "Age": 22, "ANC Visits": 1, "Gestational Age (wks)": 12, "Last Visit": "May 5, 2026", "Status": "New" },
    { "Patient Name": "Claire Umulisa", "Age": 27, "ANC Visits": 5, "Gestational Age (wks)": 36, "Last Visit": "May 11, 2026", "Status": "Active" },
    { "Patient Name": "Aline Iradukunda", "Age": 34, "ANC Visits": 4, "Gestational Age (wks)": 30, "Last Visit": "May 9, 2026", "Status": "Active" },
    { "Patient Name": "Sandrine Uwineza", "Age": 26, "ANC Visits": 2, "Gestational Age (wks)": 20, "Last Visit": "May 7, 2026", "Status": "Active" },
  ],
  performance: [
    { "KPI": "ANC Attendance Rate", "Target": "90%", "Actual": "88%", "Variance": "-2%", "Trend": "↑ +4.2% MoM" },
    { "KPI": "Vaccination Coverage", "Target": "95%", "Actual": "92%", "Variance": "-3%", "Trend": "↑ +1.8% MoM" },
    { "KPI": "No-Show Rate", "Target": "≤5%", "Actual": "5.0%", "Variance": "0%", "Trend": "↓ -0.5% MoM" },
    { "KPI": "Service Backlog", "Target": "0", "Actual": "12", "Variance": "+12", "Trend": "→ Unchanged" },
    { "KPI": "Postnatal Follow-up Rate", "Target": "80%", "Actual": "76%", "Variance": "-4%", "Trend": "↑ +2.1% MoM" },
    { "KPI": "Lab Turnaround (hrs)", "Target": "24", "Actual": "28", "Variance": "+4h", "Trend": "↓ -3h MoM" },
  ],
  staff: [
    { "Staff Name": "Dr. Eric Habimana", "Role": "Obstetrician", "Visits Conducted": 42, "ANC Sessions": 18, "Vaccinations": 0, "Hours Logged": 168 },
    { "Staff Name": "Nurse Alice Ingabire", "Role": "Midwife", "Visits Conducted": 89, "ANC Sessions": 34, "Vaccinations": 55, "Hours Logged": 176 },
    { "Staff Name": "Jean Bosco Nkurunziza", "Role": "CHW Supervisor", "Visits Conducted": 23, "ANC Sessions": 0, "Vaccinations": 23, "Hours Logged": 120 },
    { "Staff Name": "Rose Mukeshimana", "Role": "Lab Technician", "Visits Conducted": 0, "ANC Sessions": 0, "Vaccinations": 0, "Hours Logged": 160 },
    { "Staff Name": "Paul Ntwali", "Role": "Nurse", "Visits Conducted": 61, "ANC Sessions": 20, "Vaccinations": 41, "Hours Logged": 172 },
  ],
  trends: [
    { "Month": "Jun 2025", "ANC Attendance (%)": 72, "Vaccination Coverage (%)": 85, "No-Show Rate (%)": 12.4, "New Mothers": 18 },
    { "Month": "Jul 2025", "ANC Attendance (%)": 75, "Vaccination Coverage (%)": 87, "No-Show Rate (%)": 10.8, "New Mothers": 21 },
    { "Month": "Aug 2025", "ANC Attendance (%)": 68, "Vaccination Coverage (%)": 84, "No-Show Rate (%)": 14.2, "New Mothers": 15 },
    { "Month": "Sep 2025", "ANC Attendance (%)": 79, "Vaccination Coverage (%)": 88, "No-Show Rate (%)": 11.5, "New Mothers": 24 },
    { "Month": "Oct 2025", "ANC Attendance (%)": 83, "Vaccination Coverage (%)": 89, "No-Show Rate (%)": 9.3, "New Mothers": 27 },
    { "Month": "Nov 2025", "ANC Attendance (%)": 80, "Vaccination Coverage (%)": 90, "No-Show Rate (%)": 8.1, "New Mothers": 22 },
    { "Month": "Dec 2025", "ANC Attendance (%)": 77, "Vaccination Coverage (%)": 88, "No-Show Rate (%)": 13.7, "New Mothers": 19 },
    { "Month": "Jan 2026", "ANC Attendance (%)": 84, "Vaccination Coverage (%)": 91, "No-Show Rate (%)": 10.2, "New Mothers": 28 },
    { "Month": "Feb 2026", "ANC Attendance (%)": 88, "Vaccination Coverage (%)": 92, "No-Show Rate (%)": 9.8, "New Mothers": 30 },
    { "Month": "Mar 2026", "ANC Attendance (%)": 85, "Vaccination Coverage (%)": 91, "No-Show Rate (%)": 8.9, "New Mothers": 26 },
    { "Month": "Apr 2026", "ANC Attendance (%)": 90, "Vaccination Coverage (%)": 93, "No-Show Rate (%)": 7.6, "New Mothers": 33 },
    { "Month": "May 2026", "ANC Attendance (%)": 88, "Vaccination Coverage (%)": 92, "No-Show Rate (%)": 8.7, "New Mothers": 31 },
  ],
};

// ── Report categories ──────────────────────────────────────────────────────

const REPORT_CATEGORIES = [
  {
    id: "maternal",
    name: "Maternal Health Summary",
    icon: Heart,
    metric: "156 mothers tracked",
    lastGenerated: "May 10, 2026",
    frequency: "Monthly",
    defaultFormat: "csv" as const,
  },
  {
    id: "performance",
    name: "Performance Dashboard",
    icon: BarChart3,
    metric: "94% targets met",
    lastGenerated: "May 12, 2026",
    frequency: "Real-time",
    defaultFormat: "pdf" as const,
  },
  {
    id: "staff",
    name: "Staff Productivity",
    icon: Users,
    metric: "89 visits recorded",
    lastGenerated: "May 11, 2026",
    frequency: "Weekly",
    defaultFormat: "csv" as const,
  },
  {
    id: "trends",
    name: "Trend Analysis",
    icon: TrendingUp,
    metric: "+5% improvement vs last quarter",
    lastGenerated: "May 10, 2026",
    frequency: "Monthly",
    defaultFormat: "csv" as const,
  },
];

// ── Recent reports ─────────────────────────────────────────────────────────

const RECENT_REPORTS = [
  { name: "Monthly Performance Report — April 2026", reportId: "performance", type: "PDF", size: "2.4 MB", date: "May 1, 2026" },
  { name: "Vaccination Coverage Report", reportId: "trends", type: "Excel", size: "1.2 MB", date: "May 5, 2026" },
  { name: "Staff Attendance Report — Q1 2026", reportId: "staff", type: "PDF", size: "890 KB", date: "May 8, 2026" },
  { name: "Maternal Health Indicators", reportId: "maternal", type: "Excel", size: "1.8 MB", date: "May 10, 2026" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function FileTypeBadge({ type }: { type: string }) {
  const isExcel = type === "Excel";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isExcel ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
      )}
    >
      {isExcel ? <FileSpreadsheet className="size-3.5" /> : <FileText className="size-3.5" />}
      {type}
    </span>
  );
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function FacilityReportsPage() {
  const { roleTheme } = useRole({ fallbackRole: "facility_admin" });
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);

  // Generate a report from a category card
  const handleGenerate = (id: string, format: "csv" | "pdf", label: string) => {
    setGeneratingId(id);
    const data = REPORT_DATA[id] ?? [];
    setTimeout(() => {
      if (format === "csv") {
        downloadCsv(`${slugify(label)}.csv`, data);
      } else {
        downloadPdf(label, data);
      }
      setGeneratingId(null);
    }, 600);
  };

  // Download a report from the recent-reports table
  const handleDownload = (idx: number, report: (typeof RECENT_REPORTS)[number]) => {
    setDownloadingIdx(idx);
    const data = REPORT_DATA[report.reportId] ?? [];
    const label = report.name;
    setTimeout(() => {
      if (report.type === "Excel") {
        downloadCsv(`${slugify(label)}.csv`, data);
      } else {
        downloadPdf(label, data);
      }
      setDownloadingIdx(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Facility Admin"
        title="Reports"
        subtitle="Facility performance reports and operational summaries."
        action={
          <Button
            className="h-10 rounded-full px-5"
            onClick={() => handleGenerate("trends", "csv", "Custom Trend Report")}
          >
            <PlusCircle className="size-4" />
            Generate Report
          </Button>
        }
      />

      {/* Report category cards */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
          Available Reports
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {REPORT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isGenerating = generatingId === cat.id;

            return (
              <article
                key={cat.id}
                className="flex items-start gap-4 rounded-3xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                style={{ borderColor: roleTheme.border }}
              >
                <div
                  className="mt-0.5 shrink-0 rounded-2xl p-3"
                  style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#5B8784]">{cat.metric}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#D5E9E6] bg-[#F8FCFB] px-2.5 py-1 text-[11px] font-medium text-[#54797C]">
                      Last: {cat.lastGenerated}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#D5E9E6] bg-[#F8FCFB] px-2.5 py-1 text-[11px] font-medium text-[#54797C]">
                      {cat.frequency}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#D5E9E6] bg-[#F8FCFB] px-2.5 py-1 text-[11px] font-medium text-[#54797C] uppercase">
                      {cat.defaultFormat === "pdf" ? (
                        <FileText className="size-3" />
                      ) : (
                        <FileSpreadsheet className="size-3" />
                      )}
                      {cat.defaultFormat === "pdf" ? "PDF" : "CSV / Excel"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={isGenerating}
                    onClick={() => handleGenerate(cat.id, cat.defaultFormat, cat.name)}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Download className="size-3.5" />
                        Download
                      </>
                    )}
                  </Button>
                  {/* toggle format */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[#D5E9E6] bg-white text-[#54797C] text-[11px]"
                    disabled={isGenerating}
                    onClick={() =>
                      handleGenerate(
                        cat.id,
                        cat.defaultFormat === "pdf" ? "csv" : "pdf",
                        cat.name,
                      )
                    }
                  >
                    {cat.defaultFormat === "pdf" ? "↓ CSV instead" : "↓ PDF instead"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Recent reports table */}
      <section
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        <div className="border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
          <h2 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
            Recent Reports
          </h2>
          <p className="mt-0.5 text-xs text-[#5B8784]">Previously generated files</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#F7FBFA] text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
                <th className="px-5 py-4">Report name</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Size</th>
                <th className="px-5 py-4">Generated</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EEEC]">
              {RECENT_REPORTS.map((report, idx) => {
                const isDownloading = downloadingIdx === idx;
                return (
                  <tr key={report.name} className="transition-colors hover:bg-[#FAFCFB]">
                    <td className="px-5 py-4 font-medium" style={{ color: roleTheme.text }}>
                      {report.name}
                    </td>
                    <td className="px-5 py-4">
                      <FileTypeBadge type={report.type} />
                    </td>
                    <td className="px-5 py-4 text-[#54797C]">{report.size}</td>
                    <td className="px-5 py-4 text-[#54797C]">{report.date}</td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[#D5E9E6] bg-white"
                        style={{ color: roleTheme.text }}
                        disabled={isDownloading}
                        onClick={() => handleDownload(idx, report)}
                      >
                        {isDownloading ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Download className="size-3.5" />
                        )}
                        {isDownloading ? "Downloading…" : "Download"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom report builder */}
      <section
        className="rounded-3xl border p-6"
        style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              Generate Custom Report
            </h3>
            <p className="mt-1 text-xs text-[#5B8784]">
              Select specific metrics, date ranges, and export format for a tailored report.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button
              className="rounded-full"
              onClick={() => handleGenerate("trends", "csv", "Custom Report — All Trends")}
            >
              <FileSpreadsheet className="size-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#D5E9E6] bg-white"
              style={{ color: roleTheme.text }}
              onClick={() => handleGenerate("performance", "pdf", "Custom Performance Report")}
            >
              <FileText className="size-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
