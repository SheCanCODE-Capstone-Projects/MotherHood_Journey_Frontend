"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  HeartPulse,
  Syringe,
  CalendarX,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { queryKeys } from "@/shared/config/query-keys";
import { cn } from "@/shared/lib/utils";
import {
  getFacilityStats,
  getFacilityStatsById,
  type FacilityStatsDTO,
} from "@/lib/api/facility-stats";

function getMetricColor(value: number, reversed = false) {
  const good = reversed ? value < 10 : value >= 80;
  const mid = reversed ? value < 20 : value >= 60;
  if (good) return "bg-emerald-50/80 text-emerald-700";
  if (mid) return "bg-amber-50/80 text-amber-700";
  return "bg-red-50/80 text-red-700";
}

function getMetricStatus(value: number, reversed = false) {
  const good = reversed ? value < 10 : value >= 80;
  const mid = reversed ? value < 20 : value >= 60;
  if (good) return "good";
  if (mid) return "mid";
  return "bad";
}

function Sparkline({
  data,
  color,
  height = 32,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const width = 80;
  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  label,
  value,
  trend,
  reversed = false,
  icon: Icon,
  data,
}: {
  label: string;
  value: number;
  trend: number;
  reversed?: boolean;
  icon: typeof HeartPulse;
  data: number[];
}) {
  const isGood = reversed ? trend < 0 : trend > 0;
  const TrendIcon = isGood ? TrendingUp : TrendingDown;
  const status = getMetricStatus(value, reversed);
  const borderColor =
    status === "good"
      ? "border-emerald-500"
      : status === "mid"
        ? "border-amber-500"
        : "border-red-500";
  return (
    <div className={cn("rounded-xl border-l-4 bg-white p-6 shadow-sm border-l-[3px] border-b border-b-[#E5F3F2] border-r border-r-[#E5F3F2] border-t border-t-[#E5F3F2]", borderColor)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-[#5B8784]">{label}</p>
        <Icon className="size-4 text-[#5B8784]" />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-[#1D5052]">{value}%</p>
          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isGood ? "bg-emerald-50/80 text-emerald-700" : "bg-red-50/80 text-red-700",
            )}
          >
            <TrendIcon className="size-3" />
            {Math.abs(trend)}% vs last period
          </div>
        </div>
        <Sparkline data={data} color={status === "good" ? "#10B981" : status === "mid" ? "#F59E0B" : "#EF4444"} />
      </div>
    </div>
  );
}

function TrendChart({
  data,
  metric,
  color,
}: {
  data: FacilityStatsDTO["trend"];
  metric: "anc" | "vax" | "noShow";
  color: string;
}) {
  const values = data.map((d) => d[metric]);
  const min = Math.floor(Math.min(...values) / 10) * 10;
  const max = Math.ceil(Math.max(...values) / 10) * 10;
  const padding = Math.max(5, (max - min) * 0.1);
  const chartMin = min - padding;
  const chartMax = max + padding;
  const width = 300;
  const height = 100;
  const toY = (v: number) => height - ((v - chartMin) / (chartMax - chartMin)) * height;
  const linePoints = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      return `${x},${toY(v)}`;
    })
    .join(" ");
  const areaPoints = `${0},${height} ${linePoints} ${width},${height}`;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
        <defs>
          <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${metric})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.map((v, i) => {
          const x = (i / (values.length - 1)) * width;
          return <circle key={i} cx={x} cy={toY(v)} r="3" fill={color} stroke="white" strokeWidth="1.5" />;
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map((d) => (
          <span key={d.week} className="text-[10px] text-[#5B8784]">{d.week}</span>
        ))}
      </div>
    </div>
  );
}

function FacilityDetailView({
  facility,
  onBack,
}: {
  facility: FacilityStatsDTO;
  onBack: () => void;
}) {
  const last = facility.trend[facility.trend.length - 1];
  const prev = facility.trend[facility.trend.length - 2];

  const type = facility.name.includes("HP") ? "HP" : facility.name.includes("HC") ? "HC" : "Facility";

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#5B8784] hover:text-[#1D5052] transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Facilities
      </button>

      <div className="rounded-xl border border-[#E5F3F2] bg-white overflow-hidden">
        <div className="flex items-start gap-5 p-6">
          <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#E8F6F3]">
            <span className="text-xs font-bold text-[#1D5052] tracking-tight leading-tight text-center">
              {type === "HC" ? "HC" : "HP"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-[#5B8784]">
              {facility.sector} Sector
            </p>
            <h1 className="mt-1 text-xl font-bold text-[#1D5052]">{facility.name}</h1>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[#5B8784]">Last 6 weeks</p>
            <p className="text-[10px] text-[#7BA09D]">
              Wk {facility.trend[0].week.split(" ")[1]} – {facility.trend[facility.trend.length - 1].week.split(" ")[1]}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="ANC Attendance"
          value={facility.ancAttendance}
          trend={last.anc - prev.anc}
          icon={HeartPulse}
          data={facility.trend.map((d) => d.anc)}
        />
        <StatCard
          label="Vaccination Coverage"
          value={facility.vaccinationCoverage}
          trend={last.vax - prev.vax}
          icon={Syringe}
          data={facility.trend.map((d) => d.vax)}
        />
        <StatCard
          label="No-Show Rate"
          value={facility.noShowRate}
          trend={last.noShow - prev.noShow}
          reversed
          icon={CalendarX}
          data={facility.trend.map((d) => d.noShow)}
        />
      </div>

      <div className="rounded-xl border border-[#E5F3F2] bg-white p-6">
        <h2 className="text-sm font-semibold text-[#1D5052] mb-6">
          Weekly Performance Trend — Last 6 Weeks
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {(
            [
              { key: "anc" as const, label: "ANC Attendance", color: "#1D5052" },
              { key: "vax" as const, label: "Vaccination Coverage", color: "#2A7F8A" },
              { key: "noShow" as const, label: "No-Show Rate", color: "#E07B54" },
            ]
          ).map((item) => (
            <div key={item.key}>
              <p className="text-xs font-medium text-[#5B8784] mb-1">{item.label}</p>
              <TrendChart data={facility.trend} metric={item.key} color={item.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FacilitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const geoScopeIds = session?.user?.geoScopeIds;

  const selectedId = searchParams.get("id");
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

  const activeId = selectedId ?? localSelectedId;

  const facilitiesQuery = useQuery({
    queryKey: [...queryKeys.facilityStats.list, geoScopeIds],
    queryFn: ({ signal }) => getFacilityStats(geoScopeIds, signal),
  });

  const detailQuery = useQuery({
    queryKey: [...queryKeys.facilityStats.detail(activeId ?? ""), activeId],
    queryFn: ({ signal }) => getFacilityStatsById(activeId!, signal),
    enabled: !!activeId,
  });

  const facilities = facilitiesQuery.data ?? [];
  const selectedFacility = activeId ? detailQuery.data ?? null : null;

  const handleSelect = (id: string) => {
    setLocalSelectedId(id);
  };

  const handleBack = () => {
    setLocalSelectedId(null);
    if (selectedId) {
      router.push("/facilities");
    }
  };

  if (activeId) {
    if (detailQuery.isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-5 w-32 bg-[#E5F3F2] rounded" />
          <div className="h-24 bg-[#E5F3F2] rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#E5F3F2] rounded-xl" />
            ))}
          </div>
        </div>
      );
    }

    if (!selectedFacility) {
      return (
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5B8784] hover:text-[#1D5052] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Facilities
          </button>
          <div className="rounded-xl border border-[#E5F3F2] bg-white p-6 text-center py-12">
            <p className="text-sm text-[#54797C]">Facility not found.</p>
          </div>
        </div>
      );
    }

    return (
      <FacilityDetailView
        facility={selectedFacility}
        onBack={handleBack}
      />
    );
  }

  if (facilitiesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Facilities"
          subtitle="View and manage all facilities in your district."
        />
        <div className="rounded-xl border border-[#E5F3F2] bg-white overflow-hidden">
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 flex-1 bg-[#E5F3F2] rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facilities"
        subtitle="Click a facility to view detailed stats."
        action={
          <button
            onClick={() => facilitiesQuery.refetch()}
            disabled={facilitiesQuery.isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D5052] px-4 py-2 text-xs font-medium text-white hover:bg-[#174042] transition-colors disabled:opacity-50"
          >
            <RefreshCcw
              className={cn("size-3.5", facilitiesQuery.isFetching && "animate-spin")}
            />
            Refresh
          </button>
        }
      />

      <div className="rounded-xl border border-[#E5F3F2] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FCFB]">
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
                Facility Name
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
                Sector
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
                ANC Attendance
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
                Vaccination Coverage
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
                No-Show Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5F3F2]/60">
            {facilities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#7BA09D]">
                  No facilities found for your scoped sectors.
                </td>
              </tr>
            ) : (
              facilities.map((f) => (
                <tr
                  key={f.id}
                  className="hover:bg-[#F8FCFB]/80 cursor-pointer transition-colors"
                  onClick={() => handleSelect(f.id)}
                >
                  <td className="px-6 py-4 font-medium text-[#1D5052] hover:underline decoration-1 underline-offset-2">
                    {f.name}
                  </td>
                  <td className="px-6 py-4 text-[#54797C]">{f.sector}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getMetricColor(f.ancAttendance),
                      )}
                    >
                      {f.ancAttendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getMetricColor(f.vaccinationCoverage),
                      )}
                    >
                      {f.vaccinationCoverage}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getMetricColor(f.noShowRate, true),
                      )}
                    >
                      {f.noShowRate}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FacilitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-24 bg-[#E5F3F2] rounded-xl" />
          <div className="h-64 bg-[#E5F3F2] rounded-xl" />
        </div>
      }
    >
      <FacilitiesContent />
    </Suspense>
  );
}
