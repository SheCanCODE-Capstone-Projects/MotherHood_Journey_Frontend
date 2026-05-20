"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { useRole } from "@/shared/hooks/useRole";

export default function ScheduleReportPage() {
  const router = useRouter();
  const { role } = useRole();
  const roleTheme = role === "government" ? ROLE_THEMES.government : ROLE_THEMES.facility_admin;
  const [scheduled, setScheduled] = useState(false);

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
        title="Schedule Report"
        subtitle="Set a recurring report schedule for automated delivery."
      />

      <section className="rounded-2xl border-2 bg-white p-6" style={{ borderColor: roleTheme.border }}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Report template
              </label>
              <select
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
                defaultValue="vaccination"
              >
                <option value="vaccination">Vaccination coverage report</option>
                <option value="anc">ANC attendance report</option>
                <option value="staff">Staff productivity report</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Frequency
              </label>
              <select
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
                defaultValue="monthly"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Delivery time
              </label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Start date
              </label>
              <input
                type="date"
                defaultValue="2024-04-15"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setScheduled(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <Clock className="size-4" />
            Save Schedule
          </button>
          <button
            type="button"
            onClick={() => router.push("/reports/new")}
            className="inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, color: roleTheme.text }}
          >
            <CalendarDays className="size-4" />
            Create Now
          </button>
        </div>

        {scheduled ? (
          <p className="mt-4 rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: roleTheme.border, color: roleTheme.text }}>
            Schedule saved in demo mode. Connect the backend job scheduler to activate recurring delivery.
          </p>
        ) : null}
      </section>
    </div>
  );
}