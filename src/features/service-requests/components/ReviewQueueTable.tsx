"use client";

import { useState } from "react";
import { Search, ChevronDown, ExternalLink, X } from "lucide-react";
import type { ServiceRequestDTO, ServiceTypeId, ServiceRequestStatus } from "@/features/service-requests/types";
import { SERVICE_TYPES } from "@/features/service-requests/constants";
import { cn } from "@/shared/lib/utils";

const STATUS_OPTIONS: Array<{ value: ServiceRequestStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ESCALATED", label: "Escalated" },
];

const STATUS_STYLES: Record<ServiceRequestStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ESCALATED: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ESCALATED: "Escalated",
};

interface ReviewQueueTableProps {
  requests: ServiceRequestDTO[];
  onReview: (requestId: string) => void;
  loading: boolean;
  statusFilter: ServiceRequestStatus | "ALL";
  typeFilter: ServiceTypeId | "ALL";
  onStatusFilterChange: (value: ServiceRequestStatus | "ALL") => void;
  onTypeFilterChange: (value: ServiceTypeId | "ALL") => void;
}

export default function ReviewQueueTable({
  requests,
  onReview,
  loading,
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
}: ReviewQueueTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.referenceNo.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by reference or patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2F7F7A] focus:ring-2 focus:ring-[#2F7F7A]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as ServiceRequestStatus | "ALL")}
              className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 outline-none focus:border-[#2F7F7A] focus:ring-2 focus:ring-[#2F7F7A]/20"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value as ServiceTypeId | "ALL")}
              className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 outline-none focus:border-[#2F7F7A] focus:ring-2 focus:ring-[#2F7F7A]/20"
            >
              <option value="ALL">All Services</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Service Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                  No service requests found
                </td>
              </tr>
            ) : (
              filtered.map((request) => (
                <tr key={request.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">{request.referenceNo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{request.patientName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {SERVICE_TYPES.find((s) => s.id === request.serviceType)?.label ?? request.serviceType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">
                      {new Date(request.submittedDate).toLocaleDateString("en-RW", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        STATUS_STYLES[request.status],
                      )}
                    >
                      {STATUS_LABELS[request.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {request.status === "PENDING" ? (
                      <button
                        onClick={() => onReview(request.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F7F7A] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#236661]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Review
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-400">
        Showing {filtered.length} of {requests.length} request{requests.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
