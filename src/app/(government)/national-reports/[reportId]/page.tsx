"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Download,
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useReports, getReportTypeLabel, getStatusLabel } from "@/hooks/useReports";
import type { ReportStatus, ReportData } from "@/shared/types/report";
import { useAuth } from "@/shared/hooks/useAuth";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ReportStatus,
  { bg: string; text: string; border: string; Icon: LucideIcon }
> = {
  NOT_PUSHED: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B", Icon: Clock },
  QUEUED:     { bg: "#DBEAFE", text: "#1D4ED8", border: "#3B82F6", Icon: RefreshCw },
  PUSHED:     { bg: "#D1FAE5", text: "#065F46", border: "#10B981", Icon: CheckCircle2 },
  FAILED:     { bg: "#FEE2E2", text: "#991B1B", border: "#EF4444", Icon: XCircle },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReportStatus }) {
  const { bg, text, border, Icon } = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
      style={{ backgroundColor: bg, color: text, border: `1px solid ${border}` }}
    >
      <Icon className="size-3.5" />
      {getStatusLabel(status)}
    </span>
  );
}

function StatCard({
  label,
  value,
  unit,
  color = "#1F7280",
  Icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  Icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            {unit && <span className="text-sm text-[#5B8784]">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className="grid size-10 place-items-center rounded-full" style={{ backgroundColor: `${color}18` }}>
            <Icon className="size-5" style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
      <h3 className="mb-4 text-base font-semibold" style={{ color: "#194D56" }}>{title}</h3>
      <div className="h-72">{children}</div>
    </div>
  );
}

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#fff",
    border: "1px solid #CFE3E9",
    borderRadius: "8px",
    fontSize: "12px",
  },
};
const AXIS_TICK = { fill: "#5B8784", fontSize: 12 };
const AXIS_LINE = { stroke: "#E5E7EB" };

// ─── Per-type content ─────────────────────────────────────────────────────────

function VaccinationContent({ data }: { data: ReportData["VACCINATION_COVERAGE"] }) {
  const avg = (
    data.byVaccineType.reduce((s, d) => s + d.coverage, 0) / data.byVaccineType.length
  ).toFixed(1);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Average Coverage" value={avg} unit="%" color="#1F7280" Icon={CheckCircle2} />
        <StatCard label="Vaccine Types Tracked" value={data.byVaccineType.length} color="#10B981" Icon={CheckCircle2} />
      </div>
      <ChartCard title="Coverage by Vaccine Type">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.byVaccineType} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="vaccineType" tick={AXIS_TICK} axisLine={AXIS_LINE} />
            <YAxis tick={AXIS_TICK} axisLine={AXIS_LINE} unit="%" />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Bar dataKey="coverage" name="Actual %" fill="#1F7280" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target %" fill="#CFE3E9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

function AncContent({ data }: { data: ReportData["ANC_ATTENDANCE"] }) {
  const total = data.monthlyAttendance.reduce((s, d) => s + d.attendance, 0);
  const avg = Math.round(total / data.monthlyAttendance.length);
  const peak = Math.max(...data.monthlyAttendance.map((d) => d.attendance));
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Attendance" value={total.toLocaleString()} color="#1F7280" Icon={CheckCircle2} />
        <StatCard label="Monthly Average" value={avg.toLocaleString()} color="#10B981" Icon={CheckCircle2} />
        <StatCard label="Peak Month" value={peak.toLocaleString()} color="#3B82F6" Icon={CheckCircle2} />
      </div>
      <ChartCard title="Monthly ANC Attendance Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.monthlyAttendance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={AXIS_TICK} axisLine={AXIS_LINE} />
            <YAxis tick={AXIS_TICK} axisLine={AXIS_LINE} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              name="Attendance"
              stroke="#1F7280"
              strokeWidth={3}
              dot={{ fill: "#1F7280", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#2A9DB0" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

function BirthContent({ data }: { data: ReportData["BIRTH_REGISTRATION"] }) {
  const total = data.byDistrict.reduce((s, d) => s + d.registrations, 0);
  const highest = Math.max(...data.byDistrict.map((d) => d.registrations));
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Registrations" value={total.toLocaleString()} color="#1F7280" Icon={CheckCircle2} />
        <StatCard label="Districts Covered" value={data.byDistrict.length} color="#10B981" Icon={CheckCircle2} />
        <StatCard label="Highest District" value={highest.toLocaleString()} color="#3B82F6" Icon={CheckCircle2} />
      </div>
      <ChartCard title="Registrations by District">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.byDistrict} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="district" tick={AXIS_TICK} axisLine={AXIS_LINE} />
            <YAxis tick={AXIS_TICK} axisLine={AXIS_LINE} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Bar dataKey="registrations" name="Registrations" fill="#1F7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

function MaternalContent({ data }: { data: ReportData["MATERNAL_HEALTH"] }) {
  const { stats } = data;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Maternal Mortality Proxy" value={stats.maternalMortalityProxy} unit="%" color="#EF4444" Icon={AlertCircle} />
        <StatCard label="ANC Coverage" value={stats.ancCoverage} unit="%" color="#1F7280" Icon={CheckCircle2} />
        <StatCard label="Institutional Delivery Rate" value={stats.institutionalDeliveryRate} unit="%" color="#10B981" Icon={CheckCircle2} />
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
        <h3 className="mb-4 text-base font-semibold" style={{ color: "#194D56" }}>Target Assessment</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className={`grid size-9 shrink-0 place-items-center rounded-full ${stats.ancCoverage >= 85 ? "bg-green-100" : "bg-amber-100"}`}>
              {stats.ancCoverage >= 85
                ? <CheckCircle2 className="size-4 text-green-600" />
                : <AlertCircle className="size-4 text-amber-600" />}
            </div>
            <div>
              <p className="text-sm font-medium text-[#194D56]">ANC Coverage (Target 85%)</p>
              <p className="text-xs text-[#5B8784]">
                {stats.ancCoverage >= 85 ? "Target met" : `${(85 - stats.ancCoverage).toFixed(1)}% below target`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className={`grid size-9 shrink-0 place-items-center rounded-full ${stats.institutionalDeliveryRate >= 90 ? "bg-green-100" : "bg-amber-100"}`}>
              {stats.institutionalDeliveryRate >= 90
                ? <CheckCircle2 className="size-4 text-green-600" />
                : <AlertCircle className="size-4 text-amber-600" />}
            </div>
            <div>
              <p className="text-sm font-medium text-[#194D56]">Institutional Delivery (Target 90%)</p>
              <p className="text-xs text-[#5B8784]">
                {stats.institutionalDeliveryRate >= 90 ? "Target met" : `${(90 - stats.institutionalDeliveryRate).toFixed(1)}% below target`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="h-10 w-80 rounded-lg bg-gray-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-gray-200" />)}
      </div>
      <div className="h-80 rounded-2xl bg-gray-200" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.reportId as string;

  const { report, loading, error, pushing, pushResult, pushToHmis } = useReports(reportId);
  const { currentUser } = useAuth();

  const isMohAdmin = currentUser?.role === "government";
  const canPush = isMohAdmin && !!report && (report.status === "NOT_PUSHED" || report.status === "FAILED");

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8"><Skeleton /></div>;
  }

  if (error || !report) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Link href="/national-reports" className="inline-flex items-center gap-2 text-sm text-[#5B8784] hover:text-[#194D56]">
          <ArrowLeft className="size-4" /> Back to Reports
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto size-12 text-red-400" />
          <h2 className="mt-4 text-lg font-semibold text-red-800">Report Not Found</h2>
          <p className="mt-2 text-sm text-red-600">{error ?? "The requested report could not be found."}</p>
          <Link href="/national-reports">
            <Button variant="outline" className="mt-4 rounded-xl" size="sm">View All Reports</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Link href="/national-reports" className="inline-flex items-center gap-2 text-sm text-[#5B8784] transition-colors hover:text-[#194D56]">
        <ArrowLeft className="size-4" /> Back to Reports
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: "#194D56" }}>{report.title}</h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-2 text-sm text-[#5B8784]">{report.description}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#5B8784]">
            <span><span className="font-semibold">Type:</span> {getReportTypeLabel(report.reportType)}</span>
            <span><span className="font-semibold">Period:</span> {fmt(report.periodStart)} – {fmt(report.periodEnd)}</span>
            {report.facilityName && <span><span className="font-semibold">Facility:</span> {report.facilityName}</span>}
            {report.districtName && <span><span className="font-semibold">District:</span> {report.districtName}</span>}
            <span><span className="font-semibold">Generated:</span> {fmt(report.generatedAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" className="rounded-xl gap-2" style={{ borderColor: "#CFE3E9", color: "#194D56" }}>
            <Download className="size-4" /> Export
          </Button>
          {canPush && (
            <Button
              onClick={() => void pushToHmis()}
              disabled={pushing}
              className="rounded-xl gap-2 text-white"
              style={{ backgroundColor: "#1F7280" }}
            >
              {pushing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {pushing ? "Pushing…" : "Push to HMIS"}
            </Button>
          )}
        </div>
      </div>

      {/* Push result banner */}
      {pushResult && (
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${pushResult.success ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {pushResult.success ? <CheckCircle2 className="size-4 shrink-0" /> : <XCircle className="size-4 shrink-0" />}
          {pushResult.message}
        </div>
      )}

      {/* Content per report type */}
      {report.reportType === "VACCINATION_COVERAGE" && (
        <VaccinationContent data={report.data as ReportData["VACCINATION_COVERAGE"]} />
      )}
      {report.reportType === "ANC_ATTENDANCE" && (
        <AncContent data={report.data as ReportData["ANC_ATTENDANCE"]} />
      )}
      {report.reportType === "BIRTH_REGISTRATION" && (
        <BirthContent data={report.data as ReportData["BIRTH_REGISTRATION"]} />
      )}
      {report.reportType === "MATERNAL_HEALTH" && (
        <MaternalContent data={report.data as ReportData["MATERNAL_HEALTH"]} />
      )}
    </div>
  );
}
