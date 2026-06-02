"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Baby,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  XCircle,
  User,
  Scale,
  CalendarDays,
  Syringe,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { VaccinationStatusPill } from "@/shared/components/status/VaccinationStatusPill";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import { getChildProfile, administerVaccination, type VaccinationRow, type ChildHealthStatus } from "@/lib/api/children";

// ─── Status config ────────────────────────────────────────────────────────────

const HEALTH_STATUS_CONFIG: Record<ChildHealthStatus, { label: string; icon: typeof CheckCircle2; bg: string; text: string; border: string }> = {
  HEALTHY:  { label: "Healthy",  icon: CheckCircle2,   bg: "#D1FAE5", text: "#065F46", border: "#10B981" },
  AT_RISK:  { label: "At Risk",  icon: AlertTriangle,  bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  CRITICAL: { label: "Critical", icon: XCircle,        bg: "#FEE2E2", text: "#991B1B", border: "#EF4444" },
};

const ROW_STATUS_CLASS: Record<VaccinationRow["status"], string> = {
  PENDING:      "bg-white",
  ADMINISTERED: "bg-emerald-50/40",
  MISSED:       "bg-amber-50/40",
  OVERDUE:      "bg-red-50/40",
};

// ─── Mark administered dialog ─────────────────────────────────────────────────

function AdministerDialog({
  vaccination,
  onClose,
  onConfirm,
  isPending,
}: {
  vaccination: VaccinationRow;
  onClose: () => void;
  onConfirm: (lotNumber: string) => void;
  isPending: boolean;
}) {
  const [lotNumber, setLotNumber] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-[#CFE3E9] bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[#E2F2F5]">
            <Syringe className="size-5 text-[#1F7280]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Mark Administered</h3>
            <p className="text-xs text-gray-500">{vaccination.vaccine_name}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Lot Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              placeholder="e.g. LOT-2024-BCG-01"
              className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F7280] focus:ring-1 focus:ring-[#1F7280]/30"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-400">
            Due: {new Date(vaccination.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {" · "}Window: ±{vaccination.window_days} days
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl text-white"
            style={{ backgroundColor: "#1F7280" }}
            disabled={!lotNumber.trim() || isPending}
            onClick={() => onConfirm(lotNumber.trim())}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            {isPending ? "Saving…" : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Vaccination table ─────────────────────────────────────────────────────────

function VaccinationTable({
  vaccinations,
  onAdminister,
  pendingId,
}: {
  vaccinations: VaccinationRow[];
  onAdminister: (row: VaccinationRow) => void;
  pendingId: string | null;
}) {
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#CFE3E9] bg-white shadow-sm">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="border-b border-[#CFE3E9] bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <tr>
            <th className="px-5 py-3">Vaccine</th>
            <th className="px-5 py-3">Antigen Code</th>
            <th className="px-5 py-3">Due Date</th>
            <th className="px-5 py-3">Window</th>
            <th className="px-5 py-3">Status</th>
            <th className="hidden px-5 py-3 lg:table-cell">Administered</th>
            <th className="hidden px-5 py-3 lg:table-cell">Lot #</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vaccinations.map((row) => {
            const canAdminister = row.status === "PENDING" || row.status === "OVERDUE";
            return (
              <tr
                key={row.id}
                className={cn("transition-colors", ROW_STATUS_CLASS[row.status])}
              >
                <td className="px-5 py-3 font-medium text-gray-800">{row.vaccine_name}</td>
                <td className="px-5 py-3 font-mono text-xs text-[#1F7280]">{row.antigen_code}</td>
                <td className="px-5 py-3 text-gray-600">{fmt(row.due_date)}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">±{row.window_days}d</td>
                <td className="px-5 py-3">
                  <VaccinationStatusPill status={row.status} />
                </td>
                <td className="hidden px-5 py-3 text-gray-500 text-xs lg:table-cell">
                  {fmt(row.administered_date)}
                </td>
                <td className="hidden px-5 py-3 font-mono text-xs text-gray-500 lg:table-cell">
                  {row.lot_number ?? "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  {canAdminister && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-xl px-2.5 text-xs"
                      disabled={pendingId === row.id}
                      onClick={() => onAdminister(row)}
                      style={{ borderColor: "#CFE3E9", color: "#1F7280" }}
                    >
                      {pendingId === row.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Syringe className="size-3" />
                      )}
                      Administer
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChildProfilePage() {
  const { childId } = useParams<{ childId: string }>();
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });
  const queryClient = useQueryClient();

  const [dialogRow, setDialogRow] = useState<VaccinationRow | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [pendingVaxId, setPendingVaxId] = useState<string | null>(null);

  const { data: child, isLoading, isError } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => getChildProfile(childId),
  });

  const administerMutation = useMutation({
    mutationFn: ({ vaccinationId, lotNumber }: { vaccinationId: string; lotNumber: string }) =>
      administerVaccination(vaccinationId, { lot_number: lotNumber }),
    onMutate: ({ vaccinationId }) => setPendingVaxId(vaccinationId),
    onSuccess: () => {
      setDialogRow(null);
      setPendingVaxId(null);
      setToast({ text: "Vaccination recorded successfully.", ok: true });
      void queryClient.invalidateQueries({ queryKey: ["child", childId] });
      setTimeout(() => setToast(null), 3500);
    },
    onError: () => {
      setPendingVaxId(null);
      setToast({ text: "Failed to record vaccination. Please try again.", ok: false });
      setTimeout(() => setToast(null), 3500);
    },
  });

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-32 text-sm text-gray-400">
        <Loader2 className="size-5 animate-spin" /> Loading child profile…
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Link href="/children" className="inline-flex items-center gap-2 text-sm text-[#5B8784] hover:text-[#1F7280]">
          <ArrowLeft className="size-4" /> Back to Children
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <XCircle className="mx-auto size-10 text-red-400" />
          <h2 className="mt-3 text-lg font-semibold text-red-800">Child Not Found</h2>
          <p className="mt-1 text-sm text-red-600">The requested child record could not be loaded.</p>
        </div>
      </div>
    );
  }

  const statusCfg = HEALTH_STATUS_CONFIG[child.health_status];
  const StatusIcon = statusCfg.icon;
  const ageMonths = Math.floor((Date.now() - new Date(child.date_of_birth).getTime()) / (30.44 * 24 * 60 * 60 * 1000));
  const ageLabel = ageMonths < 12 ? `${ageMonths}mo` : `${Math.floor(ageMonths / 12)}y ${ageMonths % 12}mo`;
  const administered = child.vaccinations.filter((v) => v.status === "ADMINISTERED").length;
  const overdue = child.vaccinations.filter((v) => v.status === "OVERDUE").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back link */}
      <Link href="/children" className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-70" style={{ color: roleTheme.text }}>
        <ArrowLeft className="size-4" /> Back to Children
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl text-xl font-bold text-white" style={{ backgroundColor: roleTheme.accent }}>
            <Baby className="size-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{child.first_name}</h1>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.text, borderColor: statusCfg.border }}
              >
                <StatusIcon className="size-3" />
                {statusCfg.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {child.health_id} · {child.gender} · {ageLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CalendarDays, label: "Date of Birth", value: fmt(child.date_of_birth) },
          { icon: Scale, label: "Birth Weight", value: `${child.birth_weight} kg` },
          { icon: Heart, label: "Delivery Type", value: child.delivery_type },
          { icon: User, label: "Mother", value: child.mother_name, href: `/mothers/${child.mother_id}` },
        ].map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: roleTheme.border }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Icon className="size-3.5" />
              {label}
            </div>
            {href ? (
              <Link href={href} className="mt-1.5 block text-base font-semibold hover:underline" style={{ color: roleTheme.accent }}>
                {value}
              </Link>
            ) : (
              <p className="mt-1.5 text-base font-semibold text-gray-800">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Vaccination progress banner */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-white px-5 py-4 shadow-sm" style={{ borderColor: roleTheme.border }}>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Vaccination Progress</p>
          <p className="mt-1 text-sm text-gray-700">
            <span className="font-bold text-emerald-700">{administered}</span> of <span className="font-bold">{child.vaccinations.length}</span> vaccines administered
            {overdue > 0 && (
              <span className="ml-2 font-semibold text-red-600">· {overdue} overdue</span>
            )}
          </p>
        </div>
        <div className="h-2.5 w-48 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${Math.round((administered / child.vaccinations.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Vaccination table */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Vaccination Schedule</h2>
        <VaccinationTable
          vaccinations={child.vaccinations}
          onAdminister={setDialogRow}
          pendingId={pendingVaxId}
        />
      </div>

      {/* Mark administered dialog */}
      {dialogRow && (
        <AdministerDialog
          vaccination={dialogRow}
          onClose={() => setDialogRow(null)}
          onConfirm={(lotNumber) =>
            administerMutation.mutate({ vaccinationId: dialogRow.id, lotNumber })
          }
          isPending={administerMutation.isPending}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg",
          toast.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800",
        )}>
          {toast.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <XCircle className="size-4 shrink-0" />}
          {toast.text}
        </div>
      )}
    </div>
  );
}
