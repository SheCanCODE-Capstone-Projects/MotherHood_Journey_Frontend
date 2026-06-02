"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Baby,
  CalendarDays,
  CheckCircle2,
  Heart,
  Loader2,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";

import { useRole } from "@/shared/hooks/useRole";
import { getPatientPregnancy } from "@/lib/api/patient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short",
  });
}

function daysUntil(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

function trimesterOf(weeks: number): 1 | 2 | 3 {
  if (weeks <= 13) return 1;
  if (weeks <= 26) return 2;
  return 3;
}

// ─── ANC schedule ─────────────────────────────────────────────────────────────

const ANC_VISITS = [
  { visit: 1, week: "8 – 12 wks",  label: "Confirmation & blood tests" },
  { visit: 2, week: "16 wks",      label: "Blood pressure & fetal growth check" },
  { visit: 3, week: "20 – 24 wks", label: "Anatomy ultrasound" },
  { visit: 4, week: "28 wks",      label: "Glucose screening & iron supplementation" },
  { visit: 5, week: "32 wks",      label: "Fetal position check" },
  { visit: 6, week: "36 wks",      label: "Birth plan discussion" },
  { visit: 7, week: "38 wks",      label: "Pre-delivery assessment" },
  { visit: 8, week: "40 wks",      label: "Final check before delivery" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PregnanciesPage() {
  const { roleTheme } = useRole({ fallbackRole: "patient" });

  const { data: pregnancy, isLoading, isError } = useQuery({
    queryKey: ["patient-pregnancy"],
    queryFn: getPatientPregnancy,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-32 text-sm text-gray-400">
        <Loader2 className="size-4 animate-spin" /> Loading pregnancy record…
      </div>
    );
  }

  if (isError || !pregnancy) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <XCircle className="mx-auto size-10 text-red-300" />
        <p className="mt-3 text-sm text-gray-500">
          No active pregnancy found. Contact your facility if this is unexpected.
        </p>
      </div>
    );
  }

  const trimester = trimesterOf(pregnancy.gestational_age_weeks);
  const pregPct   = Math.min(100, Math.round((pregnancy.gestational_age_weeks / 40) * 100));
  const ancPct    = Math.round((pregnancy.anc_visits_completed / pregnancy.anc_visits_total) * 100);
  const days      = daysUntil(pregnancy.estimated_due_date);

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">

      {/* ── Page title ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Pregnancy</h1>
        <p className="mt-0.5 text-xs text-gray-500">
          Antenatal care progress and upcoming milestones.
        </p>
      </div>

      {/* ── Split hero: EDD card + ANC card ── */}
      <div className="grid gap-3 sm:grid-cols-2">

        {/* Left — EDD + trimester progress */}
        <div className="overflow-hidden rounded-2xl shadow-sm" style={{ backgroundColor: "#164247" }}>
          <div className="p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white/90">
              <Heart className="size-2.5 fill-rose-400 text-rose-400" />
              ACTIVE PREGNANCY
            </span>

            <p className="mt-4 text-2xl font-bold leading-tight text-white">
              EDD {fmtDateLong(pregnancy.estimated_due_date)}
            </p>
            <p className="mt-1 text-sm text-white/60">
              Trimester {trimester} &bull; {days} days remaining
            </p>

            {/* Progress bar with trimester markers */}
            <div className="mt-4">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#5DCAA5] transition-all"
                  style={{ width: `${pregPct}%` }}
                />
                <div className="absolute top-0 h-full w-px bg-white/40" style={{ left: "32.5%" }} />
                <div className="absolute top-0 h-full w-px bg-white/40" style={{ left: "65%" }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[9px] font-medium text-white/40">
                <span>T1</span>
                <span>T2</span>
                <span>T3</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
              Current
            </p>
            <p className="mt-0.5 text-lg font-bold text-white">
              Week {pregnancy.gestational_age_weeks}
            </p>
          </div>
        </div>

        {/* Right — ANC progress metrics */}
        <div
          className="flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              ANC Visits
            </p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-3xl font-bold" style={{ color: roleTheme.accent }}>
                {pregnancy.anc_visits_completed}
              </p>
              <p className="mb-1 text-sm text-gray-400">
                / {pregnancy.anc_visits_total} visits
              </p>
            </div>

            {/* ANC completion bar */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="font-semibold" style={{ color: roleTheme.accent }}>
                  {ancPct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${ancPct}%`, backgroundColor: roleTheme.accent }}
                />
              </div>
            </div>
          </div>

          {/* Visit dates */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Last visit</span>
              <span className="font-medium text-gray-700">
                {pregnancy.last_visit_date ? fmtDate(pregnancy.last_visit_date) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Next visit</span>
              <span className="font-semibold" style={{ color: roleTheme.accent }}>
                {pregnancy.next_visit_date ? fmtDate(pregnancy.next_visit_date) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Facility + CHW ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div
            className="grid size-9 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: roleTheme.accentSoft }}
          >
            <MapPin className="size-4" style={{ color: roleTheme.accent }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Facility
            </p>
            <p className="truncate text-sm font-semibold text-gray-900">
              {pregnancy.facility_name}
            </p>
          </div>
        </div>

        {pregnancy.chw ? (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: roleTheme.accent }}
            >
              {pregnancy.chw.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Community Health Worker
              </p>
              <p className="truncate text-sm font-semibold text-gray-900">
                {pregnancy.chw.name}
              </p>
              <p className="text-xs text-gray-400">{pregnancy.chw.phone}</p>
            </div>
            <a
              href={`tel:${pregnancy.chw.phone.replace(/\s/g, "")}`}
              className="grid size-8 shrink-0 place-items-center rounded-xl text-white"
              style={{ backgroundColor: roleTheme.accent }}
              title="Call CHW"
            >
              <Phone className="size-3.5" />
            </a>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: roleTheme.accentSoft }}
            >
              <Baby className="size-4" style={{ color: roleTheme.accent }} />
            </div>
            <p className="text-sm text-gray-400">No CHW assigned yet.</p>
          </div>
        )}
      </div>

      {/* ── ANC visit timeline ── */}
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        <div className="flex items-center justify-between border-b px-5 py-3.5" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-sm font-semibold text-gray-900">ANC Visit Schedule</h2>
          </div>
          <span className="text-xs text-gray-400">
            {pregnancy.anc_visits_completed} / {pregnancy.anc_visits_total} completed
          </span>
        </div>

        <div className="px-5 py-4">
          {ANC_VISITS.map((v, idx) => {
            const done    = v.visit <= pregnancy.anc_visits_completed;
            const current = v.visit === pregnancy.anc_visits_completed + 1;
            const isLast  = idx === ANC_VISITS.length - 1;

            return (
              <div key={v.visit} className="flex gap-4">
                {/* Spine */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold"
                    style={
                      done
                        ? { backgroundColor: roleTheme.accent, borderColor: roleTheme.accent, color: "#fff" }
                        : current
                        ? { backgroundColor: "#fff", borderColor: roleTheme.accent, color: roleTheme.accent }
                        : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#D1D5DB" }
                    }
                  >
                    {done ? <CheckCircle2 className="size-3.5" /> : v.visit}
                  </div>
                  {!isLast && (
                    <div
                      className="my-0.5 w-px flex-1"
                      style={{
                        backgroundColor: done ? roleTheme.accent : "#E5E7EB",
                        minHeight: "1.75rem",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: done || current ? "#111827" : "#9CA3AF" }}
                    >
                      Visit {v.visit}
                    </p>
                    <span className="text-xs text-gray-400">{v.week}</span>

                    {done && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        DONE
                      </span>
                    )}
                    {current && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                      >
                        Next{pregnancy.next_visit_date
                          ? ` · ${fmtShort(pregnancy.next_visit_date)}`
                          : ""}
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: done || current ? "#6B7280" : "#D1D5DB" }}
                  >
                    {v.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Next visit banner ── */}
      {pregnancy.next_visit_date && (
        <div
          className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
          style={{ backgroundColor: roleTheme.accentSoft }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              Next visit:{" "}
              <span className="font-bold">{fmtDateLong(pregnancy.next_visit_date)}</span>
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs" style={{ color: roleTheme.accent }}>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {pregnancy.facility_name}
              </span>
              {pregnancy.next_visit_provider && (
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {pregnancy.next_visit_provider}
                </span>
              )}
            </div>
          </div>
          <Link
            href="/appointments"
            className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <CalendarDays className="mr-1.5 inline size-3.5" />
            View schedule
          </Link>
        </div>
      )}
    </div>
  );
}
