"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Baby,
  Syringe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  CalendarDays,
} from "lucide-react";

import { useRole } from "@/shared/hooks/useRole";
import { getPatientChildren } from "@/lib/api/patient";

const HEALTH_STATUS_CONFIG = {
  HEALTHY:  { label: "Healthy",  bg: "#D1FAE5", text: "#065F46", icon: CheckCircle2 },
  AT_RISK:  { label: "At Risk",  bg: "#FEF3C7", text: "#92400E", icon: AlertTriangle },
  CRITICAL: { label: "Critical", bg: "#FEE2E2", text: "#991B1B", icon: XCircle },
} as const;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ageLabel(dob: string) {
  const months = Math.floor(
    (Date.now() - new Date(dob).getTime()) / (30.44 * 24 * 60 * 60 * 1000),
  );
  if (months < 1) return "Newborn";
  if (months < 12) return `${months} months old`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y} year${y > 1 ? "s" : ""} old`;
}

function daysUntil(iso: string) {
  const diff = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 0) return `In ${diff} days`;
  return "Overdue";
}

export default function MyChildrenPage() {
  const { roleTheme } = useRole({ fallbackRole: "patient" });

  const { data: children, isLoading, isError } = useQuery({
    queryKey: ["patient-children"],
    queryFn: getPatientChildren,
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
        <p className="mt-1 text-sm text-gray-500">
          Health records and vaccination status for your children.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray-400">
          <Loader2 className="size-4 animate-spin" /> Loading children…
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <XCircle className="mx-auto size-10 text-red-400" />
          <p className="mt-3 text-sm text-red-600">Failed to load children records.</p>
        </div>
      ) : !children || children.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed p-12 text-center"
          style={{ borderColor: roleTheme.border }}
        >
          <Baby className="mx-auto size-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No children registered yet.</p>
          <p className="mt-1 text-xs text-gray-400">
            Contact your health facility to register a newborn.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {children.map((child) => {
            const cfg = HEALTH_STATUS_CONFIG[child.health_status];
            const StatusIcon = cfg.icon;
            const pct = Math.round(
              (child.vaccinations_completed / child.vaccinations_total) * 100,
            );

            return (
              <div
                key={child.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm"
                style={{ borderColor: roleTheme.border }}
              >
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="grid size-12 shrink-0 place-items-center rounded-2xl text-white"
                    style={{ backgroundColor: roleTheme.accent }}
                  >
                    <Baby className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">{child.first_name}</h2>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: cfg.bg, color: cfg.text }}
                      >
                        <StatusIcon className="size-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {ageLabel(child.date_of_birth)} ·{" "}
                      {child.gender === "MALE" ? "Boy" : "Girl"} · {child.health_id}
                    </p>
                  </div>
                </div>

                {/* Vaccination progress */}
                <div
                  className="border-t px-5 py-4"
                  style={{ borderColor: roleTheme.border }}
                >
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">
                      <Syringe className="mr-1 inline size-3" />
                      Vaccinations
                    </span>
                    <span style={{ color: roleTheme.accent }}>
                      {child.vaccinations_completed}/{child.vaccinations_total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct === 100 ? "#10B981" : roleTheme.accent,
                      }}
                    />
                  </div>
                </div>

                {/* Next vaccination */}
                {child.next_vaccination_date && child.next_vaccination_name && (
                  <div
                    className="border-t px-5 py-3"
                    style={{ borderColor: roleTheme.border }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Next Vaccine</p>
                        <p className="text-sm font-medium text-gray-800">
                          {child.next_vaccination_name}
                        </p>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                      >
                        <CalendarDays className="mr-1 inline size-3" />
                        {daysUntil(child.next_vaccination_date)}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className="flex items-center justify-between border-t px-5 py-3"
                  style={{ borderColor: roleTheme.border }}
                >
                  <p className="text-xs text-gray-400">Born {fmtDate(child.date_of_birth)}</p>
                  <Link
                    href={`/children/${child.id}/vaccinations`}
                    className="text-xs font-semibold transition-colors hover:opacity-70"
                    style={{ color: roleTheme.accent }}
                  >
                    Full record →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
