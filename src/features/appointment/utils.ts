import type { Appointment, AppointmentStatus } from "./types";

/**
 * Validate appointment data
 */
export function validateAppointment(data: unknown): data is Appointment {
  if (typeof data !== "object" || data === null) return false;

  const appointment = data as Record<string, unknown>;

  return (
    typeof appointment.id === "string" &&
    typeof appointment.patientId === "string" &&
    typeof appointment.facilityName === "string" &&
    typeof appointment.appointmentType === "string" &&
    typeof appointment.appointmentTypeLabel === "string" &&
    typeof appointment.scheduledDate === "string" &&
    typeof appointment.scheduledTime === "string" &&
    typeof appointment.status === "string" &&
    typeof appointment.createdAt === "string" &&
    typeof appointment.updatedAt === "string"
  );
}

/**
 * Check if appointment is in the future
 */
export function isFutureAppointment(appointment: Appointment): boolean {
  const appointmentDateTime = new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`);
  return appointmentDateTime > new Date();
}

/**
 * Check if appointment is in the past
 */
export function isPastAppointment(appointment: Appointment): boolean {
  return !isFutureAppointment(appointment);
}

/**
 * Check if appointment can be cancelled
 */
export function canCancelAppointment(appointment: Appointment): boolean {
  return appointment.status === "SCHEDULED" && isFutureAppointment(appointment);
}

/**
 * Format appointment datetime to readable string
 */
export function formatAppointmentDateTime(date: string, time: string): string {
  try {
    const appointmentDate = new Date(`${date}T${time}`);
    return appointmentDate.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
}

/**
 * Format appointment date only
 */
export function formatAppointmentDate(date: string): string {
  try {
    const appointmentDate = new Date(`${date}T00:00`);
    return appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

/**
 * Format appointment time
 */
export function formatAppointmentTime(time: string): string {
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return time;
  }
}

/**
 * Get relative time string (e.g., "in 3 days", "2 hours ago")
 */
export function getRelativeTime(dateString: string, timeString: string): string {
  try {
    const appointmentDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffMs < 0) {
      const absDiffDays = Math.abs(diffDays);
      const absDiffHours = Math.abs(diffHours);
      if (absDiffDays > 0) return `${absDiffDays} day${absDiffDays > 1 ? "s" : ""} ago`;
      if (absDiffHours > 0) return `${absDiffHours} hour${absDiffHours > 1 ? "s" : ""} ago`;
      return "just now";
    }

    if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    return "soon";
  } catch {
    return "upcoming";
  }
}

/**
 * Categorize appointments into future and past
 */
export function categorizeAppointments(
  appointments: Appointment[]
): { future: Appointment[]; past: Appointment[] } {
  const future: Appointment[] = [];
  const past: Appointment[] = [];

  for (const appointment of appointments) {
    if (isFutureAppointment(appointment)) {
      future.push(appointment);
    } else {
      past.push(appointment);
    }
  }

  // Sort future appointments chronologically (earliest first)
  future.sort(
    (a, b) =>
      new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime() -
      new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime()
  );

  // Sort past appointments reverse chronologically (latest first)
  past.sort(
    (a, b) =>
      new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime() -
      new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime()
  );

  return { future, past };
}
