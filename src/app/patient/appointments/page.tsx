"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import {
  getPatientAppointments,
  cancelAppointment,
  type PatientAppointment,
  type AppointmentStatus,
} from "@/lib/api/patient";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  ANC: "Antenatal Care",
  PNC: "Postnatal Care",
  IMMUNIZATION: "Immunization",
  SICK_CHILD: "Sick Child",
  GROWTH_MONITORING: "Growth Monitoring",
  GENERAL: "General Checkup",
};

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string }
> = {
  SCHEDULED: { label: "Scheduled", bg: "#DBEAFE", text: "#1E40AF" },
  COMPLETED: { label: "Completed", bg: "#D1FAE5", text: "#065F46" },
  CANCELLED: { label: "Cancelled", bg: "#F3F4F6", text: "#6B7280" },
  MISSED:    { label: "Missed",    bg: "#FEF3C7", text: "#92400E" },
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAY_ABBR = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const ALL_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00",
  "14:00","14:30","15:00","15:30","16:00",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short",
  });
}

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isCalToday(year: number, month: number, day: number) {
  const t = new Date();
  return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
}

function getAvailableSlots(date: string, appointments: PatientAppointment[]) {
  const booked = appointments
    .filter((a) => a.scheduled_date === date && a.status === "SCHEDULED")
    .map((a) => a.scheduled_time);
  return ALL_SLOTS.filter((s) => !booked.includes(s));
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Cancel dialog ────────────────────────────────────────────────────────────

function CancelDialog({
  appointment,
  onClose,
  onConfirm,
  isPending,
}: {
  appointment: PatientAppointment;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-red-50">
            <Trash2 className="size-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Cancel Appointment</h3>
            <p className="text-xs text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="mb-5 text-sm text-gray-600">
          Cancel your{" "}
          <span className="font-semibold">
            {TYPE_LABELS[appointment.appointment_type] ?? appointment.appointment_type}
          </span>{" "}
          on{" "}
          <span className="font-semibold">{fmtDate(appointment.scheduled_date)}</span>?
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-sm"
            onClick={onClose}
            disabled={isPending}
          >
            Keep it
          </Button>
          <Button
            className="flex-1 rounded-xl bg-red-600 text-sm text-white hover:bg-red-700"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending
              ? <Loader2 className="size-3.5 animate-spin" />
              : <Trash2 className="size-3.5" />}
            {isPending ? "Cancelling…" : "Yes, cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function DetailModal({
  appointment,
  onClose,
  onCancel,
  theme,
}: {
  appointment: PatientAppointment;
  onClose: () => void;
  onCancel: () => void;
  theme: { accent: string; accentSoft: string; border: string };
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl"
        style={{ borderColor: theme.border }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: theme.border }}
        >
          <h2 className="text-sm font-semibold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Appointment Type
              </p>
              <p className="mt-0.5 text-base font-bold text-gray-900">
                {TYPE_LABELS[appointment.appointment_type] ?? appointment.appointment_type}
              </p>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3" style={{ backgroundColor: theme.accentSoft }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Date
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {fmtDate(appointment.scheduled_date)}
              </p>
            </div>
            <div className="rounded-2xl p-3" style={{ backgroundColor: theme.accentSoft }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Time
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {fmtTime(appointment.scheduled_time)}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <MapPin className="size-4 shrink-0 text-gray-400" />
              {appointment.facility_name}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <User className="size-4 shrink-0 text-gray-400" />
              {appointment.provider_name}
            </div>
            {appointment.notes && (
              <p
                className="rounded-xl px-3 py-2 text-xs text-gray-600"
                style={{ backgroundColor: theme.accentSoft }}
              >
                {appointment.notes}
              </p>
            )}
          </div>
        </div>

        {/* Footer — cancel only for scheduled */}
        {appointment.status === "SCHEDULED" && (
          <div className="border-t px-5 py-4" style={{ borderColor: theme.border }}>
            <Button
              variant="outline"
              className="w-full rounded-xl border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
              onClick={onCancel}
            >
              <Trash2 className="size-4" />
              Cancel this appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AppointmentsPage() {
  const { roleTheme } = useRole({ fallbackRole: "patient" });
  const router = useRouter();
  const queryClient = useQueryClient();

  const today = new Date();
  const [calYear, setCalYear]       = useState(today.getFullYear());
  const [calMonth, setCalMonth]     = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailTarget, setDetailTarget] = useState<PatientAppointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<PatientAppointment | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: getPatientAppointments,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      setCancelTarget(null);
      setDetailTarget(null);
      void queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    },
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  const allAppts = appointments ?? [];

  const sorted = useMemo(() => {
    const upcoming = allAppts
      .filter((a) => a.status === "SCHEDULED")
      .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
    const past = allAppts
      .filter((a) => a.status !== "SCHEDULED")
      .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
    return [...upcoming, ...past];
  }, [allAppts]);

  const weekCount = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 7);
    return allAppts.filter(
      (a) => a.status === "SCHEDULED" && new Date(a.scheduled_date) <= cutoff,
    ).length;
  }, [allAppts]);

  const apptsByDate = useMemo(() => {
    const map: Record<string, PatientAppointment[]> = {};
    allAppts.forEach((a) => {
      if (!map[a.scheduled_date]) map[a.scheduled_date] = [];
      map[a.scheduled_date].push(a);
    });
    return map;
  }, [allAppts]);

  const availableSlots = useMemo(
    () => (selectedDate ? getAvailableSlots(selectedDate, allAppts) : []),
    [selectedDate, allAppts],
  );

  const morningSlots   = availableSlots.filter((s) => parseInt(s) < 12);
  const afternoonSlots = availableSlots.filter((s) => parseInt(s) >= 12);

  // ── Calendar ──────────────────────────────────────────────────────────────
  const daysInMonth    = new Date(calYear, calMonth + 1, 0).getDate();
  const firstWeekday   = new Date(calYear, calMonth, 1).getDay();

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  return (
    <div className="relative min-h-screen p-4 pb-24 sm:p-6">

      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Your schedule and available time slots.
          </p>
        </div>
        {!isLoading && weekCount > 0 && (
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            {weekCount} this week
          </span>
        )}
      </div>

      {/* Two-panel grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_288px]">

        {/* ── Left: appointment table ── */}
        <div
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray-400">
              <Loader2 className="size-4 animate-spin" /> Loading appointments…
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
              <XCircle className="size-6 text-red-400" />
              <p>Failed to load appointments.</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No appointments yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                  style={{ borderColor: roleTheme.border }}
                >
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Facility</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((apt, idx) => {
                  const isPast      = apt.status !== "SCHEDULED";
                  const isClickable = apt.status === "SCHEDULED";
                  const isLast      = idx === sorted.length - 1;
                  return (
                    <tr
                      key={apt.id}
                      onClick={() => isClickable && setDetailTarget(apt)}
                      className={cn(
                        "transition-colors",
                        !isLast && "border-b border-gray-50",
                        isClickable && "cursor-pointer hover:bg-gray-50/80",
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className={cn("font-semibold", isPast ? "text-gray-400" : "text-gray-900")}>
                          {fmtDateShort(apt.scheduled_date)}
                        </p>
                        <p className={cn("text-xs", isPast ? "text-gray-300" : "text-gray-400")}>
                          {fmtTime(apt.scheduled_time)}
                        </p>
                      </td>
                      <td className={cn("hidden px-4 py-3 text-xs sm:table-cell", isPast ? "text-gray-300" : "text-gray-500")}>
                        <p className="max-w-40 truncate">{apt.facility_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className={cn("max-w-32 truncate text-xs", isPast ? "text-gray-300" : "text-gray-700")}>
                          {TYPE_LABELS[apt.appointment_type] ?? apt.appointment_type}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Right: calendar + time slots ── */}
        <div className="space-y-3">

          {/* Calendar */}
          <div
            className="rounded-2xl border bg-white p-4 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            {/* Month nav */}
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="grid size-7 place-items-center rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="text-xs font-semibold text-gray-800">
                {MONTH_NAMES[calMonth]} {calYear}
              </p>
              <button
                onClick={nextMonth}
                className="grid size-7 place-items-center rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="mb-1 grid grid-cols-7 text-center">
              {DAY_ABBR.map((d) => (
                <div key={d} className="py-1 text-[9px] font-semibold text-gray-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day      = i + 1;
                const iso      = toIso(calYear, calMonth, day);
                const hasAppt  = !!apptsByDate[iso]?.length;
                const isSel    = selectedDate === iso;
                const isTdy    = isCalToday(calYear, calMonth, day);
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSel ? null : iso)}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-xl py-1.5 text-xs font-medium transition-colors",
                      isSel
                        ? "text-white"
                        : isTdy
                        ? "font-bold text-gray-900 ring-1 ring-inset ring-gray-300"
                        : "text-gray-600 hover:bg-gray-50",
                    )}
                    style={isSel ? { backgroundColor: roleTheme.accent } : undefined}
                  >
                    <span>{day}</span>
                    {hasAppt && !isSel && (
                      <span
                        className="mt-px size-1 rounded-full"
                        style={{ backgroundColor: roleTheme.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots — shown when a date is selected */}
          {selectedDate && (
            <div
              className="rounded-2xl border bg-white p-4 shadow-sm"
              style={{ borderColor: roleTheme.border }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-800">
                  {fmtDate(selectedDate)}
                </p>
                <span className="text-[11px] text-gray-400">
                  {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""} available
                </span>
              </div>

              {availableSlots.length === 0 ? (
                <p className="py-3 text-center text-xs text-gray-400">
                  No slots available this day.
                </p>
              ) : (
                <div className="space-y-3">
                  {morningSlots.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Morning
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {morningSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() =>
                              router.push(
                                `/appointments/request?date=${selectedDate}&time=${slot}`,
                              )
                            }
                            className="rounded-xl py-1.5 text-[11px] font-medium text-gray-700 transition-opacity hover:opacity-70"
                            style={{ backgroundColor: roleTheme.accentSoft }}
                          >
                            {fmtTime(slot)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {afternoonSlots.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Afternoon
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {afternoonSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() =>
                              router.push(
                                `/appointments/request?date=${selectedDate}&time=${slot}`,
                              )
                            }
                            className="rounded-xl py-1.5 text-[11px] font-medium text-gray-700 transition-opacity hover:opacity-70"
                            style={{ backgroundColor: roleTheme.accentSoft }}
                          >
                            {fmtTime(slot)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/appointments/request"
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:bottom-8 lg:right-8"
        style={{ backgroundColor: roleTheme.accent }}
      >
        <Plus className="size-4 shrink-0" />
        <span className="hidden sm:inline">Request new appointment</span>
      </Link>

      {/* Detail modal */}
      {detailTarget && (
        <DetailModal
          appointment={detailTarget}
          onClose={() => setDetailTarget(null)}
          onCancel={() => {
            setCancelTarget(detailTarget);
            setDetailTarget(null);
          }}
          theme={roleTheme}
        />
      )}

      {/* Cancel dialog */}
      {cancelTarget && (
        <CancelDialog
          appointment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => cancelMutation.mutate(cancelTarget.id)}
          isPending={cancelMutation.isPending}
        />
      )}
    </div>
  );
}
