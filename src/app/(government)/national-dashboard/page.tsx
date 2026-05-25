"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/config/query-keys";
import { cn } from "@/shared/lib/utils";
import { RwandaChoropleth } from "@/components/charts/RwandaChoropleth";
import {
  getNationalDashboardMetrics,
  type DashboardMetric,
  type ProvinceId,
  type ProvinceMetricData,
  type NationalDashboardData,
} from "@/lib/api/government";

const METRICS: { id: DashboardMetric; label: string }[] = [
  { id: "vaccination_coverage", label: "Vaccination Coverage" },
  { id: "anc_attendance", label: "ANC Attendance" },
  { id: "birth_registration", label: "Birth Registration Rate" },
];

const PERIODS = [
  { id: "Q1-2026", label: "Q1 2026" },
  { id: "Q2-2026", label: "Q2 2026" },
  { id: "FY-2025-26", label: "FY 2025-26" },
  { id: "CY-2025", label: "CY 2025" },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function GovernmentDashboardPage() {
  const [metric, setMetric] = useState<DashboardMetric>("vaccination_coverage");
  const [period, setPeriod] = useState("Q2-2026");
  const [selectedProvince, setSelectedProvince] = useState<ProvinceId | null>(null);

  const dashboardQuery = useQuery({
    queryKey: [...queryKeys.government.analytics, metric, period],
    queryFn: () => getNationalDashboardMetrics(metric, period),
  });

  const data = dashboardQuery.data;

  const metricLabel = METRICS.find((m) => m.id === metric)?.label ?? metric;

  const stats = useMemo(() => {
    if (!data) return null;
    return [
      { label: "Total Population", value: formatNumber(data.national.totalPopulation) },
      { label: "Target Population", value: formatNumber(data.national.targetPopulation) },
      {
        label: "Vaccination Coverage",
        value: `${data.national.vaccinationCoverage.toFixed(1)}%`,
        highlight: metric === "vaccination_coverage",
      },
      {
        label: "ANC Attendance",
        value: `${data.national.ancAttendance.toFixed(1)}%`,
        highlight: metric === "anc_attendance",
      },
      {
        label: "Birth Registration",
        value: `${data.national.birthRegistrationRate.toFixed(1)}%`,
        highlight: metric === "birth_registration",
      },
      {
        label: "Total Vaccinated",
        value: formatNumber(data.national.totalVaccinated),
        sub: "doses administered",
      },
      {
        label: "ANC Visits",
        value: formatNumber(data.national.totalAncVisits),
        sub: "this period",
      },
      {
        label: "Birth Registrations",
        value: formatNumber(data.national.totalBirthRegistrations),
        sub: "this period",
      },
    ];
  }, [data, metric]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Government"
        title="National Dashboard"
        subtitle="Rwanda health metrics overview across all provinces."
        action={
          <Button
            className="h-10 rounded-full px-5"
            disabled={dashboardQuery.isFetching}
            onClick={() => dashboardQuery.refetch()}
          >
            <RefreshCcw
              className={cn("size-4", dashboardQuery.isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        }
      />

      <section className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5B8784]">
            Metric
          </span>
          <div className="flex rounded-lg border border-[#D5E9E6] overflow-hidden">
            {METRICS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMetric(m.id);
                  setSelectedProvince(null);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  metric === m.id
                    ? "bg-[#1D5052] text-white"
                    : "bg-white text-[#54797C] hover:bg-[#F8FCFB]",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5B8784]">
            Period
          </span>
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setSelectedProvince(null);
            }}
            className="rounded-lg border border-[#D5E9E6] bg-white px-3 py-1.5 text-xs font-medium text-[#1D5052] focus:outline-none focus:ring-2 focus:ring-[#1D5052]/20"
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {data && (
          <span className="text-xs text-[#5B8784] ml-auto">
            Last updated: {new Date(data.lastUpdated).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#1D5052]">
              {selectedProvince
                ? `${selectedProvince.charAt(0).toUpperCase() + selectedProvince.slice(1)} Province — District Level`
                : `Rwanda — ${metricLabel} by Province`}
            </h2>
            {!dashboardQuery.isFetching && data && (
              <span className="text-xs text-[#5B8784]">
                National avg:{" "}
                <strong className="text-[#1D5052]">
                  {(
                    data.provinces.reduce((a, b) => a + b.value, 0) /
                    data.provinces.length
                  ).toFixed(1)}
                  %
                </strong>
              </span>
            )}
          </div>

          {dashboardQuery.isLoading ? (
            <div className="flex items-center justify-center py-24 text-sm text-[#54797C]">
              <RefreshCcw className="size-5 mr-2 animate-spin" />
              Loading dashboard data...
            </div>
          ) : data ? (
            <RwandaChoropleth
              provinces={data.provinces}
              metricLabel={metricLabel}
              selectedProvince={selectedProvince}
              onProvinceClick={setSelectedProvince}
              drillDown={selectedProvince !== null}
            />
          ) : (
            <div className="flex items-center justify-center py-24 text-sm text-[#54797C]">
              No data available for the selected period.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784] mb-4">
              National Totals
            </h3>
            {dashboardQuery.isLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#54797C]">
                <RefreshCcw className="size-4 mr-2 animate-spin" />
                Loading...
              </div>
            ) : stats ? (
              <div className="space-y-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={cn(
                      "rounded-xl border px-4 py-3 transition-colors",
                      "highlight" in s && s.highlight
                        ? "border-[#1D5052]/30 bg-[#F2F8F7]"
                        : "border-[#E5F3F2] bg-white",
                    )}
                  >
                    <div className="text-xs font-medium text-[#54797C]">
                      {s.label}
                    </div>
                    <div className="mt-0.5 text-lg font-bold text-[#1D5052]">
                      {s.value}
                    </div>
                    {"sub" in s && s.sub ? (
                      <div className="text-[10px] text-[#5B8784]">{s.sub}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-[#54797C]">
                No data
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#D5E9E6] bg-[#F2F8F7] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1D5052] flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  viewBox="0 0 20 20"
                  fill="white"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1D5052] mb-1">
                  About this data
                </div>
                <div className="text-[11px] leading-relaxed text-[#54797C]">
                  Data is aggregated from HMIS reports submitted by health facilities
                  across all 30 districts. Click a province to drill down to
                  district-level metrics.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
