export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export type AppointmentType =
  | "PRENATAL_CHECKUP"
  | "POSTNATAL_CHECKUP"
  | "IMMUNIZATION"
  | "NUTRITIONAL_COUNSELING"
  | "DELIVERY_PREPARATION"
  | "LABORATORY_TEST"
  | "ULTRASOUND"
  | "OTHER";

export interface Appointment {
  id: string;
  patientId: string;
  facilityName: string;
  appointmentType: AppointmentType;
  appointmentTypeLabel: string;
  scheduledDate: string;
  scheduledTime: string;
  providerName?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDetail extends Appointment {
  providerName: string;
  cancellationReason?: string;
}

export interface AppointmentListResponse {
  content: Appointment[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

export interface CancelAppointmentRequest {
  reason?: string;
}

export interface CancelAppointmentResponse {
  id: string;
  status: "CANCELLED";
  cancelledAt: string;
}

export interface CategorizedAppointments {
  future: Appointment[];
  past: Appointment[];
}
