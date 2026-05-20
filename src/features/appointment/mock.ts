import type { Appointment } from "./types";

const DEMO_STORAGE_KEY = "motherhood:appointments-demo";

function addDays(base: Date, days: number, time: string) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toTime(date: Date) {
  return date.toTimeString().slice(0, 5);
}

export function createDemoAppointments(): Appointment[] {
  const now = new Date();
  const futureA = addDays(now, 3, "09:30");
  const futureB = addDays(now, 9, "11:00");
  const pastA = addDays(now, -2, "14:00");
  const pastB = addDays(now, -8, "08:30");
  const pastC = addDays(now, -14, "13:15");

  return [
    {
      id: "demo-appt-001",
      patientId: "patient-demo-001",
      facilityName: "Nyamata Health Center",
      appointmentType: "PRENATAL_CHECKUP",
      appointmentTypeLabel: "Prenatal Checkup",
      scheduledDate: toISODate(futureA),
      scheduledTime: toTime(futureA),
      status: "SCHEDULED",
      notes: "Bring maternal health card and any recent lab results.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "demo-appt-002",
      patientId: "patient-demo-001",
      facilityName: "Gahanga Health Post",
      appointmentType: "IMMUNIZATION",
      appointmentTypeLabel: "Immunization",
      scheduledDate: toISODate(futureB),
      scheduledTime: toTime(futureB),
      status: "SCHEDULED",
      notes: "Child immunization follow-up visit.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "demo-appt-003",
      patientId: "patient-demo-001",
      facilityName: "Nyamata Health Center",
      appointmentType: "POSTNATAL_CHECKUP",
      appointmentTypeLabel: "Postnatal Checkup",
      scheduledDate: toISODate(pastA),
      scheduledTime: toTime(pastA),
      status: "COMPLETED",
      notes: "Postnatal review completed successfully.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "demo-appt-004",
      patientId: "patient-demo-001",
      facilityName: "Rilima Health Center",
      appointmentType: "LABORATORY_TEST",
      appointmentTypeLabel: "Laboratory Test",
      scheduledDate: toISODate(pastB),
      scheduledTime: toTime(pastB),
      status: "NO_SHOW",
      notes: "Patient did not arrive for the scheduled appointment.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "demo-appt-005",
      patientId: "patient-demo-001",
      facilityName: "Kabuga Health Center",
      appointmentType: "ULTRASOUND",
      appointmentTypeLabel: "Ultrasound",
      scheduledDate: toISODate(pastC),
      scheduledTime: toTime(pastC),
      status: "CANCELLED",
      notes: "Cancelled due to caregiver request.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
}

export function getStoredDemoAppointments(): Appointment[] {
  if (typeof window === "undefined") {
    return createDemoAppointments();
  }

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      const seeded = createDemoAppointments();
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(raw) as Appointment[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : createDemoAppointments();
  } catch {
    return createDemoAppointments();
  }
}

export function setStoredDemoAppointments(appointments: Appointment[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // ignore storage failures
  }
}

export function cancelStoredDemoAppointment(appointmentId: string) {
  const appointments = getStoredDemoAppointments();
  const updated = appointments.map((appointment) =>
    appointment.id === appointmentId
      ? {
          ...appointment,
          status: "CANCELLED" as const,
          notes: appointment.notes
            ? `${appointment.notes} Cancelled by patient.`
            : "Cancelled by patient.",
          updatedAt: new Date().toISOString(),
        }
      : appointment
  );

  setStoredDemoAppointments(updated);
  return updated;
}
