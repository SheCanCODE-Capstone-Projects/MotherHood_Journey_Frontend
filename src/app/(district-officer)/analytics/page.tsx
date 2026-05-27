"use client";

import { PageHeader } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";
import { TrendingUp, Building2, Users, CheckCircle, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { roleTheme } = useRole({ fallbackRole: "district_officer" });

  const keyMetrics = [
    { label: "Total Facilities", value: "24", icon: Building2 },
    { label: "Active Mothers", value: "2,456", icon: Users },
    { label: "Coverage Rate", value: "89%", icon: CheckCircle, color: "#10B981" },
    { label: "At Risk Cases", value: "34", icon: AlertCircle, color: "#EF4444" },
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

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="District Officer"
        title="Analytics"
        subtitle="District health metrics and facility performance overview."
      />

      {/* Key Metrics */}
      <section className="grid gap-4 md:grid-cols-4">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-3xl border-2 bg-white p-5"
              style={{ borderColor: roleTheme.border }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: roleTheme.text }}
                  >
                    {metric.label}
                  </p>
                  <p
                    className="mt-2 text-3xl font-bold"
                    style={{ color: metric.color ?? roleTheme.accent }}
                  >
                    {metric.value}
                  </p>
                </div>
                <Icon className="size-6" style={{ color: metric.color ?? roleTheme.accent }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Key Trends */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>
          Key Trends
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {trends.map((trend) => (
            <div
              key={trend.metric}
              className="rounded-2xl border-2 p-5 bg-white"
              style={{ borderColor: roleTheme.border }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
                    {trend.metric}
                  </p>
                  <p className="mt-2 text-2xl font-bold" style={{ color: roleTheme.text }}>
                    {trend.current}
                  </p>
                  <p className="mt-1 text-sm text-[#5B8784]">Previous: {trend.previous}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      trend.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {trend.change}
                  </span>
                  <TrendingUp
                    className={`size-4 ${trend.positive ? "text-green-500" : "text-red-500"}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facility Performance */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>
          Facility Performance Ranking
        </h2>
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
          <div
            className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}
          >
            <div>Facility</div>
            <div>Mothers</div>
            <div>Coverage</div>
            <div>Visits</div>
            <div>Status</div>
          </div>
          <div className="divide-y" style={{ borderColor: roleTheme.border }}>
            {facilityPerformance.map((facility, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-4 px-5 py-4 items-center text-sm hover:bg-gray-50/60 transition-colors"
              >
                <div className="font-medium" style={{ color: roleTheme.text }}>
                  {facility.name}
                </div>
                <div className="text-gray-600">{facility.mothers}</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${facility.coverage}%`, backgroundColor: roleTheme.accent }}
                    />
                  </div>
                  <span style={{ color: roleTheme.text }}>{facility.coverage}%</span>
                </div>
                <div className="text-gray-600">{facility.visits}</div>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      facility.status === "Excellent"
                        ? "bg-green-100 text-green-700"
                        : facility.status === "Good"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {facility.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
