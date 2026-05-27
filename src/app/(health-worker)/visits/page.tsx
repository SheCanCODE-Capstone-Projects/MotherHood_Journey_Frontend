"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  FilePlus,
  Search,
  Loader2,
  XCircle,
  Baby,
  User,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import { getVisits, type VisitSummary } from "@/lib/api/visits";

const VISIT_TYPE_LABELS: Record<string, string> = {
  ANC: "ANC",
  PNC: "PNC",
  IMMUNIZATION: "Immunization",
  SICK_CHILD: "Sick Child",
  GROWTH_MONITORING: "Growth Monitoring",
};

const VISIT_TYPE_COLOR: Record<string, string> = {
  ANC: "bg-blue-50 text-blue-700",
  PNC: "bg-purple-50 text-purple-700",
  IMMUNIZATION: "bg-emerald-50 text-emerald-700",
  SICK_CHILD: "bg-red-50 text-red-700",
  GROWTH_MONITORING: "bg-amber-50 text-amber-700",
};

const ALL_TYPES = ["ANC", "PNC", "IMMUNIZATION", "SICK_CHILD", "GROWTH_MONITORING"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VisitRow({ visit, accentColor }: { visit: VisitSummary; accentColor: string }) {
  return (
    <tr className="hover:bg-gray-50/60 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {visit.patient_type === "MOTHER" ? <User className="size-4" /> : <Baby className="size-4" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{visit.patient_name}</p>
            <p className="text-xs text-gray-400">{visit.patient_health_id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", VISIT_TYPE_COLOR[visit.visit_type] ?? "bg-gray-100 text-gray-600")}>
          {VISIT_TYPE_LABELS[visit.visit_type] ?? visit.visit_type}
        </span>
      </td>
      <td className="hidden px-5 py-3.5 lg:table-cell">
        {visit.primary_diagnosis_code ? (
          <span className="text-xs text-gray-600">
            <span className="font-mono font-semibold text-[#1F7280]">{visit.primary_diagnosis_code}</span>
            {" — "}
            <span className="truncate">{visit.primary_diagnosis_name}</span>
          </span>
        ) : (
          <span className="text-xs text-gray-400">No diagnosis recorded</span>
        )}
      </td>
      <td className="hidden px-5 py-3.5 md:table-cell text-xs text-gray-500">{fmtDate(visit.recorded_at)}</td>
    </tr>
  );
}

export default function VisitsListPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: visits, isLoading, isError, refetch } = useQuery({
    queryKey: ["visits", search],
    queryFn: () => getVisits(search || undefined),
  });

  const filtered = (visits ?? []).filter(
    (v) => typeFilter === "all" || v.visit_type === typeFilter,
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visits</h1>
          <p className="mt-1 text-sm text-gray-500">
            All clinical visits recorded at your facility.
          </p>
        </div>
        <Link href="/visits/new">
          <Button className="inline-flex items-center gap-2 rounded-xl text-white" style={{ backgroundColor: roleTheme.accent }}>
            <FilePlus className="size-4" />
            Record New Visit
          </Button>
        </Link>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-base font-semibold text-gray-800">
              {isLoading ? "Loading…" : `${filtered.length} visits`}
            </h2>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient…"
                className="h-9 w-48 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-[#2A7F8A] focus:ring-1 focus:ring-[#2A7F8A]/30"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#2A7F8A]"
            >
              <option value="all">All Types</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{VISIT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table body */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" /> Loading visits…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
            <XCircle className="size-6 text-red-400" />
            <p>Failed to load visits.</p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void refetch()}>Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No visits found.{" "}
            <Link href="/visits/new" className="font-medium underline" style={{ color: roleTheme.accent }}>
              Record a visit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ borderColor: roleTheme.border }}>
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Visit Type</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Primary Diagnosis</th>
                  <th className="hidden px-5 py-3 md:table-cell">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((v) => (
                  <VisitRow key={v.visit_id} visit={v} accentColor={roleTheme.accent} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
