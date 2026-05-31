"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Baby,
  CalendarDays,
  Heart,
  Phone,
  ArrowRight,
} from "lucide-react";

import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import {
  getPatientPregnancy,
  getPatientChildren,
  getPatientAppointments,
  type PatientChild,
} from "@/lib/api/patient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtEdd(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

function trimesterLabel(weeks: number) {
  if (weeks <= 13) return "Trimester 1";
  if (weeks <= 27) return "Trimester 2";
  return "Trimester 3";
}

function ageLabel(dob: string) {
  const months = Math.floor(
    (Date.now() - new Date(dob).getTime()) / (30.44 * 24 * 60 * 60 * 1000),
  );
  if (months < 1) return "Newborn";
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return mo > 0 ? `${y}y ${mo}mo` : `${y}y`;
}

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const APPT_LABELS: Record<string, string> = {
  ANC: "Antenatal Care",
  PNC: "Postnatal Care",
  IMMUNIZATION: "Immunization",
  SICK_CHILD: "Sick Child",
  GROWTH_MONITORING: "Growth Monitoring",
  GENERAL: "General Checkup",
};

// ─── Inline vaccination badge ─────────────────────────────────────────────────

function VaxBadge({ child }: { child: PatientChild }) {
  if (child.vaccination_status === "OVERDUE") {
    return (
      <span className="mt-1.5 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
        OVERDUE
      </span>
    );
  }
  if (child.vaccination_status === "DUE_SOON") {
    const label = child.next_vaccination_name
      ? `DUE: ${child.next_vaccination_name.split(" ")[0].toUpperCase()}`
      : "DUE SOON";
    return (
      <span className="mt-1.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
        {label}
      </span>
    );
  }
  return (
    <span className="mt-1.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
      UP TO DATE
    </span>
  );
}

// ─── Skeletons ─────────────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/20", className)} />;
}

function SkLight({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-gray-100", className)} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientDashboard() {
  const { roleTheme, displayName } = useRole({ fallbackRole: "patient" });

  const pregnancyQuery = useQuery({
    queryKey: ["patient-pregnancy"],
    queryFn: getPatientPregnancy,
  });

  const childrenQuery = useQuery({
    queryKey: ["patient-children"],
    queryFn: getPatientChildren,
  });

  const appointmentsQuery = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: getPatientAppointments,
  });

  const pregnancy = pregnancyQuery.data ?? null;
  const children  = childrenQuery.data ?? [];
  const nextAppt  = (appointmentsQuery.data ?? []).find((a) => a.status === "SCHEDULED") ?? null;

  const firstName = displayName.split(" ")[0];

  return (
    <div className="space-y-4 p-4 sm:p-6">

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900" suppressHydrationWarning>
          Welcome back, {firstName}
        </h1>
        <p className="mt-0.5 text-xs text-gray-500">
          {pregnancy?.facility_name ?? "Motherhood Journey"} &bull; Maternal Care Program
        </p>
      </div>

      {/* ── Pregnancy + CHW (side by side on desktop) ── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">

        {/* Pregnancy card */}
        <div
          className="flex-1 overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: "#164247" }}
        >
          {pregnancyQuery.isLoading ? (
            <div className="space-y-3 p-5">
              <Sk className="h-5 w-32" />
              <Sk className="h-7 w-44" />
              <Sk className="h-3.5 w-36" />
              <Sk className="h-2 w-full rounded-full" />
            </div>
          ) : pregnancy && pregnancy.status === "ACTIVE" ? (
            <div className="p-5">
              {/* Badge row */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white/90">
                  <Heart className="size-2.5 fill-rose-400 text-rose-400" />
                  ACTIVE PREGNANCY
                </span>
                <span className="text-xs font-semibold text-white/60">
                  Week {pregnancy.gestational_age_weeks}
                </span>
              </div>

              {/* EDD */}
              <p className="mt-3 text-2xl font-bold text-white">
                EDD {fmtEdd(pregnancy.estimated_due_date)}
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                {trimesterLabel(pregnancy.gestational_age_weeks)}{" "}
                &bull; {daysUntil(pregnancy.estimated_due_date)} days remaining
              </p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-[#5DCAA5]"
                    style={{ width: `${Math.min(100, Math.round((pregnancy.gestational_age_weeks / 40) * 100))}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-white/40">
                  <span>Wk 1</span>
                  <span>Wk 40</span>
                </div>
              </div>

              {/* ANC inline */}
              <p className="mt-3 text-xs text-white/60">
                ANC visits:{" "}
                <span className="font-semibold text-white">
                  {pregnancy.anc_visits_completed} / {pregnancy.anc_visits_total}
                </span>
                {pregnancy.next_visit_date && (
                  <>
                    {" "}
                    &bull; Next:{" "}
                    <span className="font-semibold text-white">
                      {fmtEdd(pregnancy.next_visit_date)}
                    </span>
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-5">
              <Heart className="size-8 text-white/30" />
              <p className="text-sm text-white/60">No active pregnancy on record.</p>
            </div>
          )}
        </div>

        {/* CHW card */}
        {!pregnancyQuery.isLoading && pregnancy?.chw ? (
          <div
            className="flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm lg:w-52"
            style={{ borderColor: roleTheme.border }}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Community Health Worker
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: roleTheme.accent }}
                >
                  {pregnancy.chw.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {pregnancy.chw.name}
                  </p>
                  <p className="text-xs text-gray-400">{pregnancy.chw.sector}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{pregnancy.chw.phone}</p>
            </div>
            <a
              href={`tel:${pregnancy.chw.phone.replace(/\s/g, "")}`}
              className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-white"
              style={{ backgroundColor: roleTheme.accent }}
            >
              <Phone className="size-3.5" />
              Hamagara / Call
            </a>
          </div>
        ) : pregnancyQuery.isLoading ? (
          <div
            className="rounded-2xl border bg-white p-4 shadow-sm lg:w-52"
            style={{ borderColor: roleTheme.border }}
          >
            <SkLight className="h-3 w-28 mb-3" />
            <div className="flex items-center gap-2 mb-3">
              <SkLight className="size-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <SkLight className="h-3.5 w-24" />
                <SkLight className="h-2.5 w-16" />
              </div>
            </div>
            <SkLight className="h-8 w-full rounded-xl" />
          </div>
        ) : null}
      </div>

      {/* ── Children — horizontal scroll cards ── */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            My Children
            {!childrenQuery.isLoading && (
              <span className="ml-1 font-normal text-gray-400">({children.length})</span>
            )}
          </h2>
          <Link
            href="/my-children"
            className="flex items-center gap-1 text-xs font-semibold hover:opacity-70"
            style={{ color: roleTheme.accent }}
          >
            View All <ArrowRight className="size-3" />
          </Link>
        </div>

        {childrenQuery.isLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-32 shrink-0 rounded-2xl border bg-white p-3 shadow-sm"
                style={{ borderColor: roleTheme.border }}
              >
                <SkLight className="mx-auto size-10 rounded-full" />
                <SkLight className="mx-auto mt-2 h-3.5 w-16" />
                <SkLight className="mx-auto mt-1.5 h-2.5 w-12" />
                <SkLight className="mx-auto mt-2 h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : children.length === 0 ? (
          <div
            className="rounded-2xl border-2 border-dashed p-6 text-center"
            style={{ borderColor: roleTheme.border }}
          >
            <Baby className="mx-auto size-7 text-gray-300" />
            <p className="mt-1.5 text-xs text-gray-400">No children registered yet.</p>
          </div>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/children/${child.id}/vaccinations`}
                className="w-32 shrink-0 rounded-2xl border bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md"
                style={{ borderColor: roleTheme.border }}
              >
                <div
                  className="mx-auto grid size-10 place-items-center rounded-full text-base font-bold text-white"
                  style={{ backgroundColor: roleTheme.accent }}
                >
                  {child.first_name.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-900 truncate">
                  {child.first_name}
                </p>
                <p className="text-[10px] text-gray-400">{ageLabel(child.date_of_birth)}</p>
                <VaxBadge child={child} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Next appointment — single-line subtle row ── */}
      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Next Appointment
        </h2>

        {appointmentsQuery.isLoading ? (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            <SkLight className="h-9 w-9 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <SkLight className="h-3.5 w-32" />
              <SkLight className="h-2.5 w-44" />
            </div>
          </div>
        ) : nextAppt ? (
          <Link
            href="/appointments"
            className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
            style={{ borderColor: roleTheme.border }}
          >
            {/* Date badge */}
            <div
              className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: roleTheme.accent }}
            >
              <span className="text-[9px] font-semibold leading-none uppercase">
                {new Date(nextAppt.scheduled_date).toLocaleDateString("en-GB", { month: "short" })}
              </span>
              <span className="text-sm font-bold leading-tight">
                {new Date(nextAppt.scheduled_date).getDate()}
              </span>
            </div>
            {/* Details */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {APPT_LABELS[nextAppt.appointment_type] ?? nextAppt.appointment_type}
              </p>
              <p className="truncate text-xs text-gray-400">
                {fmtTime(nextAppt.scheduled_time)} &bull; {nextAppt.provider_name}
              </p>
            </div>
            <ArrowRight className="size-3.5 shrink-0 text-gray-300" />
          </Link>
        ) : (
          <div
            className="rounded-2xl border bg-white px-4 py-3 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            <p className="text-xs text-gray-400">No upcoming appointments. Contact your health facility to schedule a visit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
