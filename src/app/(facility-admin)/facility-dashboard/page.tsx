"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  Activity,
  AlertCircle,
  Clock,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { AncAttendanceTrend } from "@/components/charts/AncAttendanceTrend";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import { getFacilityStatsById } from "@/lib/api/facility-stats";
import { getServiceRequestsByFacility } from "@/lib/api/service-requests";
import type { ServiceRequestResponse } from "@/shared/types/backend";

// ── Status badge ───────────────────────────────────────────────────────────

type RequestStatus = "PENDING" | "VERIFIED" | "URGENT" | "COMPLETED" | "APPROVED" | "REJECTED" | "PROCESSING";

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700 border border-amber-200",
  VERIFIED:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  APPROVED:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  URGENT:     "bg-red-50 text-red-700 border border-red-200",
  REJECTED:   "bg-red-50 text-red-700 border border-red-200",
  COMPLETED:  "bg-slate-50 text-slate-600 border border-slate-200",
  PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        STATUS_STYLES[status] ?? "bg-gray-50 text-gray-600 border border-gray-200",
      )}
    >
      {status}
    </span>
  );
}

// ── Stat cards ─────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  goodDirection,
  sub,
  badge,
  roleTheme,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendLabel: string;
  goodDirection: "up" | "down";
  sub: string;
  badge?: { text: string; variant: "action" | "info" };
  roleTheme: { border: string; text: string; accent: string; accentSoft: string };
  loading: boolean;
}) {
  const isGood = trend === "neutral" || trend === goodDirection;
  const trendColor =
    trend === "neutral" ? "text-slate-500" : isGood ? "text-emerald-600" : "text-red-500";

  return (
    <article
      className="rounded-3xl border bg-white p-5 shadow-sm"
      style={{ borderColor: roleTheme.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            {label}
          </p>
          <div className="mt-2 text-3xl font-bold" style={{ color: roleTheme.text }}>
            {loading ? (
              <span className="inline-block h-8 w-20 animate-pulse rounded-xl bg-[#E3F3F0]" />
            ) : (
              value
            )}
          </div>
          <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trendColor)}>
            {trend === "up" ? (
              <TrendingUp className="size-3.5 shrink-0" />
            ) : trend === "down" ? (
              <TrendingDown className="size-3.5 shrink-0" />
            ) : null}
            {trendLabel}
          </div>
        </div>
        <div
          className="shrink-0 rounded-2xl p-3"
          style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-3 border-t pt-3" style={{ borderColor: roleTheme.border }}>
        {badge ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              badge.variant === "action"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-[#E4F4F1] text-[#1D5551] border border-[#CEE6E1]",
            )}
          >
            {badge.text}
          </span>
        ) : (
          <p className="text-[11px] text-[#5B8784]">{sub}</p>
        )}
      </div>
    </article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function FacilityAdminDashboard() {
  const { roleTheme, organizationName } = useRole({ fallbackRole: "facility_admin" });
  const { data: session } = useSession();
  const facilityId = session?.user?.facilityId ? String(session.user.facilityId) : "";
  const [search, setSearch] = useState("");

  const statsQuery = useQuery({
    queryKey: ["facility-admin", "stats", facilityId],
    queryFn: () => (facilityId ? getFacilityStatsById(facilityId) : Promise.resolve(null)),
    enabled: !!facilityId,
    refetchInterval: 5 * 60_000,
  });

  const requestsQuery = useQuery({
    queryKey: ["facility-admin", "service-requests", facilityId],
    queryFn: () =>
      facilityId
        ? getServiceRequestsByFacility(facilityId, 0, 20)
        : Promise.resolve({ content: [], totalPages: 0, totalElements: 0, pageNumber: 0, pageSize: 20, last: true }),
    enabled: !!facilityId,
    refetchInterval: 5 * 60_000,
  });

  const isFetching = statsQuery.isFetching || requestsQuery.isFetching;

  const refetchAll = () => {
    statsQuery.refetch();
    requestsQuery.refetch();
  };

  const stats = statsQuery.data;

  // Build ANC trend from facility stats trend data
  const ancChartData = useMemo(() => {
    if (!stats?.trend?.length) return [];
    return stats.trend.map((t) => ({
      month: t.week,
      attendance: t.anc,
      visits: Math.round(t.anc * 5), // approximate visit count
    }));
  }, [stats]);

  const allRequests: ServiceRequestResponse[] = requestsQuery.data?.content ?? [];

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allRequests;
    return allRequests.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [allRequests, search]);

  const lastUpdated = format(new Date(), "MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="relative space-y-6 pb-20">
      <PageHeader
        eyebrow="Facility Admin"
        title="KPI Dashboard"
        subtitle={`${organizationName} — Last updated: ${lastUpdated} (Refreshes every 5 mins)`}
        action={
          <Button
            className="h-10 rounded-full px-5"
            disabled={isFetching}
            onClick={refetchAll}
          >
            <RefreshCcw className={cn("size-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5B8784]" />
        <input
          type="text"
          placeholder="Search requests…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-full border bg-white pl-9 pr-4 text-sm text-[#1D5551] placeholder:text-[#5B8784] focus:outline-none focus:ring-2 focus:ring-[#2F7F7A]/30"
          style={{ borderColor: roleTheme.border }}
        />
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Activity}
          label="ANC Attendance Rate"
          value={stats ? `${stats.ancAttendance}%` : "—"}
          trend={stats ? (stats.ancAttendance >= 80 ? "up" : "down") : "neutral"}
          trendLabel={stats ? (stats.ancAttendance >= 80 ? "On target" : "Below target") : "Loading…"}
          goodDirection="up"
          sub="Target: 80%"
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
        />
        <StatCard
          icon={Users}
          label="Vaccination Coverage"
          value={stats ? `${stats.vaccinationCoverage}%` : "—"}
          trend={stats ? (stats.vaccinationCoverage >= 80 ? "up" : "down") : "neutral"}
          trendLabel={stats ? (stats.vaccinationCoverage >= 80 ? "On target" : "Below target") : "Loading…"}
          goodDirection="up"
          sub="Universal health standards"
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
        />
        <StatCard
          icon={Clock}
          label="No-Show Rate"
          value={stats ? `${stats.noShowRate}%` : "—"}
          trend={stats ? (stats.noShowRate < 10 ? "down" : "up") : "neutral"}
          trendLabel={stats ? (stats.noShowRate < 10 ? "Within range" : "Needs attention") : "Loading…"}
          goodDirection="down"
          sub="Missed appointments"
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
        />
        <StatCard
          icon={AlertCircle}
          label="Service Backlog"
          value={
            requestsQuery.isLoading
              ? "—"
              : String(allRequests.filter((r) => r.status === "PENDING").length)
          }
          trend="neutral"
          trendLabel="Pending requests"
          goodDirection="down"
          sub=""
          badge={
            allRequests.filter((r) => r.status === "PENDING").length > 0
              ? { text: "ACTION REQUIRED", variant: "action" }
              : undefined
          }
          roleTheme={roleTheme}
          loading={requestsQuery.isLoading}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* ANC Attendance Trend */}
        <div
          className="overflow-hidden rounded-3xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
            <h2 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              ANC Attendance Trend
            </h2>
            <p className="mt-0.5 text-xs text-[#5B8784]">Weekly visit data from facility records</p>
          </div>
          <div className="p-5">
            {statsQuery.isLoading ? (
              <div className="flex h-56 items-center justify-center">
                <RefreshCcw className="size-5 animate-spin text-[#5B8784]" />
              </div>
            ) : ancChartData.length > 0 ? (
              <AncAttendanceTrend data={ancChartData} />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-[#5B8784]">
                No trend data available.
              </div>
            )}
          </div>
        </div>

        {/* Coverage summary */}
        <div
          className="overflow-hidden rounded-3xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
            <h2 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              Coverage Summary
            </h2>
            <p className="mt-0.5 text-xs text-[#5B8784]">Overall facility KPIs</p>
          </div>
          <div className="p-5">
            {statsQuery.isLoading ? (
              <div className="flex h-56 items-center justify-center">
                <RefreshCcw className="size-5 animate-spin text-[#5B8784]" />
              </div>
            ) : stats ? (
              <div className="space-y-4">
                {[
                  { label: "ANC Attendance", value: stats.ancAttendance },
                  { label: "Vaccination Coverage", value: stats.vaccinationCoverage },
                  { label: "No-Show Rate (inverted)", value: Math.max(0, 100 - stats.noShowRate) },
                ].map(({ label, value }) => {
                  const color =
                    value >= 90 ? "#1D5052" : value >= 80 ? "#2F7F7A" : "#f59e0b";
                  return (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#1D5551]">{label}</span>
                        <span className="font-semibold" style={{ color }}>
                          {value}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4F4F1]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${value}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-[#5B8784]">
                No data available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Service Requests */}
      <section
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: roleTheme.border }}
        >
          <div>
            <h2 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              Recent Service Requests
            </h2>
            <p className="mt-0.5 text-xs text-[#5B8784]">Latest submissions from CHW network</p>
          </div>
          <a
            href="/service-requests"
            className="text-xs font-semibold hover:underline"
            style={{ color: roleTheme.accent }}
          >
            View All →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#F7FBFA] text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
                <th className="px-4 py-3 sm:px-5">Request ID</th>
                <th className="hidden px-5 py-3 sm:table-cell">Service Type</th>
                <th className="hidden px-5 py-3 md:table-cell">Date</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 text-right sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EEEC]">
              {requestsQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#5B8784]">
                    <RefreshCcw className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#5B8784]">
                    {search ? "No requests match your search." : "No service requests found."}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="transition-colors hover:bg-[#FAFCFB]">
                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="font-mono text-xs font-semibold text-[#1D5551]">
                        {req.id.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-[#54797C] sm:table-cell">
                      {req.serviceType.replace(/_/g, " ")}
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-[#54797C] md:table-cell">
                      {format(new Date(req.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <button
                        className="rounded-lg p-1.5 text-[#5B8784] transition-colors hover:bg-[#E4F4F1] hover:text-[#1D5551]"
                        title="Actions"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Floating action button — Register Mother */}
      <a
        href="/mothers/register"
        className="fixed bottom-24 right-5 z-50 grid size-14 place-items-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 lg:bottom-8 lg:right-8"
        style={{ backgroundColor: roleTheme.accent, color: "#fff" }}
        title="Register New Mother"
      >
        <Plus className="size-6" />
      </a>
    </div>
  );
}
