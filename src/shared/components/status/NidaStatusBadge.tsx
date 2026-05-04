import { cn } from "@/shared/lib/utils";

const statusClasses = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  VERIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED: "border-red-200 bg-red-50 text-red-700",
  MANUAL: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

type NidaStatusBadgeProps = {
  status: keyof typeof statusClasses | string;
};

export function NidaStatusBadge({ status }: NidaStatusBadgeProps) {
  const normalizedStatus = status.toUpperCase() as keyof typeof statusClasses;
  const badgeClass = statusClasses[normalizedStatus] ?? statusClasses.MANUAL;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        badgeClass,
      )}
    >
      {normalizedStatus in statusClasses ? normalizedStatus : status}
    </span>
  );
}
