"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { GovSyncStatus } from "@/lib/api/government";

const STATUS_STYLES: Record<GovSyncStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700 ring-slate-200",
  IN_FLIGHT: "bg-blue-50 text-blue-700 ring-blue-200",
  SUCCEEDED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  FAILED: "bg-amber-50 text-amber-800 ring-amber-200",
  DEAD_LETTER: "bg-red-50 text-red-700 ring-red-200",
};

type SyncStatusIndicatorProps = {
  status: GovSyncStatus;
  className?: string;
};

export function SyncStatusIndicator({ status, className }: SyncStatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ring-1",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status === "IN_FLIGHT" ? <Loader2 className="size-3.5 animate-spin" /> : null}
      {status === "DEAD_LETTER" ? <AlertTriangle className="size-3.5" /> : null}
      {status}
    </span>
  );
}
