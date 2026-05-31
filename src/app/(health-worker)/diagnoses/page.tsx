"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Stethoscope,
  Search,
  FilePlus,
  Loader2,
  XCircle,
  User,
  Baby,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import { getVisits } from "@/lib/api/visits";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const VISIT_TYPE_LABELS: Record<string, string> = {
  ANC: "ANC",
  PNC: "PNC",
  IMMUNIZATION: "Immunization",
  SICK_CHILD: "Sick Child",
  GROWTH_MONITORING: "Growth Monitoring",
};

export default function DiagnosesPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });
  const [search, setSearch] = useState("");

  const { data: visits, isLoading, isError, refetch } = useQuery({
    queryKey: ["visits"],
    queryFn: () => getVisits(),
  });

  // Derive diagnoses from visits that have a primary diagnosis recorded
  const diagnoses = (visits ?? [])
    .filter((v) => v.primary_diagnosis_code)
    .map((v) => ({
      visit_id: v.visit_id,
      patient_health_id: v.patient_health_id,
      patient_name: v.patient_name,
      patient_type: v.patient_type,
      visit_type: v.visit_type,
      icd_code: v.primary_diagnosis_code!,
      description: v.primary_diagnosis_name!,
      recorded_at: v.recorded_at,
    }));

  const filtered = diagnoses.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.patient_name.toLowerCase().includes(q) ||
      d.icd_code.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagnoses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Primary diagnoses recorded across all visits at your facility.
          </p>
        </div>
        <Link href="/visits/new">
          <Button
            className="inline-flex items-center gap-2 rounded-xl text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <FilePlus className="size-4" />
            Record Visit
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
            <Stethoscope className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-base font-semibold text-gray-800">
              {isLoading ? "Loading…" : `${filtered.length} diagnoses`}
            </h2>
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient or ICD code…"
              className="h-9 w-56 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-[#2A7F8A] focus:ring-1 focus:ring-[#2A7F8A]/30 sm:w-72"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" /> Loading diagnoses…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
            <XCircle className="size-6 text-red-400" />
            <p>Failed to load diagnoses.</p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {search ? "No diagnoses match your search." : "No diagnoses recorded yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead
                className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400"
                style={{ borderColor: roleTheme.border }}
              >
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">ICD-10 Code</th>
                  <th className="px-5 py-3">Diagnosis</th>
                  <th className="hidden px-5 py-3 md:table-cell">Visit Type</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((d) => (
                  <tr key={d.visit_id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-white"
                          style={{ backgroundColor: roleTheme.accent }}
                        >
                          {d.patient_type === "MOTHER"
                            ? <User className="size-3.5" />
                            : <Baby className="size-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800">{d.patient_name}</p>
                          <p className="text-xs text-gray-400">{d.patient_health_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="rounded-lg px-2.5 py-1 font-mono text-xs font-semibold"
                        style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                      >
                        {d.icd_code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{d.description}</td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                        {VISIT_TYPE_LABELS[d.visit_type] ?? d.visit_type}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-gray-400 lg:table-cell">
                      {fmtDate(d.recorded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
