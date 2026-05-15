"use client";

import { X, FileText, Download, CheckCircle, XCircle, ArrowUpCircle } from "lucide-react";
import type { ServiceRequestDTO } from "@/features/service-requests/types";
import { SERVICE_TYPES } from "@/features/service-requests/constants";
import { cn } from "@/shared/lib/utils";

interface ReviewSidePanelProps {
  request: ServiceRequestDTO | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEscalate: (id: string) => void;
  actionLoading: string | null;
}

export default function ReviewSidePanel({
  request,
  open,
  onClose,
  onApprove,
  onReject,
  onEscalate,
  actionLoading,
}: ReviewSidePanelProps) {
  if (!open || !request) return null;

  const svc = SERVICE_TYPES.find((s) => s.id === request.serviceType);
  const isPending = request.status === "PENDING";
  const canEscalate = isPending;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Request Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">{request.referenceNo}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Patient</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{request.patientName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Service Type</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{svc?.label ?? request.serviceType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Submitted</p>
              <p className="mt-1 text-sm text-gray-700">
                {new Date(request.submittedDate).toLocaleDateString("en-RW", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Status</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{request.status}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Attached Documents ({request.documents.length})
            </p>
            <div className="space-y-2">
              {request.documents.map((doc) => (
                <div
                  key={doc.key}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5"
                >
                  <FileText className="h-5 w-5 shrink-0 text-[#2F7F7A]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.key.replace(/_/g, " ")}</p>
                  </div>
                  <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2F7F7A]">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {request.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Rejection Reason</p>
              <p className="mt-1 text-sm text-red-700">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        {isPending && (
          <div className="border-t border-gray-200 px-5 py-4 space-y-2">
            <button
              onClick={() => onApprove(request.id)}
              disabled={actionLoading === request.id}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {actionLoading === request.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Approve
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => onReject(request.id)}
                disabled={actionLoading === request.id}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>

              {canEscalate && (
                <button
                  onClick={() => onEscalate(request.id)}
                  disabled={actionLoading === request.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:opacity-50"
                >
                  <ArrowUpCircle className="h-4 w-4" />
                  Escalate
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
