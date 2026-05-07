import { cn } from "@/shared/lib/utils";

const statusClasses = {
  PENDING: "border-slate-200 bg-slate-100 text-slate-700",
  ADMINISTERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MISSED: "border-amber-200 bg-amber-50 text-amber-700",
  OVERDUE: "border-red-200 bg-red-50 text-red-700",
} as const;

type VaccinationStatusPillProps = {
  status: keyof typeof statusClasses | string;
};

export function VaccinationStatusPill({ status }: VaccinationStatusPillProps) {
  const normalizedStatus = status.toUpperCase() as keyof typeof statusClasses;
  const pillClass = statusClasses[normalizedStatus] ?? statusClasses.PENDING;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        pillClass,
      )}
    >
      {normalizedStatus in statusClasses ? normalizedStatus : status}
    </span>
  );
}
