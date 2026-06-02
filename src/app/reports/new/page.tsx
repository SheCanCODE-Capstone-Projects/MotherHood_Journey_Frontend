"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, BarChart3, ArrowLeft } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { useRole } from "@/shared/hooks/useRole";

const AVAILABLE_METRICS = [
  "ANC coverage",
  "Vaccination coverage",
  "Facility attendance",
  "Referral completion",
  "Service request turnaround",
  "Sync success rate",
];

export default function NewCustomReportPage() {
  const router = useRouter();
  const { role } = useRole();
  const roleTheme = role === "government" ? ROLE_THEMES.government : ROLE_THEMES.facility_admin;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: roleTheme.text }}
      >
        <ArrowLeft className="size-4" />
        Back to Reports
      </button>

      <PageHeader
        title="Create Custom Report"
        subtitle="Choose metrics and a date range to generate a tailored report."
      />

      <section className="rounded-2xl border-2 bg-white p-6" style={{ borderColor: roleTheme.border }}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Report name
              </label>
              <input
                type="text"
                defaultValue="Custom government report"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Date range
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  defaultValue="2024-04-01"
                  className="rounded-xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: roleTheme.border }}
                />
                <input
                  type="date"
                  defaultValue="2024-04-30"
                  className="rounded-xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: roleTheme.border }}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Delivery format
              </label>
              <select
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
                defaultValue="pdf"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
              Metrics to include
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {AVAILABLE_METRICS.map((metric) => (
                <label
                  key={metric}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: roleTheme.border }}
                >
                  <input type="checkbox" defaultChecked={metric === "ANC coverage" || metric === "Vaccination coverage"} />
                  <span>{metric}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <BarChart3 className="size-4" />
            Generate Report
          </button>
          <button
            type="button"
            onClick={() => router.push("/reports/schedule")}
            className="inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, color: roleTheme.text }}
          >
            <CalendarDays className="size-4" />
            Schedule Instead
          </button>
        </div>

        {submitted ? (
          <p className="mt-4 rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: roleTheme.border, color: roleTheme.text }}>
            Report configured successfully in demo mode. Connect the backend export endpoint to generate the file.
          </p>
        ) : null}
      </section>
    </div>
  );
}