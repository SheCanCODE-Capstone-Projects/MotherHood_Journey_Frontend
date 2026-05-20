"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Baby,
  Search,
  UserPlus,
  Loader2,
  XCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { VaccinationStatusPill } from "@/shared/components/status/VaccinationStatusPill";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import { getChildren, type ChildHealthStatus } from "@/lib/api/children";

const HEALTH_STATUS_CONFIG: Record<
  ChildHealthStatus,
  { label: string; icon: typeof CheckCircle2; bg: string; text: string }
> = {
  HEALTHY:  { label: "Healthy",  icon: CheckCircle2,  bg: "#D1FAE5", text: "#065F46" },
  AT_RISK:  { label: "At Risk",  icon: AlertTriangle, bg: "#FEF3C7", text: "#92400E" },
  CRITICAL: { label: "Critical", icon: XCircle,       bg: "#FEE2E2", text: "#991B1B" },
};

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
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

export default function ChildrenListPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });
  const [search, setSearch] = useState("");

  const { data: children, isLoading, isError, refetch } = useQuery({
    queryKey: ["children", search],
    queryFn: () => getChildren(search || undefined),
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
          <p className="mt-1 text-sm text-gray-500">
            All children registered at your facility.
          </p>
        </div>
        <Link href="/children/register">
          <Button
            className="inline-flex items-center gap-2 rounded-xl text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <UserPlus className="size-4" />
            Register Child
          </Button>
        </Link>
      </div>

      {/* Table card */}
      <div
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-3 border-b px-5 py-4"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="flex items-center gap-2">
            <Baby className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-base font-semibold text-gray-800">
              {isLoading ? "Loading…" : `${children?.length ?? 0} children`}
            </h2>
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or mother…"
              className="h-9 w-56 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-[#2A7F8A] focus:ring-1 focus:ring-[#2A7F8A]/30 sm:w-72"
            />
          </div>
        </div>

        {/* Table body */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" /> Loading children…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
            <XCircle className="size-6 text-red-400" />
            <p>Failed to load children.</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </div>
        ) : !children || children.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {search
              ? "No children match your search."
              : "No children registered yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead
                className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400"
                style={{ borderColor: roleTheme.border }}
              >
                <tr>
                  <th className="px-5 py-3">Child</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="hidden px-5 py-3 md:table-cell">Mother</th>
                  <th className="hidden px-5 py-3 lg:table-cell">DOB</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {children.map((child) => {
                  const cfg = HEALTH_STATUS_CONFIG[child.health_status];
                  const StatusIcon = cfg.icon;
                  const overdue = child.vaccinations.filter(
                    (v) => v.status === "OVERDUE",
                  ).length;

                  return (
                    <tr
                      key={child.id}
                      className="transition-colors hover:bg-gray-50/60"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid size-9 shrink-0 place-items-center rounded-lg text-white"
                            style={{ backgroundColor: roleTheme.accent }}
                          >
                            <Baby className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {child.first_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {child.health_id} · {child.gender === "MALE" ? "M" : "F"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {ageLabel(child.date_of_birth)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{ backgroundColor: cfg.bg, color: cfg.text }}
                        >
                          <StatusIcon className="size-3" />
                          {cfg.label}
                          {overdue > 0 && (
                            <span className="ml-1 font-bold text-red-600">
                              · {overdue} overdue
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 text-sm text-gray-600 md:table-cell">
                        {child.mother_name}
                      </td>
                      <td className="hidden px-5 py-3.5 text-xs text-gray-400 lg:table-cell">
                        {fmtDate(child.date_of_birth)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/children/${child.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 rounded-xl px-3 text-xs"
                            style={{
                              borderColor: roleTheme.border,
                              color: roleTheme.accent,
                            }}
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
