"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MinusCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import {
  generateReport,
  getGovernmentReports,
  type GenerateReportRequest,
  type ReportPeriodType,
  type ReportScopeLevel,
  type StoredReport,
} from "@/lib/api/government";
import type { ReportType, ReportStatus } from "@/shared/types/report";

// ─── Static options ──────────────────────────────────────────────────────────

const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  {
    value: "VACCINATION_COVERAGE",
    label: "Vaccination Coverage",
    description: "Coverage rates by vaccine type and region",
  },
  {
    value: "ANC_ATTENDANCE",
    label: "ANC Attendance",
    description: "Antenatal care visit trends and targets",
  },
  {
    value: "BIRTH_REGISTRATION",
    label: "Birth Registration",
    description: "Registrations by district and period",
  },
  {
    value: "MATERNAL_HEALTH",
    label: "Maternal Health",
    description: "Key maternal health indicators and outcomes",
  },
];

const PERIOD_TYPES: { value: ReportPeriodType; label: string }[] = [
  { value: "MONTH", label: "Month" },
  { value: "QUARTER", label: "Quarter" },
  { value: "YEAR", label: "Year" },
];

const SCOPE_LEVELS: { value: ReportScopeLevel; label: string }[] = [
  { value: "NATIONAL", label: "National" },
  { value: "PROVINCE", label: "Province" },
  { value: "DISTRICT", label: "District" },
];

const PROVINCES = [
  { id: "northern", name: "Northern Province" },
  { id: "eastern", name: "Eastern Province" },
  { id: "kigali", name: "Kigali City" },
  { id: "southern", name: "Southern Province" },
  { id: "western", name: "Western Province" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => String(currentYear - i));

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; className: string; Icon: React.ElementType }
> = {
  NOT_PUSHED: {
    label: "Not Pushed",
    className: "bg-gray-100 text-gray-600",
    Icon: MinusCircle,
  },
  QUEUED: {
    label: "Queued",
    className: "bg-amber-50 text-amber-700",
    Icon: Clock,
  },
  PUSHED: {
    label: "Pushed",
    className: "bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
    Icon: XCircle,
  },
};

const REPORT_TYPE_COLORS: Record<ReportType, string> = {
  VACCINATION_COVERAGE: "bg-teal-50 text-teal-700",
  ANC_ATTENDANCE: "bg-blue-50 text-blue-700",
  BIRTH_REGISTRATION: "bg-purple-50 text-purple-700",
  MATERNAL_HEALTH: "bg-rose-50 text-rose-700",
};

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  VACCINATION_COVERAGE: "Vaccination",
  ANC_ATTENDANCE: "ANC",
  BIRTH_REGISTRATION: "Birth Reg.",
  MATERNAL_HEALTH: "Maternal",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Select component ─────────────────────────────────────────────────────────

function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#3A8F85] focus:ring-1 focus:ring-[#3A8F85]/30",
        className,
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Report row ───────────────────────────────────────────────────────────────

function ReportRow({ report }: { report: StoredReport }) {
  const { label, className: statusCls, Icon: StatusIcon } = STATUS_CONFIG[report.status];
  const typeCls = REPORT_TYPE_COLORS[report.reportType];
  const typeLabel = REPORT_TYPE_LABELS[report.reportType];

  return (
    <div className="flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 last:border-0 hover:bg-gray-50/60 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">{report.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">
          {report.scopeName} · Generated {formatDate(report.generatedAt)}
        </p>
      </div>
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", typeCls)}>
        {typeLabel}
      </span>
      <span
        className={cn(
          "hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium sm:flex",
          statusCls,
        )}
      >
        <StatusIcon className="size-3" />
        {label}
      </span>
      <Link
        href={`/national-reports/${report.id}`}
        className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-[#E8F6F3] hover:text-[#3A8F85] transition-colors"
        title="View report"
      >
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NationalReportsPage() {
  const { roleTheme } = useRole({ fallbackRole: "government" });
  const queryClient = useQueryClient();

  // Form state
  const [reportType, setReportType] = useState<ReportType>("VACCINATION_COVERAGE");
  const [periodType, setPeriodType] = useState<ReportPeriodType>("QUARTER");
  const [periodYear, setPeriodYear] = useState(String(currentYear));
  const [periodMonth, setPeriodMonth] = useState("1");
  const [periodQuarter, setPeriodQuarter] = useState("1");
  const [scopeLevel, setScopeLevel] = useState<ReportScopeLevel>("NATIONAL");
  const [scopeId, setScopeId] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const reportsQuery = useQuery({
    queryKey: ["government-reports"],
    queryFn: getGovernmentReports,
    refetchInterval: 5 * 60_000,
  });

  const generateMutation = useMutation({
    mutationFn: (req: GenerateReportRequest) => generateReport(req),
    onSuccess: ({ id }) => {
      setSuccessId(id);
      void queryClient.invalidateQueries({ queryKey: ["government-reports"] });
    },
  });

  const handleGenerate = () => {
    const selectedProvince = PROVINCES.find((p) => p.id === scopeId);
    generateMutation.mutate({
      reportType,
      periodType,
      periodYear,
      periodMonth: periodType === "MONTH" ? periodMonth : undefined,
      periodQuarter: periodType === "QUARTER" ? periodQuarter : undefined,
      scopeLevel,
      scopeId: scopeLevel !== "NATIONAL" ? scopeId : undefined,
      scopeName:
        scopeLevel === "PROVINCE"
          ? (selectedProvince?.name ?? scopeId)
          : scopeLevel === "DISTRICT"
            ? scopeId
            : "National",
    });
  };

  const canSubmit =
    !generateMutation.isPending &&
    (scopeLevel === "NATIONAL" || scopeId.trim().length > 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and manage national health reports for HMIS submission.
        </p>
      </div>

      {/* Generator card */}
      <div className="rounded-3xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
        <div className="border-b px-6 py-4" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-base font-semibold text-gray-800">Generate New Report</h2>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Report type */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Report Type
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {REPORT_TYPES.map((rt) => (
                <button
                  key={rt.value}
                  onClick={() => setReportType(rt.value)}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    reportType === rt.value
                      ? "border-[#3A8F85] bg-[#E8F6F3]"
                      : "border-gray-200 bg-white hover:border-[#3A8F85]/40 hover:bg-gray-50",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      reportType === rt.value ? "text-[#215C57]" : "text-gray-700",
                    )}
                  >
                    {rt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{rt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Period
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                {PERIOD_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    onClick={() => setPeriodType(pt.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      periodType === pt.value
                        ? "bg-white text-[#215C57] shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>

              <Select
                value={periodYear}
                onChange={setPeriodYear}
                options={YEARS.map((y) => ({ value: y, label: y }))}
                className="w-24"
              />

              {periodType === "MONTH" && (
                <Select
                  value={periodMonth}
                  onChange={setPeriodMonth}
                  options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
                  className="w-36"
                />
              )}

              {periodType === "QUARTER" && (
                <div className="flex gap-1">
                  {["1", "2", "3", "4"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setPeriodQuarter(q)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium border transition-all",
                        periodQuarter === q
                          ? "border-[#3A8F85] bg-[#E8F6F3] text-[#215C57]"
                          : "border-gray-200 text-gray-600 hover:border-[#3A8F85]/40",
                      )}
                    >
                      Q{q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scope */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Scope
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                {SCOPE_LEVELS.map((sl) => (
                  <button
                    key={sl.value}
                    onClick={() => {
                      setScopeLevel(sl.value);
                      setScopeId("");
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      scopeLevel === sl.value
                        ? "bg-white text-[#215C57] shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    {sl.label}
                  </button>
                ))}
              </div>

              {scopeLevel === "PROVINCE" && (
                <Select
                  value={scopeId}
                  onChange={setScopeId}
                  placeholder="Select province…"
                  options={PROVINCES.map((p) => ({ value: p.id, label: p.name }))}
                  className="w-48"
                />
              )}

              {scopeLevel === "DISTRICT" && (
                <input
                  type="text"
                  value={scopeId}
                  onChange={(e) => setScopeId(e.target.value)}
                  placeholder="District name…"
                  className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#3A8F85] focus:ring-1 focus:ring-[#3A8F85]/30 w-48"
                />
              )}
            </div>
          </div>

          {/* Success banner */}
          {successId && !generateMutation.isPending && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>
                Report generated successfully. View it in the list below.
              </span>
              <button
                onClick={() => setSuccessId(null)}
                className="ml-auto text-emerald-500 hover:text-emerald-700"
              >
                ×
              </button>
            </div>
          )}

          {generateMutation.isError && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle className="size-4 shrink-0" />
              <span>Failed to generate report. Please try again.</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={!canSubmit}
              className="rounded-2xl px-6 text-white"
              style={{ backgroundColor: roleTheme.accent }}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Recent reports list */}
      <div className="rounded-3xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
        <div className="border-b px-6 py-4" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4" style={{ color: roleTheme.accent }} />
              <h2 className="text-base font-semibold text-gray-800">Recent Reports</h2>
            </div>
            {reportsQuery.data && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                {reportsQuery.data.length}
              </span>
            )}
          </div>
        </div>

        {reportsQuery.isPending ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" />
            Loading reports…
          </div>
        ) : reportsQuery.isError ? (
          <div className="flex flex-col items-center gap-3 py-12 text-sm text-gray-400">
            <XCircle className="size-6 text-red-400" />
            <p>Failed to load reports.</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => void reportsQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : reportsQuery.data?.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No reports yet. Generate your first report above.
          </div>
        ) : (
          <div>
            {reportsQuery.data?.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
