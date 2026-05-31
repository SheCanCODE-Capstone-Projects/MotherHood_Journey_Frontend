"use client";

import { AlertCircle, Building2, CheckCircle, TrendingDown, TrendingUp, Users, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";

type MetricCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "success" | "danger";
};

const keyMetrics: MetricCard[] = [
  { label: "Total Facilities", value: "24", icon: Building2 },
  { label: "Active Mothers", value: "2,456", icon: Users },
  { label: "Coverage Rate", value: "89%", icon: CheckCircle, tone: "success" },
  { label: "At Risk Cases", value: "34", icon: AlertCircle, tone: "danger" },
];

const facilityPerformance = [
  { name: "Nyamata Health Center", mothers: 342, coverage: 94, status: "Excellent", visits: 234 },
  { name: "Kicukiro Health Center", mothers: 289, coverage: 87, status: "Good", visits: 198 },
  { name: "Mbuye Health Clinic", mothers: 156, coverage: 76, status: "Fair", visits: 112 },
  { name: "Kanombe Health Post", mothers: 234, coverage: 91, status: "Excellent", visits: 178 },
  { name: "Bugesera Health Center", mothers: 198, coverage: 82, status: "Good", visits: 145 },
];

const trends = [
  { metric: "Maternal Coverage", current: "89%", previous: "84%", change: "+5%", positive: true },
  { metric: "Child Immunization", current: "92%", previous: "89%", change: "+3%", positive: true },
  { metric: "Dropout Rate", current: "8%", previous: "12%", change: "-4%", positive: true },
  { metric: "Complication Rate", current: "2.1%", previous: "2.3%", change: "-0.2%", positive: true },
];

const statusStyles: Record<string, string> = {
  Excellent: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Good: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Fair: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export default function AnalyticsPage() {
  const roleTheme = ROLE_THEMES.district_officer;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="District command"
        title="Analytics"
        subtitle="District health metrics and facility performance analytics."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          const color =
            metric.tone === "success"
              ? "#10B981"
              : metric.tone === "danger"
                ? "#EF4444"
                : roleTheme.accent;

          return (
            <article
              key={metric.label}
              className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-30px_rgba(22,63,66,0.75)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#163F42]">
                    {metric.value}
                  </p>
                </div>
                <div className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[#E1F2EF]" style={{ color }}>
                  <Icon className="size-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {trends.map((trend) => {
          const Icon = trend.change.startsWith("-") ? TrendingDown : TrendingUp;

          return (
            <article key={trend.metric} className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#163F42]">{trend.metric}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#163F42]">{trend.current}</p>
                  <p className="mt-1 text-sm text-[#648386]">Previous: {trend.previous}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-[8px] bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <Icon className="size-3.5" />
                  {trend.change}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">
              Facility ranking
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#163F42]">
              Facility Performance
            </h2>
          </div>
          <div className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[#E1F2EF] text-[#226D68]">
            <Building2 className="size-5" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#D5E7E4]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[#F7FBFA] text-xs uppercase tracking-[0.14em] text-[#4B6F6D]">
                <tr>
                  <th className="px-4 py-3">Facility</th>
                  <th className="px-4 py-3">Mothers</th>
                  <th className="px-4 py-3">Coverage</th>
                  <th className="px-4 py-3">Visits</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9F2F1] bg-white">
                {facilityPerformance.map((facility) => (
                  <tr key={facility.name} className="transition hover:bg-[#F4FBFA]">
                    <td className="px-4 py-4 font-medium text-[#163F42]">{facility.name}</td>
                    <td className="px-4 py-4 text-[#54797C]">{facility.mothers}</td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-32 items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-[#D5E7E4]">
                          <div className="h-full rounded-full bg-[#226D68]" style={{ width: `${facility.coverage}%` }} />
                        </div>
                        <span className="font-medium text-[#163F42]">{facility.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#54797C]">{facility.visits}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-[8px] px-2.5 py-1 text-xs font-semibold ${statusStyles[facility.status]}`}>
                        {facility.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
