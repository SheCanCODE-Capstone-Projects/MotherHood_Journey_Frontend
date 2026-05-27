"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  Building2,
  CheckCircle2,
  FlaskConical,
  Info,
  Lock,
  Loader2,
  XCircle,
} from "lucide-react";

import { useRole } from "@/shared/hooks/useRole";
import {
  getAllConsents,
  grantConsent,
  revokeConsent,
  type ConsentRecord,
  type ConsentType,
} from "@/lib/api/consent";

// ─── Config ───────────────────────────────────────────────────────────────────

const CONSENT_CONFIG: Record<
  ConsentType,
  {
    title: string;
    description: string;
    icon: typeof Building2;
    iconBg: string;
    iconColor: string;
    warning?: string;
  }
> = {
  GOV_DATA_SHARE: {
    title: "Government Data Sharing",
    description:
      "Allow your health data to be shared with government health systems for coordinated care and public health monitoring.",
    icon: Building2,
    iconBg: "#DBEAFE",
    iconColor: "#1E40AF",
    warning:
      "Revoking this consent may affect your ability to receive coordinated care across facilities. Your data will no longer be shared with government health systems.",
  },
  SMS_REMINDERS: {
    title: "SMS Reminders",
    description:
      "Receive automated SMS reminders for upcoming appointments, medication schedules, and important health check-ups.",
    icon: Bell,
    iconBg: "#D1FAE5",
    iconColor: "#065F46",
  },
  RESEARCH_PARTICIPATION: {
    title: "Research Participation",
    description:
      "Contribute your anonymized health data to medical research studies that help improve maternal and child healthcare.",
    icon: FlaskConical,
    iconBg: "#F3E8FF",
    iconColor: "#6B21A8",
  },
  FACILITY_TRANSFER: {
    title: "Facility Transfer",
    description:
      "Allow your medical records to be transferred between healthcare facilities when needed for your care.",
    icon: ArrowLeftRight,
    iconBg: "#FEF3C7",
    iconColor: "#92400E",
  },
};

const CONSENT_ORDER: ConsentType[] = [
  "GOV_DATA_SHARE",
  "SMS_REMINDERS",
  "RESEARCH_PARTICIPATION",
  "FACILITY_TRANSFER",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(s: string) {
  try { return format(new Date(s), "d MMM yyyy"); }
  catch { return s; }
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
  accent,
}: {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  accent: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
      style={{ backgroundColor: checked ? accent : "#D1D5DB" }}
    >
      <span
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ left: checked ? "calc(100% - 1.25rem)" : "0.25rem" }}
      />
    </button>
  );
}

// ─── Warning dialog ───────────────────────────────────────────────────────────

function RevokeWarningDialog({
  consent,
  warning,
  onClose,
  onConfirm,
  isPending,
}: {
  consent: ConsentRecord;
  warning: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50">
            <AlertTriangle className="size-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Revoke Consent</h3>
            <p className="mt-0.5 text-xs text-gray-400">This change takes effect immediately</p>
          </div>
        </div>
        <p className="mb-5 text-sm text-gray-600">{warning}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep consent
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending
              ? <span className="flex items-center justify-center gap-1.5"><Loader2 className="size-3.5 animate-spin" /> Revoking…</span>
              : "Yes, revoke"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PatientConsentPage() {
  const { roleTheme } = useRole({ fallbackRole: "patient" });
  const queryClient = useQueryClient();
  const patientId = "1";

  const [warningTarget, setWarningTarget] = useState<ConsentRecord | null>(null);

  const { data: consents = [], isLoading } = useQuery({
    queryKey: ["consents", patientId],
    queryFn: () => getAllConsents(patientId),
  });

  const grantMutation = useMutation({
    mutationFn: (type: ConsentType) =>
      grantConsent(patientId, {
        consentType: type,
        grantedDate: new Date().toISOString(),
        expiryDate:
          type === "GOV_DATA_SHARE" || type === "FACILITY_TRANSFER"
            ? new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["consents"] }),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeConsent(id),
    onSuccess: () => {
      setWarningTarget(null);
      void queryClient.invalidateQueries({ queryKey: ["consents"] });
    },
  });

  const byType = (type: ConsentType) => consents.find((c) => c.consentType === type);

  const handleToggle = (type: ConsentType) => {
    const existing = byType(type);
    if (!existing || existing.status === "REVOKED") {
      grantMutation.mutate(type);
    } else if (CONSENT_CONFIG[type].warning) {
      setWarningTarget(existing);
    } else {
      revokeMutation.mutate(existing.id);
    }
  };

  const isBusy = isLoading || grantMutation.isPending || revokeMutation.isPending;
  const grantedCount = consents.filter((c) => c.status === "GRANTED").length;

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Privacy &amp; Consents</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Control how your health data is used and shared.
        </p>
      </div>

      {/* ── Summary banner ── */}
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3"
        style={{ backgroundColor: roleTheme.accentSoft, borderColor: roleTheme.border }}
      >
        <Lock className="mt-0.5 size-4 shrink-0" style={{ color: roleTheme.accent }} />
        <p className="text-sm" style={{ color: roleTheme.text }}>
          {isLoading
            ? "Loading your consent preferences…"
            : grantedCount === 0
            ? "You have not granted any consents. Toggle the items below to enable sharing."
            : `You have granted ${grantedCount} of ${CONSENT_ORDER.length} consents. Changes take effect immediately.`
          }
        </p>
      </div>

      {/* ── Consent list ── */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
        {CONSENT_ORDER.map((type, idx) => {
          const cfg     = CONSENT_CONFIG[type];
          const record  = byType(type);
          const granted = record?.status === "GRANTED";
          const Icon    = cfg.icon;
          const isLast  = idx === CONSENT_ORDER.length - 1;

          return (
            <div key={type}>
              <div
                className="flex items-start gap-4 px-5 py-4 transition-colors"
                style={granted ? { backgroundColor: `${roleTheme.accentSoft}60` } : undefined}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl"
                  style={{ backgroundColor: cfg.iconBg }}
                >
                  <Icon className="size-4" style={{ color: cfg.iconColor }} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{cfg.title}</p>
                    {granted
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="size-2.5" /> GRANTED
                        </span>
                      : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                          <XCircle className="size-2.5" /> REVOKED
                        </span>
                    }
                  </div>

                  <p className="mt-0.5 text-xs text-gray-500">{cfg.description}</p>

                  {/* Dates shown when granted */}
                  {granted && record && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      {record.grantedDate && (
                        <span>Granted: <span className="font-medium text-gray-600">{fmtDate(record.grantedDate)}</span></span>
                      )}
                      {record.expiryDate && (
                        <span>Expires: <span className="font-medium text-gray-600">{fmtDate(record.expiryDate)}</span></span>
                      )}
                    </div>
                  )}
                </div>

                {/* Toggle */}
                <div className="mt-0.5">
                  <Toggle
                    checked={granted}
                    onChange={() => handleToggle(type)}
                    disabled={isBusy}
                    accent={roleTheme.accent}
                  />
                </div>
              </div>

              {!isLast && (
                <div className="mx-5 border-t" style={{ borderColor: roleTheme.border }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Legal note ── */}
      <div className="flex items-start gap-2 text-xs text-gray-400">
        <Info className="mt-px size-3.5 shrink-0" />
        <p>
          Your consents are stored securely and governed by applicable Rwandan health data
          protection regulations. You can withdraw consent at any time.
        </p>
      </div>

      {/* Warning dialog */}
      {warningTarget && (
        <RevokeWarningDialog
          consent={warningTarget}
          warning={CONSENT_CONFIG[warningTarget.consentType as ConsentType].warning!}
          onClose={() => setWarningTarget(null)}
          onConfirm={() => revokeMutation.mutate(warningTarget.id)}
          isPending={revokeMutation.isPending}
        />
      )}
    </div>
  );
}
