import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PregnancyStatus = "ACTIVE" | "COMPLETED" | "LOST";
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "MISSED";
export type AppointmentType = "ANC" | "PNC" | "IMMUNIZATION" | "SICK_CHILD" | "GROWTH_MONITORING" | "GENERAL";

export interface ChwContact {
  name: string;
  phone: string;
  sector: string;
}

export interface PatientPregnancy {
  id: string;
  gestational_age_weeks: number;
  estimated_due_date: string;
  status: PregnancyStatus;
  anc_visits_completed: number;
  anc_visits_total: number;
  last_visit_date: string | null;
  next_visit_date: string | null;
  next_visit_provider: string | null;
  facility_name: string;
  chw: ChwContact | null;
}

export interface PatientAppointment {
  id: string;
  appointment_type: AppointmentType;
  scheduled_date: string;
  scheduled_time: string;
  facility_name: string;
  provider_name: string;
  status: AppointmentStatus;
  notes: string | null;
}

export type VaccinationSummaryStatus = "UP_TO_DATE" | "DUE_SOON" | "OVERDUE";

export interface PatientChild {
  id: string;
  health_id: string;
  first_name: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
  health_status: "HEALTHY" | "AT_RISK" | "CRITICAL";
  vaccinations_completed: number;
  vaccinations_total: number;
  vaccination_status: VaccinationSummaryStatus;
  next_vaccination_name: string | null;
  next_vaccination_date: string | null;
}

export interface PatientProfile {
  health_id: string;
  full_name: string;
  facility_name: string;
  pregnancy: PatientPregnancy | null;
  upcoming_appointment: PatientAppointment | null;
  children: PatientChild[];
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const today = new Date();
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const fmt = (d: Date) => d.toISOString().split("T")[0];

const MOCK_PREGNANCY: PatientPregnancy = {
  id: "preg-001",
  gestational_age_weeks: 28,
  estimated_due_date: fmt(addDays(today, 84)),
  status: "ACTIVE",
  anc_visits_completed: 4,
  anc_visits_total: 8,
  last_visit_date: fmt(addDays(today, -14)),
  next_visit_date: fmt(addDays(today, 14)),
  next_visit_provider: "Dr. Murenzi Jean",
  facility_name: "Nyamata Health Center",
  chw: {
    name: "Uwase Claudine",
    phone: "+250 788 123 456",
    sector: "Nyamata Sector",
  },
};

const MOCK_APPOINTMENTS: PatientAppointment[] = [
  // ── Upcoming ──────────────────────────────────────────────────────────────
  {
    id: "apt-001",
    appointment_type: "ANC",
    scheduled_date: fmt(addDays(today, 7)),
    scheduled_time: "09:00",
    facility_name: "Nyamata Health Center",
    provider_name: "Dr. Murenzi Jean",
    status: "SCHEDULED",
    notes: "Bring your ANC card and maternity booklet.",
  },
  {
    id: "apt-002",
    appointment_type: "IMMUNIZATION",
    scheduled_date: fmt(addDays(today, 14)),
    scheduled_time: "10:30",
    facility_name: "Nyamata Health Center",
    provider_name: "Nurse Uwase Claudine",
    status: "SCHEDULED",
    notes: null,
  },
  {
    id: "apt-003",
    appointment_type: "GROWTH_MONITORING",
    scheduled_date: fmt(addDays(today, 28)),
    scheduled_time: "08:00",
    facility_name: "Bugesera District Hospital",
    provider_name: "Nurse Kagabo Eric",
    status: "SCHEDULED",
    notes: null,
  },
  // ── Past — all statuses ───────────────────────────────────────────────────
  {
    id: "apt-004",
    appointment_type: "ANC",
    scheduled_date: fmt(addDays(today, -14)),
    scheduled_time: "09:00",
    facility_name: "Nyamata Health Center",
    provider_name: "Dr. Murenzi Jean",
    status: "COMPLETED",
    notes: null,
  },
  {
    id: "apt-005",
    appointment_type: "PNC",
    scheduled_date: fmt(addDays(today, -30)),
    scheduled_time: "11:00",
    facility_name: "Nyamata Health Center",
    provider_name: "Dr. Murenzi Jean",
    status: "COMPLETED",
    notes: null,
  },
  {
    id: "apt-006",
    appointment_type: "SICK_CHILD",
    scheduled_date: fmt(addDays(today, -45)),
    scheduled_time: "14:00",
    facility_name: "Bugesera District Hospital",
    provider_name: "Dr. Habimana Alice",
    status: "CANCELLED",
    notes: null,
  },
  {
    id: "apt-007",
    appointment_type: "GENERAL",
    scheduled_date: fmt(addDays(today, -60)),
    scheduled_time: "08:30",
    facility_name: "Nyamata Health Center",
    provider_name: "Nurse Uwase Claudine",
    status: "MISSED",
    notes: null,
  },
  {
    id: "apt-008",
    appointment_type: "GROWTH_MONITORING",
    scheduled_date: fmt(addDays(today, -90)),
    scheduled_time: "10:00",
    facility_name: "Nyamata Health Center",
    provider_name: "Nurse Kagabo Eric",
    status: "COMPLETED",
    notes: null,
  },
];

const MOCK_CHILDREN: PatientChild[] = [
  {
    id: "child-001",
    health_id: "CHD-001",
    first_name: "Amara",
    gender: "FEMALE",
    date_of_birth: "2024-11-20",   // ~18 months — first child, mother now pregnant again
    health_status: "HEALTHY",
    vaccinations_completed: 9,
    vaccinations_total: 13,
    vaccination_status: "DUE_SOON",
    next_vaccination_name: "Measles-Rubella 2",
    next_vaccination_date: fmt(addDays(today, 7)),
  },
];

const MOCK_PROFILE: PatientProfile = {
  health_id: "MTH-001",
  full_name: "Uwimana Marie",
  facility_name: "Nyamata Health Center",
  pregnancy: MOCK_PREGNANCY,
  upcoming_appointment: MOCK_APPOINTMENTS[0],
  children: MOCK_CHILDREN,
};

// ─── API functions ─────────────────────────────────────────────────────────────

export async function getPatientProfile(): Promise<PatientProfile> {
  try {
    const res = await apiClient.get<unknown>("/api/v1/patient/profile");
    return res as PatientProfile;
  } catch {
    return MOCK_PROFILE;
  }
}

export async function getPatientPregnancy(): Promise<PatientPregnancy | null> {
  try {
    const res = await apiClient.get<unknown>("/api/v1/patient/pregnancy");
    return res as PatientPregnancy;
  } catch {
    return MOCK_PREGNANCY;
  }
}

export async function getPatientAppointments(): Promise<PatientAppointment[]> {
  try {
    const res = await apiClient.get<unknown>("/api/v1/patient/appointments");
    if (Array.isArray(res)) return res as PatientAppointment[];
  } catch {
    // fall through
  }
  return [...MOCK_APPOINTMENTS];
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/v1/appointments/${encodeURIComponent(appointmentId)}`);
  } catch {
    // mock: just resolve
  }
}

export async function getPatientChildren(): Promise<PatientChild[]> {
  try {
    const res = await apiClient.get<unknown>("/api/v1/patient/children");
    if (Array.isArray(res)) return res as PatientChild[];
  } catch {
    // fall through
  }
  return [...MOCK_CHILDREN];
}
