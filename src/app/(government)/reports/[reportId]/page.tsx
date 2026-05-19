"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
  RefreshCw,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { useReports, getReportTypeLabel, getStatusLabel } from "@/hooks/useReports";
import type { ReportStatus } from "@/shared/types/report";
import { useAuth } from "@/shared/hooks/useAuth";

// Status badge colors
const statusConfig: Record<
  ReportStatus,
  { bg: string; text: string; icon: LucideIcon; border: string }
> = {
  NOT_PUSHED: {
    bg: "#FEF3C7",
    text: "#92400E",
    border: "#F59E0B",
    icon: Clock,
  },
  QUEUED: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#3B82F6",
    icon: RefreshCw,
  },
  PUSHED: {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#10B981",
    icon: CheckCircle,
  },
  FAILED: {
    bg: "#FEE2E2",
    text: "#991B1B",
    border: "#EF4444",
    icon: XCircle,
  },
};

// Stat Card Component
function StatCard({
  label,
  value,
  unit = "",
  icon: Icon,
  color = "#1F7280",
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5B8784]">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="text-3xl font-bold" style={{ color }}>
              {value}
            </p>
            {unit && <span className="text-sm text-[#5B8784]">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: ReportStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
      style={{ backgroundColor: config.bg, color: config.text, border: `1px solid ${config.border}` }}
    >
      <Icon className="h-4 w-4" />
      {getStatusLabel(status)}
    </div>
  );
}

// Vaccination Coverage Chart
function VaccinationCoverageChart({ data }: { data: Array<{ vaccineType: string; coverage: number; target: number }> }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
      <h3 className="mb-4 text-base font-semibold" style={{ color: "#194D56" }}>
        Coverage by Vaccine Type
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="vaccineType" 
              tick={{ fill: "#5B8784", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis 
              tick={{ fill: "#5B8784", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              label={{ value: "%", angle: -90, position: "insideLeft", fill: "#5B8784" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #CFE3E9",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="coverage" name="Actual Coverage" fill="#1F7280" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ANC Attendance Chart
function AncAttendanceChart({ data }: { data: Array<{ month: string; attendance: number }> }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
      <h3 className="mb-4 text-base font-semibold" style={{ color: "#194D56" }}>
        Monthly ANC Attendance Trend
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#5B8784", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis 
              tick={{ fill: "#5B8784", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #CFE3E9",
                borderRadius: "8px",
              }}
            />
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
      </div>
    </div>
  );
}

// Birth Registration Chart
function BirthRegistrationChart({ data }: { data: Array<{ district: string; registrations: number }> }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
      <h3 className="mb-4 text-base font-semibold" style={{ color: "#194D56" }}>
        Registrations by District
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="district" 
              tick={{ fill: "#5B8784", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis 
              tick={{ fill: "#5B8784", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #CFE3E9",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="registrations" name="Registrations" fill="#1F7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Maternal Health Stats
function MaternalHealthStats({ stats }: { stats: { maternalMortalityProxy: number; ancCoverage: number; institutionalDeliveryRate: number } }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Maternal Mortality Proxy"
        value={stats.maternalMortalityProxy}
        unit="%"
        color="#EF4444"
        icon={AlertCircle}
      />
      <StatCard
        label="ANC Coverage"
        value={stats.ancCoverage}
        unit="%"
        color="#1F7280"
        icon={CheckCircle}
      />
      <StatCard
        label="Institutional Delivery Rate"
        value={stats.institutionalDeliveryRate}
        unit="%"
        color="#10B981"
        icon={CheckCircle}
      />
    </div>
  );
}

// Loading Skeleton
function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="h-8 w-64 rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-200" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-gray-200" />
    </div>
  );
}

// Main Page Component
export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;
  const { report, loading, error, pushing, pushToHmis } = useReports(reportId);
  const { currentUser } = useAuth();
  const [pushMessage, setPushMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check if user is government role (MOH_ADMIN)
  const isMohAdmin = currentUser?.role === "government";
  const showPushButton = isMohAdmin && report && (report.status === "NOT_PUSHED" || report.status === "FAILED");

  const handlePushToHmis = async () => {
    try {
      const result = await pushToHmis();
      setPushMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });
      
      // Clear message after 5 seconds
      setTimeout(() => setPushMessage(null), 5000);
    } catch (err) {
      setPushMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#5B8784] hover:text-[#194D56]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </button>
        <ReportSkeleton />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#5B8784] hover:text-[#194D56]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </button>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-red-800">Report Not Found</h2>
          <p className="mt-2 text-sm text-red-600">
            {error || "The requested report could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#5B8784] hover:text-[#194D56]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </button>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: "#194D56" }}>
              {report.title}
            </h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-2 text-sm text-[#5B8784]">{report.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#5B8784]">
            <span>
              <span className="font-semibold">Type:</span> {getReportTypeLabel(report.reportType)}
            </span>
            <span>
              <span className="font-semibold">Period:</span>{" "}
              {formatDate(report.periodStart)} - {formatDate(report.periodEnd)}
            </span>
            {report.facilityName && (
              <span>
                <span className="font-semibold">Facility:</span> {report.facilityName}
              </span>
            )}
            {report.districtName && (
              <span>
                <span className="font-semibold">District:</span> {report.districtName}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 rounded-xl border border-[#CFE3E9] bg-white px-4 py-2 text-sm font-medium text-[#194D56] hover:bg-[#E8F2F4]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {showPushButton && (
            <button
              onClick={handlePushToHmis}
              disabled={pushing}
              className="flex items-center gap-2 rounded-xl bg-[#1F7280] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A6270] disabled:opacity-50"
            >
              <Upload className={`h-4 w-4 ${pushing ? "animate-spin" : ""}`} />
              {pushing ? "Pushing..." : "Push to HMIS"}
            </button>
          )}
        </div>
      </div>

      {/* Push Message */}
      {pushMessage && (
        <div
          className={`rounded-xl p-4 ${
            pushMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {pushMessage.text}
        </div>
      )}

      {/* Content based on report type */}
      {report.reportType === "VACCINATION_COVERAGE" && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              label="Average Coverage"
              value={`${(
                (report.data as any).byVaccineType.reduce(
                  (sum: number, item: { coverage: number }) => sum + item.coverage,
                  0
                ) / (report.data as any).byVaccineType.length
              ).toFixed(1)}%`}
              color="#1F7280"
            />
            <StatCard
              label="Vaccine Types Tracked"
              value={(report.data as any).byVaccineType.length}
              color="#10B981"
            />
          </div>
          <VaccinationCoverageChart data={(report.data as any).byVaccineType} />
        </>
      )}

      {report.reportType === "ANC_ATTENDANCE" && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total Attendance"
              value={(report.data as any).monthlyAttendance.reduce(
                (sum: number, item: { attendance: number }) => sum + item.attendance,
                0
              ).toLocaleString()}
              color="#1F7280"
            />
            <StatCard
              label="Average Monthly"
              value={Math.round(
                (report.data as any).monthlyAttendance.reduce(
                  (sum: number, item: { attendance: number }) => sum + item.attendance,
                  0
                ) / (report.data as any).monthlyAttendance.length
              ).toLocaleString()}
              color="#10B981"
            />
            <StatCard
              label="Peak Month"
              value={Math.max(
                ...(report.data as any).monthlyAttendance.map(
                  (item: { attendance: number }) => item.attendance
                )
              ).toLocaleString()}
              color="#3B82F6"
            />
          </div>
          <AncAttendanceChart data={(report.data as any).monthlyAttendance} />
        </>
      )}

      {report.reportType === "BIRTH_REGISTRATION" && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total Registrations"
              value={(report.data as any).byDistrict.reduce(
                (sum: number, item: { registrations: number }) => sum + item.registrations,
                0
              ).toLocaleString()}
              color="#1F7280"
            />
            <StatCard
              label="Districts Covered"
              value={(report.data as any).byDistrict.length}
              color="#10B981"
            />
            <StatCard
              label="Highest District"
              value={Math.max(
                ...(report.data as any).byDistrict.map(
                  (item: { registrations: number }) => item.registrations
                )
              ).toLocaleString()}
              color="#3B82F6"
            />
          </div>
          <BirthRegistrationChart data={(report.data as any).byDistrict} />
        </>
      )}

      {report.reportType === "MATERNAL_HEALTH" && (
        <>
          <MaternalHealthStats stats={(report.data as any).stats} />
          {/* Additional info card */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#CFE3E9" }}>
            <h3 className="mb-3 text-base font-semibold" style={{ color: "#194D56" }}>
              Report Summary
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#D1FAE5" }}>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#194D56]">ANC Coverage Target</p>
                  <p className="text-xs text-[#5B8784]">
                    {(report.data as any).stats.ancCoverage >= 85 ? "Met" : "Below target"} (Target: 85%)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#D1FAE5" }}>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#194D56]">Institutional Delivery</p>
                  <p className="text-xs text-[#5B8784]">
                    {(report.data as any).stats.institutionalDeliveryRate >= 90 ? "Excellent" : "Needs improvement"} (Target: 90%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}