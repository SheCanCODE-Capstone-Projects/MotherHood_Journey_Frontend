"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Baby,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  Heart,
  Leaf,
  Loader2,
  Shield,
  Stethoscope,
  Zap,
} from "lucide-react";

import { useRole } from "@/shared/hooks/useRole";
import { APPOINTMENT_TYPE_LABELS } from "@/features/appointment/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentType =
  | "PRENATAL_CHECKUP"
  | "POSTNATAL_CHECKUP"
  | "IMMUNIZATION"
  | "NUTRITIONAL_COUNSELING"
  | "DELIVERY_PREPARATION"
  | "LABORATORY_TEST"
  | "ULTRASOUND"
  | "OTHER";

const TYPE_OPTIONS: AppointmentType[] = [
  "PRENATAL_CHECKUP",
  "POSTNATAL_CHECKUP",
  "IMMUNIZATION",
  "NUTRITIONAL_COUNSELING",
  "DELIVERY_PREPARATION",
  "LABORATORY_TEST",
  "ULTRASOUND",
  "OTHER",
];

// ─── Service config ────────────────────────────────────────────────────────────

const SERVICE_CONFIG: Record<AppointmentType, {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}> = {
  PRENATAL_CHECKUP:       { icon: Baby,         iconColor: "#164247", iconBg: "#E8F5F3" },
  POSTNATAL_CHECKUP:      { icon: Heart,        iconColor: "#BE185D", iconBg: "#FCE7F3" },
  IMMUNIZATION:           { icon: Shield,       iconColor: "#1E40AF", iconBg: "#DBEAFE" },
  NUTRITIONAL_COUNSELING: { icon: Leaf,         iconColor: "#065F46", iconBg: "#D1FAE5" },
  DELIVERY_PREPARATION:   { icon: CalendarCheck, iconColor: "#6B21A8", iconBg: "#F3E8FF" },
  LABORATORY_TEST:        { icon: FlaskConical, iconColor: "#92400E", iconBg: "#FEF3C7" },
  ULTRASOUND:             { icon: Activity,     iconColor: "#0E7490", iconBg: "#CFFAFE" },
  OTHER:                  { icon: Stethoscope,  iconColor: "#374151", iconBg: "#F3F4F6" },
};

// ─── Time slots ───────────────────────────────────────────────────────────────

const TIME_GROUPS = [
  { label: "Morning",   times: ["08:00", "09:00", "10:00", "11:00"] },
  { label: "Afternoon", times: ["13:00", "14:00", "15:00", "16:00"] },
  { label: "Evening",   times: ["17:00", "18:00"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function fmtDate(s: string) {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AppointmentRequestPage() {
  const router = useRouter();
  const { roleTheme } = useRole({ fallbackRole: "patient" });

  const [serviceType, setServiceType] = useState<AppointmentType>("PRENATAL_CHECKUP");
  const [preferredDate, setPreferredDate]  = useState("");
  const [preferredTime, setPreferredTime]  = useState("");
  const [reason, setReason]                = useState("");
  const [isSubmitting, setIsSubmitting]    = useState(false);
  const [isSubmitted, setIsSubmitted]      = useState(false);

  const cfg  = SERVICE_CONFIG[serviceType];
  const Icon = cfg.icon;
  const today = new Date().toISOString().split("T")[0];
  const canSubmit = !!preferredDate && !!preferredTime && !isSubmitting && !isSubmitted;

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.setTimeout(() => router.push("/appointments"), 2000);
    }, 900);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-8 text-center">
        <div
          className="grid size-24 place-items-center rounded-full"
          style={{ backgroundColor: roleTheme.accentSoft }}
        >
          <CheckCircle2 className="size-12" style={{ color: roleTheme.accent }} />
        </div>
        <div className="max-w-xs">
          <h2 className="text-xl font-bold text-gray-900">Request Submitted!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your{" "}
            <span className="font-semibold text-gray-700">
              {APPOINTMENT_TYPE_LABELS[serviceType]}
            </span>{" "}
            request for{" "}
            <span className="font-semibold text-gray-700">
              {fmtDate(preferredDate)} at {fmtTime(preferredTime)}
            </span>{" "}
            has been submitted. The care team will confirm shortly.
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Loader2 className="size-3 animate-spin" />
          Redirecting to appointments…
        </p>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/appointments"
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Request Appointment</h1>
          <p className="text-xs text-gray-500">
            Complete the steps below to submit your request.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Step 1: Service type ── */}
        <div
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div
            className="flex items-center gap-2 border-b px-5 py-3"
            style={{ borderColor: roleTheme.border }}
          >
            <span
              className="grid size-5 place-items-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: roleTheme.accent }}
            >
              1
            </span>
            <p className="text-sm font-semibold text-gray-700">Choose a service</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-4">
            {TYPE_OPTIONS.map((type) => {
              const c     = SERVICE_CONFIG[type];
              const CIcon = c.icon;
              const sel   = serviceType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className="flex flex-col items-center gap-2.5 rounded-2xl border-2 px-2 py-3.5 text-center transition-all"
                  style={{
                    borderColor: sel ? roleTheme.accent : "#E5E7EB",
                    backgroundColor: sel ? roleTheme.accentSoft : "#FAFAFA",
                  }}
                >
                  <div
                    className="grid size-10 place-items-center rounded-xl"
                    style={{ backgroundColor: c.iconBg }}
                  >
                    <CIcon
                      className="size-5"
                      style={{ color: sel ? roleTheme.accent : c.iconColor }}
                    />
                  </div>
                  <p
                    className="text-[11px] font-semibold leading-tight"
                    style={{ color: sel ? roleTheme.accent : "#4B5563" }}
                  >
                    {APPOINTMENT_TYPE_LABELS[type]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Date & Time ── */}
        <div
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div
            className="flex items-center gap-2 border-b px-5 py-3"
            style={{ borderColor: roleTheme.border }}
          >
            <span
              className="grid size-5 place-items-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: preferredDate && preferredTime ? roleTheme.accent : "#D1D5DB" }}
            >
              2
            </span>
            <p className="text-sm font-semibold text-gray-700">Pick a date &amp; time</p>
          </div>

          <div className="space-y-5 p-5">
            {/* Date */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Preferred date
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                  />
                  <input
                    type="date"
                    value={preferredDate}
                    min={today}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="h-11 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#2C8A84] focus:bg-white"
                  />
                </div>
                {preferredDate && (
                  <span className="text-sm font-medium text-gray-600">
                    {fmtDate(preferredDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Preferred time
              </label>
              <div className="space-y-3">
                {TIME_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.times.map((t) => {
                        const sel = preferredTime === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPreferredTime(t)}
                            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                            style={{
                              backgroundColor: sel ? roleTheme.accent : "#F3F4F6",
                              color: sel ? "#fff" : "#374151",
                              boxShadow: sel ? `0 0 0 2px ${roleTheme.accent}30` : undefined,
                            }}
                          >
                            {fmtTime(t)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 3: Notes ── */}
        <div
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div
            className="flex items-center gap-2 border-b px-5 py-3"
            style={{ borderColor: roleTheme.border }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500">
              3
            </span>
            <p className="text-sm font-semibold text-gray-700">
              Add a note{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </p>
          </div>

          <div className="p-5">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Describe your symptoms, the reason for this visit, or any specific concerns you'd like to share with your care team…"
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#2C8A84] focus:bg-white"
            />
          </div>
        </div>

        {/* ── Summary + Submit ── */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: roleTheme.accentSoft }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Summary */}
            <div className="flex items-center gap-3">
              <div
                className="grid size-11 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: cfg.iconBg }}
              >
                <Icon className="size-5" style={{ color: roleTheme.accent }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: roleTheme.text }}>
                  {APPOINTMENT_TYPE_LABELS[serviceType]}
                </p>
                <p className="text-xs" style={{ color: roleTheme.accent }}>
                  {preferredDate && preferredTime
                    ? `${fmtDate(preferredDate)} · ${fmtTime(preferredTime)}`
                    : preferredDate
                    ? `${fmtDate(preferredDate)} · select a time`
                    : "Select a date and time to continue"}
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex h-11 shrink-0 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: roleTheme.accent }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  Send request
                </>
              )}
            </button>
          </div>

          {/* Validation hint */}
          {(!preferredDate || !preferredTime) && (
            <p className="mt-2 text-xs" style={{ color: roleTheme.accent }}>
              {!preferredDate
                ? "Please select a preferred date to continue."
                : "Please select a preferred time to continue."}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
