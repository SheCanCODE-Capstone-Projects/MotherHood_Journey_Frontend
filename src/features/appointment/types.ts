/**
 * Appointment Status Types
 */
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

/**
 * Appointment Type/Service
 */
export type AppointmentType =
  | "PRENATAL_CHECKUP"
  | "POSTNATAL_CHECKUP"
  | "IMMUNIZATION"
  | "NUTRITIONAL_COUNSELING"
  | "MENTAL_HEALTH"
  | "LABORATORY_TEST"
  | "ULTRASOUND"
  | "OTHER";

/**
 * Appointment Record - Main data structure
 */
export interface Appointment {
  id: string;
  patientId: string;
  facilitySesameId?: string;
  facilityName: string;
  appointmentType: AppointmentType;
  appointmentTypeLabel: string;
  scheduledDate: string; // ISO date format
  scheduledTime: string; // HH:mm format
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Appointment List Response from API
 */
export interface AppointmentListResponse {
  content: Appointment[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

/**
 * Cancel Appointment Request
 */
export interface CancelAppointmentRequest {
  reason?: string;
  notes?: string;
}

/**
 * Cancel Appointment Response
 */
export interface CancelAppointmentResponse {
  success: boolean;
  message: string;
  appointment?: Appointment;
}

/**
 * Appointment Detail with extended info
 */
export interface AppointmentDetail extends Appointment {
  healthWorkerName?: string;
  healthWorkerPhone?: string;
  facilityAddress?: string;
  facilityPhone?: string;
  cancelReason?: string;
}

/**
 * Future vs Past Appointment categorization
 */
export interface CategorizedAppointments {
  future: Appointment[];
  past: Appointment[];
}
