"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
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

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_STATS = {
  ancAttendanceRate: 88,
  ancTarget: 90,
  ancFacilityLabel: "Kigali Clinic",
  vaccinationCoverage: 92,
  noShowRate: 5.0,
  noShowPrev: 5.5,
  serviceRequestBacklog: 12,
};

const MOCK_ANC_DATA = [
  { month: "Jun 2025", attendance: 72, visits: 390 },
  { month: "Jul 2025", attendance: 75, visits: 412 },
  { month: "Aug 2025", attendance: 68, visits: 368 },
  { month: "Sep 2025", attendance: 79, visits: 462 },
  { month: "Oct 2025", attendance: 83, visits: 495 },
  { month: "Nov 2025", attendance: 80, visits: 470 },
  { month: "Dec 2025", attendance: 77, visits: 440 },
  { month: "Jan 2026", attendance: 84, visits: 510 },
  { month: "Feb 2026", attendance: 88, visits: 540 },
  { month: "Mar 2026", attendance: 85, visits: 520 },
  { month: "Apr 2026", attendance: 90, visits: 560 },
  { month: "May 2026", attendance: 88, visits: 535 },
];

const MOCK_VACCINATION_DATA = [
  { vaccineType: "BCG", coverage: 99 },
  { vaccineType: "Polio (OPV)", coverage: 94 },
  { vaccineType: "Measles", coverage: 89 },
  { vaccineType: "Tetanus (Td)", coverage: 82 },
  { vaccineType: "DPT-HepB-Hib", coverage: 88 },
  { vaccineType: "Rotavirus", coverage: 80 },
];

const MOCK_SERVICE_REQUESTS = [
  {
    id: "SR-001",
    patientName: "Grace Mukamana",
    initials: "GM",
    avatarColor: "#1D5052",
    type: "ANC Follow-up",
    requestedBy: "Jean Bosco N.",
    requestedByLocation: "Kacyiru Sector",
    createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    status: "PENDING" as const,
  },
  {
    id: "SR-002",
    patientName: "Marie Uwase",
    initials: "MU",
    avatarColor: "#2F7F7A",
    type: "Vaccination",
    requestedBy: "Alice Ingabire",
    requestedByLocation: "Kimihurura CHW",
    createdAt: new Date(Date.now() - 4 * 3_600_000).toISOString(),
    status: "VERIFIED" as const,
  },
  {
    id: "SR-003",
    patientName: "Jeanne d'Arc Umutoni",
    initials: "JU",
    avatarColor: "#085041",
    type: "Postnatal Check",
    requestedBy: "Paul Ntwali",
    requestedByLocation: "Gisozi Sector",
    createdAt: new Date(Date.now() - 6 * 3_600_000).toISOString(),
    status: "COMPLETED" as const,
  },
  {
    id: "SR-004",
    patientName: "Emilie Nyiraneza",
    initials: "EN",
    avatarColor: "#b45309",
    type: "Emergency Consultation",
    requestedBy: "Rose Mukeshimana",
    requestedByLocation: "Nyamirambo CHW",
    createdAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    status: "URGENT" as const,
  },
  {
    id: "SR-005",
    patientName: "Claire Umulisa",
    initials: "CU",
    avatarColor: "#4338ca",
    type: "Laboratory Tests",
    requestedBy: "Eric Habimana",
    requestedByLocation: "Remera Sector",
    createdAt: new Date(Date.now() - 10 * 3_600_000).toISOString(),
    status: "PENDING" as const,
  },
];

// ── Status badge ───────────────────────────────────────────────────────────

type RequestStatus = "PENDING" | "VERIFIED" | "URGENT" | "COMPLETED";

const STATUS_STYLES: Record<RequestStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  URGENT: "bg-red-50 text-red-700 border border-red-200",
  COMPLETED: "bg-slate-50 text-slate-600 border border-slate-200",
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

// ── Vaccination progress bars ──────────────────────────────────────────────

function VaccinationProgressBars({
  data,
}: {
  data: { vaccineType: string; coverage: number }[];
}) {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = item.coverage;
        const barColor =
          pct >= 90 ? "#1D5052" : pct >= 80 ? "#2F7F7A" : "#f59e0b";
        return (
          <div key={item.vaccineType}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-[#1D5551]">{item.vaccineType}</span>
              <span className="font-semibold" style={{ color: barColor }}>
                {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4F4F1]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
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
  const trendColor = trend === "neutral" ? "text-slate-500" : isGood ? "text-emerald-600" : "text-red-500";

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
  const facilityId = "1";
  const [search, setSearch] = useState("");

  const [dateRange] = useState({
    start: startOfMonth(subMonths(new Date(), 11)),
    end: endOfMonth(new Date()),
  });

  const statsQuery = useQuery({
    queryKey: ["facility-admin", "stats", facilityId],
    queryFn: async () => MOCK_STATS,
    refetchInterval: 5 * 60_000,
  });

  const ancQuery = useQuery({
    queryKey: ["facility-admin", "anc", facilityId, dateRange],
    queryFn: async () => MOCK_ANC_DATA,
    refetchInterval: 5 * 60_000,
  });

  const vaccinationQuery = useQuery({
    queryKey: ["facility-admin", "vaccination", facilityId],
    queryFn: async () => MOCK_VACCINATION_DATA,
    refetchInterval: 5 * 60_000,
  });

  const requestsQuery = useQuery({
    queryKey: ["facility-admin", "service-requests-recent", facilityId],
    queryFn: async () => MOCK_SERVICE_REQUESTS,
    refetchInterval: 5 * 60_000,
  });

  const isFetching =
    statsQuery.isFetching ||
    ancQuery.isFetching ||
    vaccinationQuery.isFetching ||
    requestsQuery.isFetching;

  const refetchAll = () => {
    statsQuery.refetch();
    ancQuery.refetch();
    vaccinationQuery.refetch();
    requestsQuery.refetch();
  };

  const stats = statsQuery.data;

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase();
    return (requestsQuery.data ?? []).filter(
      (r) =>
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.requestedBy.toLowerCase().includes(q),
    );
  }, [requestsQuery.data, search]);

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
          placeholder="Search patients, requests…"
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
          value={stats ? `${stats.ancAttendanceRate}%` : "—"}
          trend="up"
          trendLabel="+4.2% vs last month"
          goodDirection="up"
          sub={`Target: ${stats?.ancTarget ?? 90}% for ${stats?.ancFacilityLabel ?? organizationName}`}
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
        />
        <StatCard
          icon={Users}
          label="Vaccination Coverage"
          value={stats ? `${stats.vaccinationCoverage}%` : "—"}
          trend="up"
          trendLabel="+1.8% vs last month"
          goodDirection="up"
          sub="Universal health standards met"
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
        />
        <StatCard
          icon={Clock}
          label="No-Show Rate"
          value={stats ? `${stats.noShowRate}%` : "—"}
          trend="down"
          trendLabel={`-0.5% (down from ${stats?.noShowPrev ?? 5.5}% last month)`}
          goodDirection="down"
          sub="Missed appointments (last 30 days)"
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
        />
        <StatCard
          icon={AlertCircle}
          label="Service Backlog"
          value={stats ? String(stats.serviceRequestBacklog) : "—"}
          trend="neutral"
          trendLabel="Needs attention"
          goodDirection="down"
          sub=""
          badge={{ text: "ACTION REQUIRED", variant: "action" }}
          roleTheme={roleTheme}
          loading={statsQuery.isLoading}
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
            <p className="mt-0.5 text-xs text-[#5B8784]">Monthly visit counts — last 12 months</p>
          </div>
          <div className="p-5">
            {ancQuery.isLoading ? (
              <div className="flex h-56 items-center justify-center">
                <RefreshCcw className="size-5 animate-spin text-[#5B8784]" />
              </div>
            ) : (
              <AncAttendanceTrend data={ancQuery.data ?? []} />
            )}
          </div>
        </div>

        {/* Vaccination Coverage */}
        <div
          className="overflow-hidden rounded-3xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
            <h2 className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              Coverage by Vaccine Type
            </h2>
            <p className="mt-0.5 text-xs text-[#5B8784]">EPI schedule — current coverage rates</p>
          </div>
          <div className="p-5">
            {vaccinationQuery.isLoading ? (
              <div className="flex h-56 items-center justify-center">
                <RefreshCcw className="size-5 animate-spin text-[#5B8784]" />
              </div>
            ) : (
              <VaccinationProgressBars data={vaccinationQuery.data ?? []} />
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
            View All Requests →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#F7FBFA] text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
                <th className="px-4 py-3 sm:px-5">Patient</th>
                <th className="hidden px-5 py-3 sm:table-cell">Service Type</th>
                <th className="hidden px-5 py-3 lg:table-cell">Requested By</th>
                <th className="hidden px-5 py-3 md:table-cell">Date & Time</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 text-right sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EEEC]">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="transition-colors hover:bg-[#FAFCFB]">
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: req.avatarColor }}
                      >
                        {req.initials}
                      </div>
                      <span className="font-medium" style={{ color: roleTheme.text }}>
                        {req.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-[#54797C] sm:table-cell">{req.type}</td>
                  <td className="hidden px-5 py-3.5 lg:table-cell">
                    <div className="text-xs">
                      <p className="font-medium text-[#1D5551]">{req.requestedBy}</p>
                      <p className="text-[#5B8784]">{req.requestedByLocation}</p>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-xs text-[#54797C] md:table-cell">
                    {format(new Date(req.createdAt), "MMM d, yyyy")}
                    <br />
                    <span className="text-[#5B8784]">
                      {format(new Date(req.createdAt), "h:mm a")}
                    </span>
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
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center text-sm text-[#5B8784]"
                  >
                    No requests match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Floating action button */}
      <button
        className="fixed bottom-24 right-5 z-50 grid size-14 place-items-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 lg:bottom-8 lg:right-8"
        style={{ backgroundColor: roleTheme.accent, color: "#fff" }}
        title="New Service Request"
      >
        <Plus className="size-6" />
      </button>
    </div>
  );
}
