"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
  Building2,
  TrendingDown,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { queryKeys } from "@/shared/config/query-keys";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import {
  getFacilityStats,
  getFacilityNoShowHeatmap,
  type FacilityStatsDTO,
} from "@/lib/api/facility-stats";

// Canonical weekday list — single definition, API file uses its own local copy
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

type FacilityStatus = "ACTIVE" | "NEEDS_ATTENTION";

function getFacilityStatus(f: FacilityStatsDTO): FacilityStatus {
  if (f.noShowRate >= 15 || f.ancAttendance < 70 || f.vaccinationCoverage < 70) {
    return "NEEDS_ATTENTION";
  }
  return "ACTIVE";
}

function getMetricColor(value: number, reversed = false) {
  const good = reversed ? value < 10 : value >= 80;
  const mid = reversed ? value < 20 : value >= 60;
  if (good) return "text-emerald-600 font-semibold";
  if (mid) return "text-amber-600 font-semibold";
  return "text-red-600 font-semibold";
}

// ── Heatmap cell ───────────────────────────────────────────────────────────

function HeatmapCell({ value }: { value: number }) {
  const bg =
    value < 10
      ? "bg-[#DCFCE7] text-[#166534]"
      : value < 20
        ? "bg-[#FEF9C3] text-[#854D0E]"
        : value < 30
          ? "bg-[#FFEDD5] text-[#9A3412]"
          : "bg-[#FEE2E2] text-[#991B1B]";
  return (
    <div
      className={cn(
        "mx-auto flex h-10 w-16 items-center justify-center rounded-xl text-xs font-semibold transition-colors",
        bg,
      )}
    >
      {value}%
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FacilityStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle className="size-3" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <AlertTriangle className="size-3" />
      Needs Attention
    </span>
  );
}

// ── Summary KPI cards ──────────────────────────────────────────────────────

function SummaryCards({ facilities }: { facilities: FacilityStatsDTO[] }) {
  const { roleTheme } = useRole({ fallbackRole: "district_officer" });

  const stats = useMemo(() => {
    if (facilities.length === 0)
      return { avgAnc: 0, avgVax: 0, avgNoShow: 0, needsAttention: 0 };
    const n = facilities.length;
    return {
      avgAnc: Math.round(facilities.reduce((s, f) => s + f.ancAttendance, 0) / n),
      avgVax: Math.round(facilities.reduce((s, f) => s + f.vaccinationCoverage, 0) / n),
      avgNoShow: +(facilities.reduce((s, f) => s + f.noShowRate, 0) / n).toFixed(1),
      needsAttention: facilities.filter((f) => getFacilityStatus(f) === "NEEDS_ATTENTION").length,
    };
  }, [facilities]);

  const cards = [
    {
      label: "Facilities in Scope",
      value: String(facilities.length),
      icon: Building2,
      sub: "Sectors under your oversight",
      good: true,
    },
    {
      label: "Avg ANC Attendance",
      value: `${stats.avgAnc}%`,
      icon: Activity,
      sub: "District-wide average",
      good: stats.avgAnc >= 80,
    },
    {
      label: "Avg Vaccination Coverage",
      value: `${stats.avgVax}%`,
      icon: Activity,
      sub: "District-wide average",
      good: stats.avgVax >= 80,
    },
    {
      label: "Needs Attention",
      value: String(stats.needsAttention),
      icon: TrendingDown,
      sub: "Facilities below thresholds",
      good: stats.needsAttention === 0,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                  {card.label}
                </p>
                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: roleTheme.text }}
                >
                  {card.value}
                </p>
                <p className="mt-1 text-[11px] text-[#5B8784]">{card.sub}</p>
              </div>
              <div
                className="shrink-0 rounded-xl p-2.5"
                style={{
                  backgroundColor: card.good ? roleTheme.accentSoft : "#FEF2F2",
                  color: card.good ? roleTheme.accent : "#DC2626",
                }}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

// ── Skeleton / error states ────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#E5F3F2]" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-[#E5F3F2]" />
      <div className="h-80 animate-pulse rounded-xl bg-[#E5F3F2]" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="mb-3 size-10 text-red-300" />
      <p className="mb-1 text-sm font-medium text-[#54797C]">Failed to load dashboard data</p>
      <p className="mb-5 text-xs text-[#7BA09D]">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#3A8F85] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2d7870]"
      >
        <RefreshCcw className="size-3.5" />
        Retry
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function DistrictDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { organizationName } = useRole({ fallbackRole: "district_officer" });
  const geoScopeIds = session?.user?.geoScopeIds as string[] | undefined;

  const facilitiesQuery = useQuery({
    queryKey: [...queryKeys.facilityStats.list, geoScopeIds],
    queryFn: ({ signal }) => getFacilityStats(geoScopeIds, signal),
    refetchInterval: 5 * 60_000,
  });

  const heatmapQuery = useQuery({
    queryKey: [...queryKeys.facilityStats.heatmap, geoScopeIds],
    queryFn: ({ signal }) => getFacilityNoShowHeatmap(geoScopeIds, signal),
    refetchInterval: 5 * 60_000,
  });

  const facilities = facilitiesQuery.data ?? [];
  const heatmapData = useMemo(() => heatmapQuery.data ?? [], [heatmapQuery.data]);

  const criticalAlerts = useMemo(
    () =>
      heatmapData.flatMap((row) =>
        Object.entries(row.days)
          .filter(([, v]) => v >= 30)
          .map(([day, value]) => ({ facility: row.facilityName, day, value })),
      ),
    [heatmapData],
  );

  const isFetching = facilitiesQuery.isFetching || heatmapQuery.isFetching;
  const isLoading = facilitiesQuery.isLoading || heatmapQuery.isLoading;
  const isError = facilitiesQuery.isError || heatmapQuery.isError;

  const header = (
    <PageHeader
      title="District Performance Overview"
      subtitle={`Maternal health KPIs across all facilities — ${organizationName}`}
      action={
        <button
          onClick={() => {
            facilitiesQuery.refetch();
            heatmapQuery.refetch();
          }}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3A8F85] px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#2d7870] disabled:opacity-50"
        >
          <RefreshCcw className={cn("size-3.5", isFetching && "animate-spin")} />
          Refresh
        </button>
      }
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState
          message={
            facilitiesQuery.error?.message ??
            heatmapQuery.error?.message ??
            "Unknown error"
          }
          onRetry={() => {
            facilitiesQuery.refetch();
            heatmapQuery.refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      {/* Summary KPI cards */}
      <SummaryCards facilities={facilities} />

      {/* Facility summary table */}
      <section className="overflow-hidden rounded-2xl border border-[#CFE8E3] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#CFE8E3] px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-[#215C57]">
              Facility Performance Summary
            </h2>
            {facilities.length > 0 && (
              <p className="mt-0.5 text-xs text-[#5B8784]">
                {facilities.length} facilities in your scoped sectors
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FCFB]">
                {["Facility", "Sector", "ANC Attendance", "Vaccination Coverage", "No-Show Rate", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#5B8784]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CFE8E3]/50">
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#7BA09D]">
                    No facilities found for your scoped sectors.
                  </td>
                </tr>
              ) : (
                facilities.map((f) => {
                  const status = getFacilityStatus(f);
                  return (
                    <tr
                      key={f.id}
                      className="cursor-pointer transition-colors hover:bg-[#F8FCFB]"
                      onClick={() => router.push(`/facilities?id=${f.id}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#215C57] underline-offset-2 hover:underline">
                          {f.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#54797C]">{f.sector}</td>
                      <td className="px-6 py-4">
                        <span className={cn("text-sm", getMetricColor(f.ancAttendance))}>
                          {f.ancAttendance}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-sm", getMetricColor(f.vaccinationCoverage))}>
                          {f.vaccinationCoverage}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-sm", getMetricColor(f.noShowRate, true))}>
                          {f.noShowRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Heatmap + alerts */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="rounded-2xl border border-[#CFE8E3] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-[#215C57]">
              Weekly No-Show Intensity Heatmap
            </h2>
            <p className="mt-1 text-xs text-[#5B8784]">
              No-show rates by facility and day of week — current week
            </p>
          </div>

          {heatmapData.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#7BA09D]">
              No heatmap data available.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="w-32 pb-3 pr-4 text-left text-xs font-semibold text-[#5B8784]" />
                      {WEEKDAYS.map((d) => (
                        <th
                          key={d}
                          className="pb-3 text-center text-xs font-semibold text-[#5B8784]"
                        >
                          {d.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row) => (
                      <tr key={row.facilityId}>
                        <td className="py-1.5 pr-4 text-xs font-medium text-[#215C57]">
                          {row.facilityName}
                        </td>
                        {WEEKDAYS.map((day) => (
                          <td key={day} className="px-1 py-1.5 text-center">
                            <HeatmapCell value={row.days[day] ?? 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-[#5B8784]">Legend:</span>
                {[
                  { bg: "#DCFCE7", text: "#166534", label: "Low < 10%" },
                  { bg: "#FEF9C3", text: "#854D0E", label: "Moderate 10–20%" },
                  { bg: "#FFEDD5", text: "#9A3412", label: "High 20–30%" },
                  { bg: "#FEE2E2", text: "#991B1B", label: "Critical > 30%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: item.bg }} />
                    <span className="text-[11px] font-medium" style={{ color: item.text }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Alerts + insight panel */}
        <div className="space-y-4">
          {criticalAlerts.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs font-semibold text-red-800">
                    Critical Alert ({criticalAlerts.length})
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {criticalAlerts.map((a, i) => (
                      <p key={i} className="text-xs leading-relaxed text-red-700">
                        <span className="font-semibold">{a.facility}</span> — {a.day}:{" "}
                        <span className="font-bold">{a.value}%</span> no-show rate
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-[#E8F6F3] p-5">
            <p className="text-xs font-semibold text-[#215C57]">Recommended Action</p>
            <p className="mt-2 text-xs leading-relaxed text-[#2D6E70]">
              Facilities flagged as{" "}
              <span className="font-semibold">Needs Attention</span> have ANC below 70%,
              vaccination below 70%, or no-show rates above 15%. Visit or contact their
              admin to investigate.
            </p>
            <button
              onClick={() => router.push("/facilities")}
              className="mt-4 w-full rounded-xl bg-[#3A8F85] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2d7870]"
            >
              View All Facilities →
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
