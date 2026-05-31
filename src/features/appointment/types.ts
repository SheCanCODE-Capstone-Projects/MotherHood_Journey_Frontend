<<<<<<< HEAD
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
=======
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

export interface AppointmentDetail extends Appointment {
  providerName?: string;
  providerTitle?: string;
  locationRoom?: string;
  cancelledAt?: string;
  cancelledBy?: string;
>>>>>>> main
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
<<<<<<< HEAD
  status: "CANCELLED";
  cancelledAt: string;
=======
  status: AppointmentStatus;
  updatedAt: string;
>>>>>>> main
}

export interface CategorizedAppointments {
  future: Appointment[];
  past: Appointment[];
}
<<<<<<< HEAD
=======

export type AppointmentType = 
  | "PRENATAL_CHECKUP" 
  | "POSTNATAL_CHECKUP" 
  | "IMMUNIZATION" 
  | "NUTRITIONAL_COUNSELING" 
  | "MENTAL_HEALTH" 
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
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
>>>>>>> main
