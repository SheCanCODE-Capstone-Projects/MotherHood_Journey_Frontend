"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReportStatus, ReportType } from "@/shared/types/report";

import { getCurrentGovernmentUserId, getGovReport, getGovReportsByUser } from "@/lib/api/government";

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
  const currentUserQuery = useQuery({
    queryKey: ["government", "me", "report-user"],
    queryFn: getCurrentGovernmentUserId,
    enabled: !userId,
  });

  const resolvedUserId = userId ?? currentUserQuery.data ?? undefined;

  const reportListQuery = useQuery({
    queryKey: ["government", "reports", "list", resolvedUserId ?? "anonymous"],
    queryFn: () => getGovReportsByUser(resolvedUserId ?? ""),
    enabled: Boolean(resolvedUserId),
  });

  return {
    reports: reportListQuery.data ?? [],
    loading: currentUserQuery.isLoading || reportListQuery.isLoading,
    error:
      (currentUserQuery.error instanceof Error ? currentUserQuery.error.message : null) ??
      (reportListQuery.error instanceof Error ? reportListQuery.error.message : null),
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