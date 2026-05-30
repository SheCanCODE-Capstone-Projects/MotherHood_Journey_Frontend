"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReportStatus, ReportType } from "@/shared/types/report";

import { getGovReport, getGovReportsByUser } from "@/lib/api/government";

/**
 * Custom hook for managing report data and operations
 */
export function useReports(reportId: string) {
  const reportQuery = useQuery({
    queryKey: ["government", "reports", reportId],
    queryFn: () => getGovReport(reportId),
  });

  return {
    report: reportQuery.data ?? null,
    loading: reportQuery.isLoading,
    error: reportQuery.error instanceof Error ? reportQuery.error.message : null,
    refetch: reportQuery.refetch,
  };
}

/**
 * Hook to get all reports (for listing)
 */
export function useReportList(userId?: string) {
  const reportListQuery = useQuery({
    queryKey: ["government", "reports", "list", userId ?? "anonymous"],
    queryFn: () => getGovReportsByUser(userId ?? ""),
    enabled: Boolean(userId),
  });

  return {
    reports: reportListQuery.data ?? [],
    loading: reportListQuery.isLoading,
    error: reportListQuery.error instanceof Error ? reportListQuery.error.message : null,
  };
}

/**
 * Get report type label
 */
export function getReportTypeLabel(type: ReportType): string {
  const labels: Record<ReportType, string> = {
    VACCINATION_COVERAGE: "Vaccination Coverage",
    ANC_ATTENDANCE: "ANC Attendance",
    BIRTH_REGISTRATION: "Birth Registration",
    MATERNAL_HEALTH: "Maternal Health",
  };
  return labels[type];
}

/**
 * Get status label
 */
export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    NOT_PUSHED: "Not Pushed",
    QUEUED: "Queued",
    PUSHED: "Pushed",
    FAILED: "Failed",
  };
  return labels[status];
}