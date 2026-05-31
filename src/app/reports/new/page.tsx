"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, BarChart3, ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { useRole } from "@/shared/hooks/useRole";
import { getReportTypeLabel } from "@/hooks/useReports";
import { generateGovReport, getCurrentGovernmentProfile, type GovReportRequest } from "@/lib/api/government";

const REPORT_TYPES: GovReportRequest["reportType"][] = [
  "VACCINATION_COVERAGE",
  "ANC_ATTENDANCE",
  "BIRTH_REGISTRATION",
  "MATERNAL_HEALTH",
];

const SCOPE_LEVELS = ["NATIONAL", "PROVINCE", "DISTRICT", "FACILITY"];

const DEFAULT_AGGREGATES: Record<GovReportRequest["reportType"], string> = {
  VACCINATION_COVERAGE: JSON.stringify({ byVaccineType: [{ vaccineType: "BCG", coverage: 92, target: 95 }] }, null, 2),
  ANC_ATTENDANCE: JSON.stringify({ monthlyAttendance: [{ month: "Jan", attendance: 342 }] }, null, 2),
  BIRTH_REGISTRATION: JSON.stringify({ byDistrict: [{ district: "Bugesera", registrations: 523 }] }, null, 2),
  MATERNAL_HEALTH: JSON.stringify({ stats: { maternalMortalityProxy: 0.12, ancCoverage: 89.5, institutionalDeliveryRate: 91.2 } }, null, 2),
};

export default function NewCustomReportPage() {
  const router = useRouter();
  const { role } = useRole();
  const roleTheme = role === "government" ? ROLE_THEMES.government : ROLE_THEMES.facility_admin;
  const profileQuery = useQuery({
    queryKey: ["government", "me", "report-create"],
    queryFn: getCurrentGovernmentProfile,
  });
  const [reportType, setReportType] = useState<GovReportRequest["reportType"]>("VACCINATION_COVERAGE");
  const [period, setPeriod] = useState("2026-Q2");
  const [scopeLevel, setScopeLevel] = useState("NATIONAL");
  const [geoLocationId, setGeoLocationId] = useState("");
  const [aggregatesJson, setAggregatesJson] = useState(DEFAULT_AGGREGATES.VACCINATION_COVERAGE);
  const [error, setError] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: generateGovReport,
    onSuccess: (report) => {
      router.push(`/reports/${report.id}`);
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "Failed to generate report");
    },
  });

  const currentProfile = profileQuery.data;

  const handleReportTypeChange = (nextType: GovReportRequest["reportType"]) => {
    setReportType(nextType);
    setAggregatesJson(DEFAULT_AGGREGATES[nextType]);
  };

  const handleGenerate = () => {
    setError(null);

    let aggregates: Record<string, unknown>;

    try {
      aggregates = JSON.parse(aggregatesJson) as Record<string, unknown>;
    } catch {
      setError("Aggregates must be valid JSON.");
      return;
    }

    const resolvedGeoLocationId = geoLocationId.trim() || currentProfile?.geoLocationId;

    if (!resolvedGeoLocationId) {
      setError("A geo location ID is required to generate a report.");
      return;
    }

    generateMutation.mutate({
      reportType,
      period,
      scopeLevel,
      geoLocationId: resolvedGeoLocationId,
      aggregates,
    });
  };

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
        subtitle="Generate a backend-backed government report with your selected scope and aggregates."
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
                value={getReportTypeLabel(reportType)}
                readOnly
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Reporting period
              </label>
              <input
                type="text"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                placeholder="2026-Q2"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Scope level
              </label>
              <select
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
                value={scopeLevel}
                onChange={(event) => setScopeLevel(event.target.value)}
              >
                {SCOPE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
                Geo location ID
              </label>
              <input
                type="text"
                value={geoLocationId}
                onChange={(event) => setGeoLocationId(event.target.value)}
                placeholder={currentProfile?.geoLocationId ?? "Enter a geo location UUID"}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: roleTheme.border }}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
              Report type
            </label>
            <div className="grid gap-3">
              {REPORT_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: roleTheme.border }}
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === type}
                    onChange={() => handleReportTypeChange(type)}
                  />
                  <span>{getReportTypeLabel(type)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold" style={{ color: roleTheme.text }}>
            Aggregates JSON
          </label>
          <textarea
            value={aggregatesJson}
            onChange={(event) => setAggregatesJson(event.target.value)}
            rows={10}
            className="w-full rounded-2xl border px-4 py-3 font-mono text-xs outline-none"
            style={{ borderColor: roleTheme.border }}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <BarChart3 className="size-4" />
            {generateMutation.isPending ? "Generating..." : "Generate Report"}
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

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  );
}