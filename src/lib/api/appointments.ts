import { apiClient } from "./client";
import type {
  CreateAppointmentRequest,
  AppointmentResponse,
  PatientInfo,
  AvailableSlotsResponse,
  TimeSlot,
} from "@/lib/schemas/appointmentSchema";
import type { Appointment } from "@/features/appointment/types";

const APPOINTMENTS_BASE_PATH = "/api/v1/appointments";

// Mock data for demonstration
const MOCK_PATIENTS: Record<string, PatientInfo> = {
  "MHD-2024-001": {
    healthId: "MHD-2024-001",
    fullName: "Marie Uwimana",
    dateOfBirth: "1992-03-15",
    phoneNumber: "+250788123456",
    isMother: true,
    facilityId: "FAC-001",
    facilityName: "Nyagatare Health Centre",
  },
  "MHD-2024-002": {
    healthId: "MHD-2024-002",
    fullName: "Amina Uwimana",
    dateOfBirth: "2019-06-13",
    phoneNumber: "+250788123456",
    isMother: false,
    motherName: "Marie Uwimana",
    facilityId: "FAC-001",
    facilityName: "Nyagatare Health Centre",
  },
  "MHD-2024-003": {
    healthId: "MHD-2024-003",
    fullName: "Jeanne Mukamana",
    dateOfBirth: "1995-08-22",
    phoneNumber: "+250788654321",
    isMother: true,
    facilityId: "FAC-001",
    facilityName: "Nyagatare Health Centre",
  },
  "MHD-2024-004": {
    healthId: "MHD-2024-004",
    fullName: "Patrick Mukamana",
    dateOfBirth: "2022-01-10",
    phoneNumber: "+250788654321",
    isMother: false,
    motherName: "Jeanne Mukamana",
    facilityId: "FAC-001",
    facilityName: "Nyagatare Health Centre",
  },
};

// Generate mock time slots for a given date
function generateMockTimeSlots(date: string): TimeSlot[] {
  const baseSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30"
  ];

  // Randomly mark some slots as booked for demonstration
  const bookedIndices = new Set<number>();
  const dateNum = new Date(date).getDate();
  
  // Use date to create deterministic but varied booking patterns
  for (let i = 0; i < baseSlots.length; i++) {
    if ((i + dateNum) % 4 === 0) {
      bookedIndices.add(i);
    }
  }

  return baseSlots.map((time, index) => ({
    time,
    isAvailable: !bookedIndices.has(index),
    reason: bookedIndices.has(index) ? "Fully booked" : undefined,
  }));
}

// Mock appointment creation response
function createMockAppointmentResponse(
  request: CreateAppointmentRequest
): AppointmentResponse {
  const now = new Date();
  const refNumber = `APT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
  
  const patient = MOCK_PATIENTS[request.patientHealthId];
  
  return {
    id: `apt-${Date.now()}`,
    referenceNumber: refNumber,
    patientHealthId: request.patientHealthId,
    patientName: patient?.fullName || "Unknown Patient",
    appointmentType: request.appointmentType,
    appointmentDate: request.appointmentDate,
    appointmentTime: request.appointmentTime,
    facilityId: request.facilityId,
    facilityName: patient?.facilityName || "Unknown Facility",
    status: "SCHEDULED",
    notes: request.notes || null,
    sendSmsReminder: request.sendSmsReminder,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Search for a patient by health ID
 */
export async function searchPatient(healthId: string): Promise<PatientInfo> {
  try {
    const response = await apiClient.get<PatientInfo>(
      `${APPOINTMENTS_BASE_PATH}/patients/search?healthId=${encodeURIComponent(healthId)}`
    );
    return response;
  } catch (error) {
    console.warn("searchPatient API call failed, using mock data:", error);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patient = MOCK_PATIENTS[healthId];
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  }
}

/**
 * Get available time slots for a specific date and facility
 */
export async function getAvailableSlots(
  date: string,
  facilityId: string
): Promise<AvailableSlotsResponse> {
  try {
    const response = await apiClient.get<AvailableSlotsResponse>(
      `${APPOINTMENTS_BASE_PATH}/slots?date=${date}&facilityId=${facilityId}`
    );
    return response;
  } catch (error) {
    console.warn("getAvailableSlots API call failed, using mock data:", error);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      date,
      slots: generateMockTimeSlots(date),
    };
  }
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  request: CreateAppointmentRequest
): Promise<AppointmentResponse> {
  try {
    const response = await apiClient.post<AppointmentResponse>(
      APPOINTMENTS_BASE_PATH,
      request
    );
    return response;
  } catch (error) {
    console.warn("createAppointment API call failed, using mock data:", error);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return createMockAppointmentResponse(request);
  }
}

/**
 * Get appointment by reference number
 */
export async function getAppointmentByReference(
  referenceNumber: string
): Promise<AppointmentResponse> {
  try {
    const response = await apiClient.get<AppointmentResponse>(
      `${APPOINTMENTS_BASE_PATH}/reference/${encodeURIComponent(referenceNumber)}`
    );
    return response;
  } catch (error) {
    console.warn("getAppointmentByReference API call failed:", error);
    throw error;
  }
}

export { apiClient };

// --- Additional mock APIs expected by hooks ---

function createMockAppointment(idSuffix: number): Appointment {
  const now = new Date();
  return {
    id: `apt-${Date.now()}-${idSuffix}`,
    patientId: "MHD-2024-001",
    facilityName: "Nyamata Health Center",
    appointmentType: "IMMUNIZATION",
    appointmentTypeLabel: "Immunization",
    scheduledDate: now.toISOString().slice(0, 10),
    scheduledTime: "10:00",
    status: "SCHEDULED",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    notes: "Demo appointment",
  };
}

export async function getAppointments(page = 1, pageSize = 10): Promise<{ content: Appointment[]; totalPages: number; totalElements: number; pageNumber: number; pageSize: number; }> {
  // Return mock paginated appointments
  const items: Appointment[] = Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => createMockAppointment(i + (page - 1) * pageSize));
  return {
    content: items,
    totalPages: 1,
    totalElements: items.length,
    pageNumber: page,
    pageSize: items.length,
  };
}

export async function getUpcomingAppointments(pageSize = 10) {
  const all = (await getAppointments(1, pageSize)).content;
  return { content: all.filter((a) => a.status === "SCHEDULED"), totalPages: 1, totalElements: all.length };
}

export async function getPastAppointments(pageSize = 10) {
  const all = (await getAppointments(1, pageSize)).content;
  return { content: all.filter((a) => a.status !== "SCHEDULED"), totalPages: 1, totalElements: all.length };
}

export async function getAppointmentDetail(appointmentId: string): Promise<Appointment> {
  const list = (await getAppointments(1, 10)).content;
  const found = list.find((a) => a.id === appointmentId);
  if (!found) {
    return createMockAppointment(999);
  }
  return found;
}

export async function cancelAppointment(appointmentId: string, _request?: any): Promise<{ ok: true; id: string }> {
  // Mock cancel: return ok
  return { ok: true, id: appointmentId };
}