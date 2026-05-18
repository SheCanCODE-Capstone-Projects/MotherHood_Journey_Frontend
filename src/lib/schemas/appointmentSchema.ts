import { z } from "zod";

export const appointmentTypeSchema = z.enum([
  "ANC",
  "PNC",
  "VACCINATION",
  "GROWTH_CHECK",
  "FOLLOW_UP"
]);

export type AppointmentType = z.infer<typeof appointmentTypeSchema>;

export const createAppointmentSchema = z.object({
  patientHealthId: z.string().min(1, "Patient health ID is required"),
  appointmentType: appointmentTypeSchema,
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  facilityId: z.string().min(1, "Facility is required"),
  notes: z.string().optional(),
  sendSmsReminder: z.boolean().default(false)
});

export type CreateAppointmentRequest = z.infer<typeof createAppointmentSchema>;

export const appointmentResponseSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  patientHealthId: z.string(),
  patientName: z.string(),
  appointmentType: appointmentTypeSchema,
  appointmentDate: z.string(),
  appointmentTime: z.string(),
  facilityId: z.string(),
  facilityName: z.string(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "MISSED"]),
  notes: z.string().nullable(),
  sendSmsReminder: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type AppointmentResponse = z.infer<typeof appointmentResponseSchema>;

export const patientSearchSchema = z.object({
  healthId: z.string().min(1, "Health ID is required")
});

export type PatientSearchRequest = z.infer<typeof patientSearchSchema>;

export const patientInfoSchema = z.object({
  healthId: z.string(),
  fullName: z.string(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  isMother: z.boolean(),
  motherName: z.string().optional(),
  facilityId: z.string(),
  facilityName: z.string()
});

export type PatientInfo = z.infer<typeof patientInfoSchema>;

export const timeSlotSchema = z.object({
  time: z.string(),
  isAvailable: z.boolean(),
  reason: z.string().optional()
});

export type TimeSlot = z.infer<typeof timeSlotSchema>;

export const availableSlotsResponseSchema = z.object({
  date: z.string(),
  slots: z.array(timeSlotSchema)
});

export type AvailableSlotsResponse = z.infer<typeof availableSlotsResponseSchema>;

// Helper function to format appointment type for display
export function formatAppointmentType(type: AppointmentType): string {
  const labels: Record<AppointmentType, string> = {
    ANC: "Antenatal Care",
    PNC: "Postnatal Care",
    VACCINATION: "Vaccination",
    GROWTH_CHECK: "Growth Check",
    FOLLOW_UP: "Follow-up"
  };
  return labels[type];
}

// Helper function to get appointment type color
export function getAppointmentTypeColor(type: AppointmentType): string {
  const colors: Record<AppointmentType, string> = {
    ANC: "bg-[#E8F5F2] text-[#1F6F72] border-[#1F6F72]/20",
    PNC: "bg-[#FFF4F4] text-[#B91C1C] border-[#B91C1C]/20",
    VACCINATION: "bg-[#FFFCF3] text-[#B45309] border-[#B45309]/20",
    GROWTH_CHECK: "bg-[#F5FAFF] text-[#1D4ED8] border-[#1D4ED8]/20",
    FOLLOW_UP: "bg-[#F3F4F6] text-[#4B5563] border-[#4B5563]/20"
  };
  return colors[type];
}