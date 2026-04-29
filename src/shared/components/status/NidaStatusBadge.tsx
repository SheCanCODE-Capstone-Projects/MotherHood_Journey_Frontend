import { cn } from "@/shared/lib/utils";
import type { NidaStatus } from "@/shared/types/mother";

type NidaStatusBadgeProps = {
  status: NidaStatus;
  className?: string;
};

const statusConfig = {
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  unverified: {
    label: "Unverified",
    className: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
};

export function NidaStatusBadge({ status, className }: NidaStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      NIDA: {config.label}
    </span>
  );
}