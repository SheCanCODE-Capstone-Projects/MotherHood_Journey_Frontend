import { apiClient } from "./client";
import type {
  CreateAppointmentRequest,
  AppointmentResponse,
  PatientInfo,
  AvailableSlotsResponse,
} from "@/lib/schemas/appointmentSchema";
import type {
  Appointment,
} from "@/features/appointment/types";

const APPOINTMENTS_BASE_PATH = "/api/v1/appointments";

/**
 * Search for a patient by health ID
 * Returns patient information including name, date of birth, and facility
 */
export async function searchPatient(healthId: string): Promise<PatientInfo> {
  const response = await apiClient.get<PatientInfo>(
    `${APPOINTMENTS_BASE_PATH}/patients/search?healthId=${encodeURIComponent(healthId)}`
  );
  return response;
}

/**
 * Get available time slots for a specific date and facility
 * Returns capacity-checked slots with availability status
 */
export async function getAvailableSlots(
  date: string,
  facilityId: string
): Promise<AvailableSlotsResponse> {
  const response = await apiClient.get<AvailableSlotsResponse>(
    `${APPOINTMENTS_BASE_PATH}/slots?date=${date}&facilityId=${facilityId}`
  );
  return response;
}

/**
 * Create a new appointment
 * Handles scheduling with SMS reminder option
 */
export async function createAppointment(
  request: CreateAppointmentRequest
): Promise<AppointmentResponse> {
  const response = await apiClient.post<AppointmentResponse>(
    APPOINTMENTS_BASE_PATH,
    request
  );
  return response;
}

/**
 * Get appointment by reference number
 * Useful for retrieving appointment details after creation
 */
export async function getAppointmentByReference(
  referenceNumber: string
): Promise<AppointmentResponse> {
  const response = await apiClient.get<AppointmentResponse>(
    `${APPOINTMENTS_BASE_PATH}/reference/${encodeURIComponent(referenceNumber)}`
  );
  return response;
}

/**
 * Get appointments list with pagination
 * Supports filtering by status and date range
 */
export async function getAppointments(
  page = 1,
  pageSize = 10,
  status?: string
): Promise<{ content: Appointment[]; totalPages: number; totalElements: number; pageNumber: number; pageSize: number; }> {
  const params = new URLSearchParams();
  params.set("page", String(page - 1)); // Backend uses 0-based page numbering
  params.set("size", String(pageSize));
  if (status) {
    params.set("status", status);
  }

  const response = await apiClient.get<{
    content: Appointment[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
  }>(`${APPOINTMENTS_BASE_PATH}?${params.toString()}`);

  return {
    content: response.content,
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    pageNumber: response.number + 1, // Convert to 1-based for frontend
    pageSize: response.size,
  };
}

/**
 * Get upcoming appointments (status = SCHEDULED)
 */
export async function getUpcomingAppointments(pageSize = 10) {
  const result = await getAppointments(1, pageSize, "SCHEDULED");
  return {
    content: result.content,
    totalPages: result.totalPages,
    totalElements: result.totalElements,
  };
}

/**
 * Get past appointments (status = COMPLETED or CANCELLED or NO_SHOW)
 */
export async function getPastAppointments(pageSize = 10) {
  const result = await getAppointments(1, pageSize);
  // Filter to only completed/cancelled/no-show appointments
  const pastAppointments = result.content.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED" || a.status === "NO_SHOW"
  );
  return {
    content: pastAppointments,
    totalPages: 1,
    totalElements: pastAppointments.length,
  };
}

/**
 * Get detailed information for a specific appointment
 */
export async function getAppointmentDetail(appointmentId: string): Promise<Appointment> {
  const response = await apiClient.get<Appointment>(
    `${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(appointmentId)}`
  );
  return response;
}

/**
 * Cancel an appointment
 * Updates appointment status to CANCELLED
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string
): Promise<{ ok: boolean; id: string; message?: string }> {
  const response = await apiClient.patch<{
    success: boolean;
    message?: string;
  }>(`${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(appointmentId)}/cancel`, {
    reason,
  });

  return {
    ok: response.success,
    id: appointmentId,
    message: response.message,
  };
}

/**
 * Update appointment status
 * Supports status lifecycle: SCHEDULED -> CONFIRMED -> COMPLETED or CANCELLED
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "MISSED",
  notes?: string
): Promise<AppointmentResponse> {
  const response = await apiClient.patch<AppointmentResponse>(
    `${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(appointmentId)}/status`,
    {
      status,
      notes,
    }
  );
  return response;
}
