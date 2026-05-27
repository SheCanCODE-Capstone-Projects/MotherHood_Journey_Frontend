"use client";

import { useState, useMemo } from "react";
import {
  addDays,
  addWeeks,
  format,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Clock, User, X } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

type AppointmentType = "ANC" | "PNC" | "VACCINATION" | "GROWTH_CHECK" | "FOLLOW_UP";
type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

interface Appointment {
  id: string;
  patientName: string;
  type: AppointmentType;
  date: string; // "yyyy-MM-dd"
  hour: number; // 7–17
  status: AppointmentStatus;
}

// ── Config ─────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 11 }, (_, i) => i + 7); // 07:00 → 17:00
const MAX_SLOTS = HOURS.length; // 11 bookable slots per day

const TYPE_CONFIG: Record<AppointmentType, { bgClass: string; label: string }> = {
  ANC:          { bgClass: "bg-[#1D5052]",   label: "ANC" },
  PNC:          { bgClass: "bg-[#2F7F7A]",   label: "PNC" },
  VACCINATION:  { bgClass: "bg-emerald-600", label: "Vaccination" },
  GROWTH_CHECK: { bgClass: "bg-blue-600",    label: "Growth Check" },
  FOLLOW_UP:    { bgClass: "bg-amber-500",   label: "Follow-up" },
};

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; style: string }> = {
  SCHEDULED: { label: "Scheduled", style: "bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Completed", style: "bg-emerald-50 text-emerald-700" },
  NO_SHOW:   { label: "No Show",   style: "bg-red-50 text-red-700" },
  CANCELLED: { label: "Cancelled", style: "bg-slate-100 text-slate-500" },
};

// ── Mock data ──────────────────────────────────────────────────────────────

function getMockAppointments(weekStart: Date): Appointment[] {
  const d = (i: number) => format(addDays(weekStart, i), "yyyy-MM-dd");
  return [
    { id: "a1",  patientName: "Uwimana Marie",       type: "ANC",          date: d(0), hour: 8,  status: "COMPLETED"  },
    { id: "a2",  patientName: "Mukamana Jeanne",      type: "VACCINATION",  date: d(0), hour: 9,  status: "COMPLETED"  },
    { id: "a3",  patientName: "Nyiramongi Alice",     type: "PNC",          date: d(0), hour: 11, status: "NO_SHOW"    },
    { id: "a4",  patientName: "Uwase Beatrice",       type: "ANC",          date: d(1), hour: 7,  status: "COMPLETED"  },
    { id: "a5",  patientName: "Mukandayisenga Olive", type: "GROWTH_CHECK", date: d(1), hour: 10, status: "COMPLETED"  },
    { id: "a6",  patientName: "Nyirahabimana Diane",  type: "FOLLOW_UP",    date: d(1), hour: 14, status: "SCHEDULED"  },
    { id: "a7",  patientName: "Uwimana Angelique",    type: "VACCINATION",  date: d(2), hour: 8,  status: "SCHEDULED"  },
    { id: "a8",  patientName: "Mukamana Grace",       type: "ANC",          date: d(2), hour: 9,  status: "SCHEDULED"  },
    { id: "a9",  patientName: "Umulisa Claire",       type: "PNC",          date: d(2), hour: 13, status: "SCHEDULED"  },
    { id: "a10", patientName: "Nyiranziza Espoir",    type: "GROWTH_CHECK", date: d(3), hour: 7,  status: "SCHEDULED"  },
    { id: "a11", patientName: "Uwamariya Solange",    type: "ANC",          date: d(3), hour: 11, status: "SCHEDULED"  },
    { id: "a12", patientName: "Mukamana Fabiola",     type: "FOLLOW_UP",    date: d(3), hour: 15, status: "CANCELLED"  },
    { id: "a13", patientName: "Nyiraneza Emilie",     type: "VACCINATION",  date: d(4), hour: 8,  status: "SCHEDULED"  },
    { id: "a14", patientName: "Uwimana Delphine",     type: "ANC",          date: d(4), hour: 10, status: "SCHEDULED"  },
    { id: "a15", patientName: "Mukamana Immaculee",   type: "PNC",          date: d(4), hour: 14, status: "SCHEDULED"  },
    { id: "a16", patientName: "Niyonzima Christine",  type: "GROWTH_CHECK", date: d(5), hour: 9,  status: "SCHEDULED"  },
    { id: "a17", patientName: "Uwase Josephine",      type: "VACCINATION",  date: d(5), hour: 11, status: "SCHEDULED"  },
  ];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function FacilityAppointmentsPage() {
  const { roleTheme } = useRole({ fallbackRole: "facility_admin" });

  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selected, setSelected] = useState<Appointment | null>(null);
  // Mobile: which day is selected in the day-list view
  const [mobileDayIdx, setMobileDayIdx] = useState<number>(() => {
    const today = new Date();
    const ws = startOfWeek(today, { weekStartsOn: 1 });
    const diff = Math.floor((today.getTime() - ws.getTime()) / 86_400_000);
    return Math.max(0, Math.min(6, diff));
  });

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const appointments = useMemo(
    () => getMockAppointments(weekStart),
    [weekStart],
  );

  // O(1) cell lookup: "yyyy-MM-dd-HH" → Appointment
  const apptMap = useMemo(() => {
    const map = new Map<string, Appointment>();
    for (const a of appointments) {
      map.set(`${a.date}-${a.hour}`, a);
    }
    return map;
  }, [appointments]);

  // Per-day capacity: count SCHEDULED + COMPLETED only
  const dayCapacity = useMemo(
    () =>
      weekDays.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const booked = appointments.filter(
          (a) =>
            a.date === dateStr &&
            (a.status === "SCHEDULED" || a.status === "COMPLETED"),
        ).length;
        return { booked, total: MAX_SLOTS };
      }),
    [weekDays, appointments],
  );

  const weekLabel = `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;

  // Mobile: appointments for the currently selected day
  const mobileDayAppts = useMemo(() => {
    const dateStr = format(weekDays[mobileDayIdx], "yyyy-MM-dd");
    return appointments
      .filter((a) => a.date === dateStr)
      .sort((a, b) => a.hour - b.hour);
  }, [appointments, weekDays, mobileDayIdx]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Facility Admin"
        title="Appointment Calendar"
        subtitle="Scheduled appointments at this facility."
        action={
          <Button
            variant="outline"
            className="h-10 rounded-full border-[#D5E9E6] bg-white px-5"
            style={{ color: roleTheme.text }}
            onClick={() => {
              setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
              const today = new Date();
              const ws = startOfWeek(today, { weekStartsOn: 1 });
              const diff = Math.floor((today.getTime() - ws.getTime()) / 86_400_000);
              setMobileDayIdx(Math.max(0, Math.min(6, diff)));
            }}
          >
            Today
          </Button>
        }
      />

      {/* ── MOBILE: day picker + list (hidden on sm+) ── */}
      <div className="sm:hidden space-y-4">
        {/* Week nav */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setWeekStart((d) => subWeeks(d, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border text-[#5B8784] transition-colors hover:bg-[#F0FAF8]"
            style={{ borderColor: roleTheme.border }}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-semibold" style={{ color: roleTheme.text }}>
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekStart((d) => addWeeks(d, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border text-[#5B8784] transition-colors hover:bg-[#F0FAF8]"
            style={{ borderColor: roleTheme.border }}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Day selector pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDays.map((day, i) => {
            const active = i === mobileDayIdx;
            const today = isToday(day);
            const dayApptCount = appointments.filter(
              (a) => a.date === format(day, "yyyy-MM-dd"),
            ).length;
            return (
              <button
                key={day.toISOString()}
                onClick={() => setMobileDayIdx(i)}
                className="flex shrink-0 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition-colors"
                style={
                  active
                    ? { backgroundColor: roleTheme.accent, color: "#fff" }
                    : today
                      ? { backgroundColor: roleTheme.accentSoft, color: roleTheme.text }
                      : { backgroundColor: "#F7FBFA", color: "#5B8784" }
                }
              >
                <span>{format(day, "EEE")}</span>
                <span className="text-base font-bold">{format(day, "d")}</span>
                {dayApptCount > 0 && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: active ? "#fff" : roleTheme.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Day appointment list */}
        <div
          className="overflow-hidden rounded-3xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: roleTheme.border }}>
            <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              {format(weekDays[mobileDayIdx], "EEEE, MMMM d")}
            </p>
            <p className="text-xs text-[#5B8784]">
              {mobileDayAppts.length} appointment{mobileDayAppts.length !== 1 ? "s" : ""}
            </p>
          </div>
          {mobileDayAppts.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#5B8784]">
              No appointments scheduled
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: roleTheme.border }}>
              {mobileDayAppts.map((appt) => (
                <button
                  key={appt.id}
                  onClick={() => setSelected(appt)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F8FCFB]"
                >
                  <span
                    className={cn(
                      "shrink-0 rounded-xl px-2.5 py-1 text-xs font-semibold text-white",
                      TYPE_CONFIG[appt.type].bgClass,
                      (appt.status === "CANCELLED" || appt.status === "NO_SHOW") && "opacity-50",
                    )}
                  >
                    {formatHour(appt.hour)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: roleTheme.text }}>
                      {appt.patientName}
                    </p>
                    <p className="text-xs text-[#5B8784]">{TYPE_CONFIG[appt.type].label}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      STATUS_CONFIG[appt.status].style,
                    )}
                  >
                    {STATUS_CONFIG[appt.status].label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP: week navigation + legend (hidden on mobile) ── */}
      <div className="hidden sm:flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-full border border-[#D5E9E6] bg-white p-1">
          <button
            onClick={() => setWeekStart((d) => subWeeks(d, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B8784] transition-colors hover:bg-[#F0FAF8]"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span
            className="min-w-49 px-2 text-center text-sm font-semibold"
            style={{ color: roleTheme.text }}
          >
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekStart((d) => addWeeks(d, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B8784] transition-colors hover:bg-[#F0FAF8]"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {(
            Object.entries(TYPE_CONFIG) as [
              AppointmentType,
              { bgClass: string; label: string },
            ][]
          ).map(([, cfg]) => (
            <span
              key={cfg.label}
              className="flex items-center gap-1.5 text-xs font-medium text-[#54797C]"
            >
              <span
                className={cn("inline-block h-2.5 w-2.5 rounded-sm", cfg.bgClass)}
              />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* Calendar + capacity table — desktop only */}
      <div className="hidden sm:block">
      <div
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-sm">
            {/* Day headers */}
            <thead>
              <tr>
                <th
                  className="w-14 border-b border-r px-3 py-3 text-left text-xs font-semibold text-[#5B8784]"
                  style={{ borderColor: roleTheme.border }}
                />
                {weekDays.map((day) => {
                  const today = isToday(day);
                  return (
                    <th
                      key={day.toISOString()}
                      className="border-b border-r px-2 py-3 text-center text-xs font-semibold last:border-r-0"
                      style={{ borderColor: roleTheme.border }}
                    >
                      <span className="text-[#5B8784]">{format(day, "EEE")}</span>
                      <span
                        className={cn(
                          "mx-auto mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
                          today ? "text-white" : "text-[#1D5052]",
                        )}
                        style={today ? { backgroundColor: roleTheme.accent } : undefined}
                      >
                        {format(day, "d")}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Hour rows */}
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  {/* Time label */}
                  <td
                    className="border-b border-r px-3 py-0 pt-2 align-top text-xs font-medium text-[#5B8784]"
                    style={{ borderColor: roleTheme.border }}
                  >
                    {formatHour(hour)}
                  </td>

                  {/* Day cells */}
                  {weekDays.map((day) => {
                    const cellKey = `${format(day, "yyyy-MM-dd")}-${hour}`;
                    const appt = apptMap.get(cellKey);
                    return (
                      <td
                        key={cellKey}
                        className="h-12 border-b border-r px-1 py-1 last:border-r-0"
                        style={{ borderColor: roleTheme.border }}
                      >
                        {appt ? (
                          <button
                            className={cn(
                              "h-full w-full rounded-lg px-2 text-left text-white transition-opacity hover:opacity-80",
                              TYPE_CONFIG[appt.type].bgClass,
                              (appt.status === "CANCELLED" || appt.status === "NO_SHOW") &&
                                "opacity-50",
                            )}
                            title={`${appt.patientName} — ${TYPE_CONFIG[appt.type].label}`}
                            onClick={() => setSelected(appt)}
                          >
                            <p className="truncate text-[11px] font-semibold leading-tight">
                              {TYPE_CONFIG[appt.type].label}
                            </p>
                            <p className="truncate text-[10px] leading-tight opacity-90">
                              {appt.patientName.split(" ")[0]}
                            </p>
                          </button>
                        ) : (
                          <div className="h-full w-full rounded-lg transition-colors hover:bg-[#F8FCFB]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            {/* Capacity bars row */}
            <tfoot>
              <tr>
                <td
                  className="border-t px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#5B8784]"
                  style={{ borderColor: roleTheme.border }}
                >
                  Slots
                </td>
                {weekDays.map((day, i) => {
                  const { booked, total } = dayCapacity[i];
                  const pct = Math.round((booked / total) * 100);
                  const barColor =
                    pct >= 80
                      ? "bg-red-500"
                      : pct >= 50
                        ? "bg-amber-500"
                        : "bg-emerald-500";

                  return (
                    <td
                      key={day.toISOString()}
                      className="border-t px-2 py-3 last:border-r-0"
                      style={{ borderColor: roleTheme.border }}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-medium text-[#54797C]">
                          <span>{booked}/{total}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5F3F2]">
                          <div
                            className={cn("h-full rounded-full transition-all", barColor)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      </div>{/* end hidden sm:block */}

      {/* Appointment detail side panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <button
            aria-label="Close panel"
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <aside
            className="relative z-50 flex h-full w-full max-w-sm flex-col border-l bg-white shadow-2xl"
            style={{ borderColor: roleTheme.border }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between border-b px-5 py-4"
              style={{ borderColor: roleTheme.border }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                  Appointment Detail
                </p>
                <h2
                  className="mt-1 text-lg font-semibold"
                  style={{ color: roleTheme.text }}
                >
                  {selected.patientName}
                </h2>
              </div>
              <button
                className="rounded-xl p-2 text-[#5B8784] transition-colors hover:bg-[#F0FAF8]"
                onClick={() => setSelected(null)}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {/* Info rows */}
              <div
                className="divide-y rounded-2xl border"
                style={{ borderColor: roleTheme.border, borderTopColor: roleTheme.border }}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="shrink-0 rounded-xl p-2"
                    style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                  >
                    <User className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#5B8784]">Patient</p>
                    <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
                      {selected.patientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="shrink-0 rounded-xl p-2"
                    style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                  >
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#5B8784]">Date</p>
                    <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
                      {format(new Date(selected.date), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="shrink-0 rounded-xl p-2"
                    style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
                  >
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#5B8784]">Time</p>
                    <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
                      {formatHour(selected.hour)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Type + status badges */}
              <div
                className="rounded-2xl border px-4 py-4"
                style={{ borderColor: roleTheme.border }}
              >
                <div className="mb-3">
                  <p className="mb-1.5 text-xs text-[#5B8784]">Appointment type</p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
                      TYPE_CONFIG[selected.type].bgClass,
                    )}
                  >
                    {TYPE_CONFIG[selected.type].label}
                  </span>
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-[#5B8784]">Status</p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      STATUS_CONFIG[selected.status].style,
                    )}
                  >
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
