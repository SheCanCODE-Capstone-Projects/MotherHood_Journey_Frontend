import { apiClient } from "./client";
import type { PregnancyResponse, ChildResponse, AppointmentResponse, MeResponse } from "@/shared/types/backend";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PregnancyStatus = "ACTIVE" | "COMPLETED" | "LOST";
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "MISSED";
export type AppointmentType =
  | "ANC"
  | "PNC"
  | "IMMUNIZATION"
  | "SICK_CHILD"
  | "GROWTH_MONITORING"
  | "GENERAL";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcGestationalWeeks(lmpDate: string): number {
  const lmp = new Date(lmpDate);
  return Math.max(0, Math.floor((Date.now() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000)));
}

function normalizePregnancyStatus(raw: string): PregnancyStatus {
  const s = raw.toUpperCase();
  if (s === "ACTIVE") return "ACTIVE";
  if (s === "LOST") return "LOST";
  return "COMPLETED";
}

function mapToPatientPregnancy(raw: PregnancyResponse): PatientPregnancy {
  return {
    id: raw.id,
    gestational_age_weeks: calcGestationalWeeks(raw.lmpDate),
    estimated_due_date: raw.edd,
    status: normalizePregnancyStatus(raw.status),
    anc_visits_completed: 0,
    anc_visits_total: 8,
    last_visit_date: null,
    next_visit_date: null,
    next_visit_provider: null,
    facility_name: "",
    chw: null,
  };
}

function normalizeAppointmentStatus(raw: string): AppointmentStatus {
  const s = raw.toUpperCase();
  if (s === "CONFIRMED") return "SCHEDULED";
  if (s === "NO_SHOW") return "MISSED";
  if (s === "SCHEDULED" || s === "COMPLETED" || s === "CANCELLED" || s === "MISSED") {
    return s as AppointmentStatus;
  }
  return "SCHEDULED";
}

function mapToPatientAppointment(raw: AppointmentResponse): PatientAppointment {
  const dt = new Date(raw.scheduledAt);
  const date = dt.toISOString().split("T")[0];
  const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
  return {
    id: raw.id,
    appointment_type: raw.appointmentType as AppointmentType,
    scheduled_date: date,
    scheduled_time: time,
    facility_name: "",
    provider_name: "",
    status: normalizeAppointmentStatus(raw.status),
    notes: raw.notes ?? null,
  };
}

function mapToPatientChild(raw: ChildResponse): PatientChild {
  const hs = raw.healthStatus as string | undefined;
  return {
    id: raw.id,
    health_id: raw.id,
    first_name: raw.firstName,
    gender: raw.gender,
    date_of_birth: raw.dateOfBirth,
    health_status:
      hs === "MALNOURISHED" || hs === "SICK" ? "AT_RISK" : (hs as "HEALTHY" | "AT_RISK" | "CRITICAL") ?? "HEALTHY",
    vaccinations_completed: 0,
    vaccinations_total: 13,
    vaccination_status: "UP_TO_DATE",
    next_vaccination_name: null,
    next_vaccination_date: null,
  };
}

function extractList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (response && typeof response === "object") {
    const r = response as Record<string, unknown>;
    if (Array.isArray(r.content)) return r.content as T[];
    if (Array.isArray(r.data)) return r.data as T[];
  }
  return [];
}

// ─── Internal: resolve current patient's motherId + facilityId ────────────────

interface MotherInfo {
  motherId: string;
  facilityId: string;
}

// Cached per page load to avoid triple-calling /me and /mothers/search
let _cachedMotherInfo: MotherInfo | null | undefined = undefined;

async function getCurrentMotherInfo(): Promise<MotherInfo | null> {
  if (_cachedMotherInfo !== undefined) return _cachedMotherInfo;

  try {
    const me = await apiClient.get<MeResponse & { healthId?: string; motherId?: string }>(
      "/api/v1/me",
    );
    if (!me) { _cachedMotherInfo = null; return null; }

    const facilityId = me.facilityId ?? "";

    // Some backends return motherId directly on the /me response
    if (me.motherId) {
      _cachedMotherInfo = { motherId: me.motherId, facilityId };
      return _cachedMotherInfo;
    }

    // Fall back: search by phone number to find the mother record
    if (me.phoneNumber) {
      const searchRes = await apiClient.get<unknown>(
        `/api/v1/mothers/search?search_term=${encodeURIComponent(me.phoneNumber)}`,
      );
      const items = extractList<Record<string, unknown>>(searchRes);
      if (items.length > 0) {
        const motherId = String(items[0].id ?? "");
        if (motherId) {
          _cachedMotherInfo = { motherId, facilityId };
          return _cachedMotherInfo;
        }
      }
    }

    _cachedMotherInfo = null;
    return null;
  } catch {
    _cachedMotherInfo = null;
    return null;
  }
}

// ─── API functions ─────────────────────────────────────────────────────────────

export async function getPatientProfile(): Promise<PatientProfile | null> {
  try {
    const me = await apiClient.get<Record<string, unknown>>("/api/v1/me");
    return {
      health_id: String(me.id ?? ""),
      full_name: `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim(),
      facility_name: String(me.facilityName ?? ""),
      pregnancy: null,
      upcoming_appointment: null,
      children: [],
    };
  } catch {
    return null;
  }
}

export async function getPatientPregnancy(): Promise<PatientPregnancy | null> {
  // Reset cache on each fresh query so stale data doesn't persist across logins
  _cachedMotherInfo = undefined;
  try {
    const info = await getCurrentMotherInfo();
    if (!info) return null;
    const { motherId, facilityId } = info;

    const qs = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : "";
    const res = await apiClient.get<unknown>(
      `/api/v1/pregnancies/by-mother/${encodeURIComponent(motherId)}${qs}`,
    );
    const items = extractList<PregnancyResponse>(res);
    const active = items.find((p) => p.status === "ACTIVE");
    return active ? mapToPatientPregnancy(active) : items[0] ? mapToPatientPregnancy(items[0]) : null;
  } catch {
    return null;
  }
}

export async function getPatientAppointments(): Promise<PatientAppointment[]> {
  try {
    const info = await getCurrentMotherInfo();
    if (!info) {
      // Fallback: try the generic appointments list
      const res = await apiClient.get<unknown>("/api/v1/appointments?page=0&size=20");
      return extractList<AppointmentResponse>(res).map(mapToPatientAppointment);
    }
    const { motherId, facilityId } = info;

    const params = new URLSearchParams({ patientType: "MOTHER" });
    if (facilityId) params.append("facilityId", facilityId);

    const res = await apiClient.get<unknown>(
      `/api/v1/appointments/patient/${encodeURIComponent(motherId)}?${params}`,
    );
    return extractList<AppointmentResponse>(res).map(mapToPatientAppointment);
  } catch {
    return [];
  }
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  await apiClient.delete(`/api/v1/appointments/${encodeURIComponent(appointmentId)}`);
}

export async function getPatientChildren(): Promise<PatientChild[]> {
  try {
    const info = await getCurrentMotherInfo();
    if (!info) return [];
    const { motherId, facilityId } = info;

    const qs = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : "";
    const res = await apiClient.get<unknown>(
      `/api/v1/children/by-mother/${encodeURIComponent(motherId)}${qs}`,
    );
    return extractList<ChildResponse>(res).map(mapToPatientChild);
  } catch {
    return [];
  }
}
