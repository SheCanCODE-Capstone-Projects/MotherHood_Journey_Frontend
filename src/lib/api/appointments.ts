/**
 * Appointments API endpoints
 * Handles all appointment operations for patients
 * Based on backend: com.motherhood.journey.appointment.controller.AppointmentController
 */

import { apiClient } from "@/lib/api/client";
import type {
  Appointment,
  AppointmentListResponse,
  CancelAppointmentRequest,
  CancelAppointmentResponse,
} from "@/features/appointment/types";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointment/constants";

/**
 * Get all appointments for the current patient
 * Endpoint: GET /api/v1/appointments
 */
export async function getAppointments(
  page: number = 1,
  pageSize: number = 10
): Promise<AppointmentListResponse> {
  const params = new URLSearchParams();
  params.append("page", (page - 1).toString());
  params.append("page_size", pageSize.toString());

  return apiClient.get<AppointmentListResponse>(
    `${APPOINTMENT_ENDPOINTS.LIST}?${params.toString()}`
  );
}

/**
 * Get a specific appointment by ID
 * Endpoint: GET /api/v1/appointments/{id}
 */
export async function getAppointmentDetail(id: string): Promise<Appointment> {
  return apiClient.get<Appointment>(APPOINTMENT_ENDPOINTS.DETAIL(id));
}

/**
 * Cancel an appointment
 * Endpoint: DELETE /api/v1/appointments/{id}
 *
 * Note: The task specifies DELETE /api/v1/appointments/{id}
 * If the backend requires a PATCH request instead, update this method
 */
export async function cancelAppointment(
  id: string,
  request?: CancelAppointmentRequest
): Promise<CancelAppointmentResponse> {
  // Using DELETE as per task specification
  // If backend uses different verb, modify the method accordingly
  const response = await apiClient.delete<CancelAppointmentResponse>(
    APPOINTMENT_ENDPOINTS.DELETE(id),
    {
      body: request,
    }
  );
  return response;
}

/**
 * Get upcoming appointments (future scheduled appointments)
 * Filters client-side from all appointments
 */
export async function getUpcomingAppointments(
  pageSize: number = 10
): Promise<Appointment[]> {
  const allAppointments = await getAppointments(1, 100);
  const now = new Date();

  return allAppointments.content.filter((appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.scheduledDate}T${appointment.scheduledTime}`
    );
    return appointmentDateTime > now && appointment.status === "SCHEDULED";
  });
}

/**
 * Get past appointments
 * Filters client-side from all appointments
 */
export async function getPastAppointments(
  pageSize: number = 10
): Promise<Appointment[]> {
  const allAppointments = await getAppointments(1, 100);
  const now = new Date();

  return allAppointments.content.filter((appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.scheduledDate}T${appointment.scheduledTime}`
    );
    return appointmentDateTime <= now || appointment.status !== "SCHEDULED";
  });
}
