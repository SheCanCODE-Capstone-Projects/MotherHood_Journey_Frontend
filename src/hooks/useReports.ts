"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Report, ReportStatus, ReportType } from "@/shared/types/report";

import {
  getCurrentGovernmentUserId,
  getGovReport,
  getGovReportsByUser,
  pushGovReportToHmis,
} from "@/lib/api/government";

export function useReports(reportId: string) {
  const queryClient = useQueryClient();

  const reportQuery = useQuery({
    queryKey: ["government", "reports", reportId],
    queryFn: () => getGovReport(reportId),
  });

  const pushMutation = useMutation({
    mutationFn: () => pushGovReportToHmis(reportId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData<Report>(["government", "reports", reportId], (prev) =>
          prev ? { ...prev, status: "PUSHED" as ReportStatus } : prev,
        );
      }
    },
  });

  return {
    report: reportQuery.data ?? null,
    loading: reportQuery.isLoading,
    error: reportQuery.error instanceof Error ? reportQuery.error.message : null,
    pushing: pushMutation.isPending,
    pushResult: pushMutation.data ?? null,
    pushToHmis: pushMutation.mutateAsync,
    refetch: reportQuery.refetch,
  };
}

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
