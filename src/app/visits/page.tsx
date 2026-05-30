"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Clock, User, CheckCircle, AlertCircle } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { queryKeys } from "@/shared/config/query-keys";
import { getVisitsByFacility } from "@/lib/api/visits";
import {
  VISIT_TYPE_LABELS,
  type BackendHealthVisit,
} from "@/features/visit/types";
import { cn } from "@/shared/lib/utils";

function visitStatus(visit: BackendHealthVisit): {
  label: string;
  color: string;
  bg: string;
} {
  const now = new Date();
  const visitDate = new Date(visit.visitDatetime);
  const diffDays = Math.floor(
    (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return { label: "Scheduled", color: "#6B7280", bg: "bg-gray-100 text-gray-700" };
  if (diffDays === 0) return { label: "Today", color: "#3B82F6", bg: "bg-blue-100 text-blue-700" };
  return { label: "Completed", color: "#10B981", bg: "bg-green-100 text-green-700" };
}

function formatVitalsDisplay(visit: BackendHealthVisit) {
  const parts: string[] = [];
  if (visit.systolicBp && visit.diastolicBp) {
    parts.push(`BP: ${visit.systolicBp}/${visit.diastolicBp}`);
  }
  if (visit.weightKg) {
    parts.push(`Wt: ${visit.weightKg}kg`);
  }
  return parts.join(" · ");
}

export default function VisitsPage() {
  const roleTheme = ROLE_THEMES.health_worker;
  const { data: session } = useSession();
  const facilityId = session?.user?.facilityId
    ? String(session.user.facilityId)
    : null;

  const { data: visits, isLoading } = useQuery({
    queryKey: [...queryKeys.maternal.visits, facilityId],
    queryFn: () => getVisitsByFacility(facilityId!),
    enabled: !!facilityId,
  });

  const stats = useMemo(() => {
    if (!visits) return [];
    const total = visits.length;
    const completed = visits.filter(
      (v) => new Date(v.visitDatetime) < new Date(),
    ).length;
    const today = visits.filter(
      (v) =>
        new Date(v.visitDatetime).toDateString() === new Date().toDateString(),
    ).length;
    const scheduled = visits.filter(
      (v) => new Date(v.visitDatetime) > new Date(),
    ).length;

    return [
      { label: "Total Visits", value: String(total), highlight: true },
      { label: "Today", value: String(today), color: "#3B82F6" },
      { label: "Completed", value: String(completed), color: "#10B981" },
      { label: "Scheduled", value: String(scheduled), color: "#6B7280" },
    ];
  }, [visits]);

  const todaysVisits = useMemo(
    () =>
      (visits ?? []).filter(
        (v) =>
          new Date(v.visitDatetime).toDateString() ===
          new Date().toDateString(),
      ),
    [visits],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visits"
        subtitle="Manage health facility visits and patient follow-ups."
      />

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border-2 bg-white p-5"
            style={{ borderColor: roleTheme.border }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: roleTheme.text }}
            >
              {stat.label}
            </p>
            <p
              className="mt-2 text-3xl font-bold"
              style={{
                color:
                  stat.color ?? stat.highlight ? roleTheme.accent : "#6B7280",
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2
          className="mb-4 text-lg font-semibold"
          style={{ color: roleTheme.text }}
        >
          Today&apos;s Visit Schedule
        </h2>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C6F73] border-t-transparent" />
          </div>
        )}

        {!isLoading && !facilityId && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <User className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-400">
              Sign in to view visits
            </p>
          </div>
        )}

        {!isLoading && facilityId && todaysVisits.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-400">
              No visits scheduled for today
            </p>
          </div>
        )}

        {!isLoading && todaysVisits.length > 0 && (
          <div className="space-y-3">
            {todaysVisits.map((visit) => {
              const status = visitStatus(visit);
              return (
                <div
                  key={visit.id}
                  className="rounded-2xl border-2 p-5"
                  style={{ borderColor: roleTheme.border }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: roleTheme.accentSoft }}
                        >
                          <Clock
                            className="size-5"
                            style={{ color: roleTheme.accent }}
                          />
                        </div>
                        <div>
                          <h3
                            className="font-semibold"
                            style={{ color: roleTheme.text }}
                          >
                            {new Date(visit.visitDatetime).toLocaleTimeString(
                              "en-RW",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: roleTheme.text }}
                          >
                            {visit.patientRefId}
                          </p>
                        </div>
                      </div>
                      <p
                        className="mt-2 font-medium"
                        style={{ color: roleTheme.text }}
                      >
                        {VISIT_TYPE_LABELS[visit.visitType] ?? visit.visitType}
                      </p>
                      {visit.chiefComplaint && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: roleTheme.text }}
                        >
                          {visit.chiefComplaint}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          status.bg,
                        )}
                      >
                        {status.label}
                      </span>
                      {visit.weightKg && (
                        <div className="mt-3 text-sm">
                          <p style={{ color: roleTheme.text }}>
                            {formatVitalsDisplay(visit)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {facilityId && (
        <section
          className="rounded-2xl border-2 p-5"
          style={{
            borderColor: roleTheme.border,
            backgroundColor: roleTheme.accentSoft,
          }}
        >
          <h3
            className="font-semibold"
            style={{ color: roleTheme.text }}
          >
            Quick Actions
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: roleTheme.accent, color: "white" }}
            >
              Record Visit
            </button>
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: roleTheme.border,
                border: "2px solid",
                color: roleTheme.text,
              }}
            >
              Schedule Next
            </button>
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: roleTheme.border,
                border: "2px solid",
                color: roleTheme.text,
              }}
            >
              Add Notes
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
