"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listServiceRequests, reviewServiceRequest } from "@/lib/api/ServiceRequests";
import ReviewQueueTable from "@/features/service-requests/components/ReviewQueueTable";
import ReviewSidePanel from "@/features/service-requests/components/ReviewSidePanel";
import RejectDialog from "@/features/service-requests/components/RejectDialog";
import { PageHeader } from "@/shared/components/layout";
import type { ServiceTypeId, ServiceRequestStatus } from "@/features/service-requests/types";

export default function ServiceRequestReviewPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ServiceTypeId | "ALL">("ALL");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["service-requests", statusFilter, typeFilter],
    queryFn: () =>
      listServiceRequests({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        serviceType: typeFilter === "ALL" ? undefined : typeFilter,
      }),
  });

  const selectedRequest = requests.find((r) => r.id === selectedRequestId) ?? null;

  const reviewMutation = useMutation({
    mutationFn: reviewServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      setActionLoading(null);
      setSelectedRequestId(null);
    },
    onError: () => {
      setActionLoading(null);
    },
  });

  const handleReview = useCallback((id: string) => {
    setSelectedRequestId(id);
  }, []);

  const handleApprove = useCallback((id: string) => {
    setActionLoading(id);
    reviewMutation.mutate({ id, action: "APPROVED" });
  }, [reviewMutation]);

  const handleRejectClick = useCallback((id: string) => {
    setSelectedRequestId(id);
    setShowRejectDialog(true);
  }, []);

  const handleRejectConfirm = useCallback((reason: string) => {
    if (!selectedRequestId) return;
    setActionLoading(selectedRequestId);
    setShowRejectDialog(false);
    reviewMutation.mutate({ id: selectedRequestId, action: "REJECTED", rejectionReason: reason });
  }, [selectedRequestId, reviewMutation]);

  const handleEscalate = useCallback((id: string) => {
    setActionLoading(id);
    reviewMutation.mutate({ id, action: "ESCALATED" });
  }, [reviewMutation]);

  const handleClosePanel = useCallback(() => {
    setSelectedRequestId(null);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Request Review Queue"
        subtitle="Review, approve, or reject service requests submitted by patients"
      />

      <ReviewQueueTable
        requests={requests}
        onReview={handleReview}
        loading={isLoading}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <ReviewSidePanel
        request={selectedRequest}
        open={!!selectedRequest && !showRejectDialog}
        onClose={handleClosePanel}
        onApprove={handleApprove}
        onReject={handleRejectClick}
        onEscalate={handleEscalate}
        actionLoading={actionLoading}
      />

      <RejectDialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
