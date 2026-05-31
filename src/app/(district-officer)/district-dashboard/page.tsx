"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { queryKeys } from "@/shared/config/query-keys";
import { cn } from "@/shared/lib/utils";
import {
  getFacilityStats,
  getFacilityNoShowHeatmap,
  type FacilityStatsDTO,
} from "@/lib/api/facility-stats";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
  if (good) return "text-emerald-600 font-medium";
  if (mid) return "text-amber-600 font-medium";
  return "text-red-600 font-medium";
}

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
        "mx-auto flex h-10 w-18 items-center justify-center rounded-xl text-xs font-semibold transition-colors",
        bg,
      )}
    >
      {value}%
    </div>
  );
}

function StatusBadge({ status }: { status: FacilityStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/80 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle className="size-3" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50/80 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <AlertTriangle className="size-3" />
      Needs Attention
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E5F3F2] bg-white overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5F3F2]">
          <div className="h-5 w-48 bg-[#E5F3F2] rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-4 flex-1 bg-[#E5F3F2] rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="h-80 bg-[#E5F3F2] rounded-xl animate-pulse" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="size-10 text-red-300 mb-3" />
      <p className="text-sm font-medium text-[#54797C] mb-1">Failed to load dashboard data</p>
      <p className="text-xs text-[#7BA09D] mb-5">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D5052] px-4 py-2 text-xs font-medium text-white hover:bg-[#174042] transition-colors"
      >
        <RefreshCcw className="size-3.5" />
        Retry
      </button>
    </div>
  );
}

export default function DistrictDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const geoScopeIds = session?.user?.geoScopeIds;

  const facilitiesQuery = useQuery({
    queryKey: [...queryKeys.facilityStats.list, geoScopeIds],
    queryFn: ({ signal }) => getFacilityStats(geoScopeIds, signal),
  });

  const heatmapQuery = useQuery({
    queryKey: [...queryKeys.facilityStats.heatmap, geoScopeIds],
    queryFn: ({ signal }) => getFacilityNoShowHeatmap(geoScopeIds, signal),
  });

  const facilities = facilitiesQuery.data ?? [];
  const heatmapData = useMemo(() => heatmapQuery.data ?? [], [heatmapQuery.data]);

  const criticalAlerts = useMemo(
    () =>
      heatmapData.flatMap((row) =>
        Object.entries(row.days)
          .filter(([, v]) => v >= 30)
          .map(([day, value]) => ({
            facility: row.facilityName,
            day,
            value,
          })),
      ),
    [heatmapData],
  );

  const isLoading = facilitiesQuery.isLoading || heatmapQuery.isLoading;
  const isError = facilitiesQuery.isError || heatmapQuery.isError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="District Officer"
          title="District Performance Overview"
          subtitle="Summarised maternal health KPIs across your scoped sectors."
        />
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="District Officer"
          title="District Performance Overview"
          subtitle="Summarised maternal health KPIs across your scoped sectors."
        />
        <ErrorState
          message={facilitiesQuery.error?.message ?? heatmapQuery.error?.message ?? "Unknown error"}
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
      <PageHeader
        eyebrow="District Officer"
        title="District Performance Overview"
        subtitle="Summarised maternal health KPIs across your scoped sectors."
        action={
          <button
            onClick={() => {
              facilitiesQuery.refetch();
              heatmapQuery.refetch();
            }}
            disabled={facilitiesQuery.isFetching || heatmapQuery.isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D5052] px-4 py-2 text-xs font-medium text-white hover:bg-[#174042] transition-colors disabled:opacity-50"
          >
            <RefreshCcw
              className={cn(
                "size-3.5",
                (facilitiesQuery.isFetching || heatmapQuery.isFetching) && "animate-spin",
              )}
            />
            Refresh
          </button>
        }
      />

      <section className="overflow-hidden rounded-xl border border-[#D9ECE9] bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              District Command Center
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#1D5052]">
              Coordinating facility performance across the district
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#54797C]">
              Review sector-level maternal health signals, spot facilities that
              need support, and keep district teams aligned around timely care.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#E8F6F3] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5B8784]">
                  Scope
                </p>
                <p className="mt-1 text-sm font-bold text-[#1D5052]">District facilities</p>
              </div>
              <div className="rounded-xl bg-[#FFF7E8] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A6B18]">
                  Focus
                </p>
                <p className="mt-1 text-sm font-bold text-[#6F4A10]">No-show risk</p>
              </div>
              <div className="rounded-xl bg-[#EEF5FF] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4267A8]">
                  Reporting
                </p>
                <p className="mt-1 text-sm font-bold text-[#24487F]">Weekly trends</p>
              </div>
            </div>
          </div>
          <div className="relative min-h-64 border-t border-[#D9ECE9] lg:border-l lg:border-t-0">
            <Image
              src="/images/appointment-header.svg"
              alt="District office building"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5F3F2] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5F3F2]">
          <h2 className="text-sm font-semibold text-[#1D5052]">
            Facility Performance Summary
            {facilities.length > 0 && (
              <span className="ml-2 text-xs font-normal text-[#5B8784]">
                ({facilities.length} facilities)
              </span>
            )}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FCFB]">
                {["Facility Name", "Sector", "ANC Attendance", "Vaccination Coverage", "No-Show Rate", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B8784]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5F3F2]/60">
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
                      className="hover:bg-[#F8FCFB]/80 cursor-pointer transition-colors"
                      onClick={() => router.push(`/facilities?id=${f.id}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-[#1D5052] hover:underline decoration-1 underline-offset-2">
                          {f.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#54797C] text-xs">{f.sector}</td>
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

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="rounded-xl border border-[#E5F3F2] bg-white p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-[#1D5052]">Weekly No-Show Intensity</h2>
            <p className="text-xs text-[#5B8784] mt-1">
              Patterns of missed appointments by facility across the current week.
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
                      <th className="text-left pb-3 pr-4 text-xs font-semibold text-[#5B8784] w-28" />
                      {WEEKDAYS.map((d) => (
                        <th
                          key={d}
                          className="pb-3 text-xs font-semibold text-[#5B8784] text-center"
                        >
                          {d.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row) => (
                      <tr key={row.facilityId}>
                        <td className="pr-4 py-1.5 text-xs font-medium text-[#1D5052] whitespace-nowrap">
                          {row.facilityName}
                        </td>
                        {WEEKDAYS.map((day) => (
                          <td key={day} className="py-1.5 px-1 text-center">
                            <HeatmapCell value={row.days[day] ?? 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center gap-1 flex-wrap">
                <span className="text-xs font-medium text-[#5B8784] mr-2">
                  Legend
                </span>
                {[
                  { bg: "#FEE2E2", text: "#991B1B", label: "Critical (>30%)" },
                  { bg: "#FFEDD5", text: "#9A3412", label: "High (20–30%)" },
                  { bg: "#FEF9C3", text: "#854D0E", label: "Moderate (10–20%)" },
                  { bg: "#DCFCE7", text: "#166534", label: "Low (0–10%)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 mr-3">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.bg }}
                    />
                    <span className="text-[11px] font-medium" style={{ color: item.text }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="space-y-4">
          {criticalAlerts.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Critical Alert</p>
                  {criticalAlerts.map((a, i) => (
                    <p key={i} className="text-xs text-red-600 mt-1.5 leading-relaxed">
                      <span className="font-semibold">{a.facility}</span> showing critical
                      absenteeism rates exceeding 30% on {a.day}.
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-[#F4FBFA] p-5">
            <p className="text-xs font-semibold text-[#1D5052] mb-2">Health Insight</p>
            <p className="text-xs text-[#2D6E70] leading-relaxed">
              Review facilities flagged as{" "}
              <span className="font-medium">Needs Attention</span> and take corrective action
              to improve maternal health outcomes.
            </p>
            <button
              onClick={() => router.push("/analytics")}
              className="mt-4 w-full rounded-lg bg-[#1D5052] px-3 py-2 text-xs font-medium text-white hover:bg-[#174042] transition-colors"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
