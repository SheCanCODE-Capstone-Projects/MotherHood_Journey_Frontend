"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Report, ReportStatus, PushHmisResponse, ReportType, ReportData } from "@/shared/types/report";
import { getGovernmentReports, type StoredReport } from "@/lib/api/government";

const mockReports: Record<string, Report> = {
  "rpt-vaccination-001": {
    id: "rpt-vaccination-001",
    reportType: "VACCINATION_COVERAGE",
    status: "NOT_PUSHED",
    title: "Vaccination Coverage Report - Q1 2024",
    description: "Comprehensive vaccination coverage analysis across all facilities",
    generatedAt: "2024-03-31T10:00:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-03-31T23:59:59Z",
    districtName: "Bugesera District",
    data: {
      byVaccineType: [
        { vaccineType: "BCG", coverage: 92, target: 95 },
        { vaccineType: "DPT-HepB-Hib", coverage: 88, target: 90 },
        { vaccineType: "Polio", coverage: 91, target: 95 },
        { vaccineType: "Pentavalent", coverage: 87, target: 90 },
        { vaccineType: "Measles", coverage: 85, target: 90 },
        { vaccineType: "TT", coverage: 78, target: 85 },
      ],
    },
  },
  "rpt-anc-002": {
    id: "rpt-anc-002",
    reportType: "ANC_ATTENDANCE",
    status: "QUEUED",
    title: "ANC Attendance Report - 2024",
    description: "Monthly antenatal care attendance trends",
    generatedAt: "2024-06-15T14:30:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-06-30T23:59:59Z",
    facilityName: "Nyamata District Hospital",
    data: {
      monthlyAttendance: [
        { month: "Jan", attendance: 342 },
        { month: "Feb", attendance: 378 },
        { month: "Mar", attendance: 395 },
        { month: "Apr", attendance: 412 },
        { month: "May", attendance: 438 },
        { month: "Jun", attendance: 456 },
      ],
    },
  },
  "rpt-birth-003": {
    id: "rpt-birth-003",
    reportType: "BIRTH_REGISTRATION",
    status: "PUSHED",
    title: "Birth Registration Report - Q2 2024",
    description: "Birth registrations by district",
    generatedAt: "2024-07-01T09:00:00Z",
    periodStart: "2024-04-01T00:00:00Z",
    periodEnd: "2024-06-30T23:59:59Z",
    districtName: "Bugesera District",
    data: {
      byDistrict: [
        { district: "Nyamata", registrations: 523 },
        { district: "Rweru", registrations: 312 },
        { district: "Gashora", registrations: 418 },
        { district: "Ntarama", registrations: 287 },
        { district: "Mareba", registrations: 195 },
        { district: "Rilima", registrations: 234 },
      ],
    },
  },
  "rpt-maternal-004": {
    id: "rpt-maternal-004",
    reportType: "MATERNAL_HEALTH",
    status: "FAILED",
    title: "Maternal Health Report - 2024",
    description: "Key maternal health indicators and outcomes",
    generatedAt: "2024-08-10T11:00:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-07-31T23:59:59Z",
    districtName: "Bugesera District",
    data: {
      stats: {
        maternalMortalityProxy: 0.12,
        ancCoverage: 89.5,
        institutionalDeliveryRate: 91.2,
      },
    },
  },
};

function buildReportFromStored(stored: StoredReport): Report {
  const districtName = stored.scopeLevel !== "NATIONAL" ? stored.scopeName : undefined;
  const base = {
    id: stored.id,
    reportType: stored.reportType,
    status: stored.status,
    title: stored.title,
    description: `${stored.scopeName} report covering ${new Date(stored.periodStart).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} – ${new Date(stored.periodEnd).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`,
    generatedAt: stored.generatedAt,
    periodStart: stored.periodStart,
    periodEnd: stored.periodEnd,
    districtName,
  };

  if (stored.reportType === "VACCINATION_COVERAGE") {
    const data: ReportData["VACCINATION_COVERAGE"] = {
      byVaccineType: [
        { vaccineType: "BCG", coverage: 89, target: 95 },
        { vaccineType: "DPT-HepB-Hib", coverage: 85, target: 90 },
        { vaccineType: "Polio", coverage: 88, target: 95 },
        { vaccineType: "Pentavalent", coverage: 84, target: 90 },
        { vaccineType: "Measles", coverage: 82, target: 90 },
        { vaccineType: "TT", coverage: 76, target: 85 },
      ],
    };
    return { ...base, data };
  }

  if (stored.reportType === "ANC_ATTENDANCE") {
    const data: ReportData["ANC_ATTENDANCE"] = {
      monthlyAttendance: [
        { month: "Jan", attendance: 320 },
        { month: "Feb", attendance: 355 },
        { month: "Mar", attendance: 372 },
        { month: "Apr", attendance: 398 },
        { month: "May", attendance: 421 },
        { month: "Jun", attendance: 445 },
      ],
    };
    return { ...base, data };
  }

  if (stored.reportType === "BIRTH_REGISTRATION") {
    const data: ReportData["BIRTH_REGISTRATION"] = {
      byDistrict: [
        { district: "Nyamata", registrations: 498 },
        { district: "Rweru", registrations: 294 },
        { district: "Gashora", registrations: 387 },
        { district: "Ntarama", registrations: 271 },
        { district: "Mareba", registrations: 183 },
        { district: "Rilima", registrations: 219 },
      ],
    };
    return { ...base, data };
  }

  const data: ReportData["MATERNAL_HEALTH"] = {
    stats: {
      maternalMortalityProxy: 0.11,
      ancCoverage: 87.3,
      institutionalDeliveryRate: 90.1,
    },
  };
  return { ...base, data };
}

async function fetchReport(reportId: string): Promise<Report> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const hardcoded = mockReports[reportId];
  if (hardcoded) return hardcoded;
  const allReports = await getGovernmentReports();
  const stored = allReports.find((r) => r.id === reportId);
  if (stored) return buildReportFromStored(stored);
  throw new Error("Report not found");
}

async function pushReportToHmis(reportId: string): Promise<PushHmisResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (Math.random() > 0.2) {
    return {
      success: true,
      message: "Report successfully pushed to HMIS",
      pushedAt: new Date().toISOString(),
    };
  }
  return {
    success: false,
    message: "HMIS gateway returned an error. Please retry.",
  };
}

export function useReports(reportId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => fetchReport(reportId),
    retry: 1,
  });

  const pushMutation = useMutation({
    mutationFn: () => pushReportToHmis(reportId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData<Report>(["report", reportId], (prev) =>
          prev ? { ...prev, status: "PUSHED" as ReportStatus } : prev,
        );
      }
    },
  });

  return {
    report: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? (query.error instanceof Error ? query.error.message : "Failed to load report") : null,
    pushing: pushMutation.isPending,
    pushResult: pushMutation.data ?? null,
    pushToHmis: pushMutation.mutateAsync,
    refetch: query.refetch,
  };
}

export function useReportList() {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async (): Promise<Report[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return Object.values(mockReports);
    },
  });

  return {
    reports: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Failed to load reports" : null,
  };
}

export function getReportTypeLabel(type: ReportType): string {
  const labels: Record<ReportType, string> = {
    VACCINATION_COVERAGE: "Vaccination Coverage",
    ANC_ATTENDANCE: "ANC Attendance",
    BIRTH_REGISTRATION: "Birth Registration",
    MATERNAL_HEALTH: "Maternal Health",
  };
  return labels[type];
}

export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    NOT_PUSHED: "Not Pushed",
    QUEUED: "Queued",
    PUSHED: "Pushed to HMIS",
    FAILED: "Push Failed",
  };
  return labels[status];
}
