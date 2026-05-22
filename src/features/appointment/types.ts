export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

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
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string | null;
}

export type AppointmentListResponse = {
  appointments: Appointment[];
  total: number;
};

export interface AppointmentDetail extends Appointment {
  referenceNumber?: string;
  patientName?: string;
  facilityId?: string;
}

export type CancelAppointmentRequest = {
  reason?: string;
};

export type CancelAppointmentResponse = {
  ok: boolean;
  id?: string;
};

export type CategorizedAppointments = {
  future: Appointment[];
  past: Appointment[];
};
