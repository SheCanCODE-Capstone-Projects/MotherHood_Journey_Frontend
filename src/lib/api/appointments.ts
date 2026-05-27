import { apiClient } from "./client";
import type {
  CreateAppointmentRequest,
  AppointmentResponse,
  PatientInfo,
  AvailableSlotsResponse,
  TimeSlot,
} from "@/lib/schemas/appointmentSchema";
import type {
  Appointment,
  AppointmentDetail,
  AppointmentListResponse,
  CancelAppointmentRequest,
  CancelAppointmentResponse,
} from "@/features/appointment/types";
import { createDemoAppointments } from "@/features/appointment/mock";

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

// ─── Patient appointment list functions ───────────────────────────────────────

export async function getAppointments(
  page = 1,
  pageSize = 10
): Promise<AppointmentListResponse> {
  try {
    const res = await apiClient.get<AppointmentListResponse>(
      `${APPOINTMENTS_BASE_PATH}?page=${page}&size=${pageSize}`
    );
    return res;
  } catch {
    const all = createDemoAppointments();
    const start = (page - 1) * pageSize;
    return {
      content: all.slice(start, start + pageSize),
      totalPages: Math.ceil(all.length / pageSize),
      totalElements: all.length,
      pageNumber: page,
      pageSize,
    };
  }
}

export async function getAppointmentDetail(id: string): Promise<AppointmentDetail> {
  try {
    return await apiClient.get<AppointmentDetail>(
      `${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(id)}`
    );
  } catch {
    const found = createDemoAppointments().find((a) => a.id === id);
    if (!found) throw new Error(`Appointment ${id} not found`);
    return { ...found, providerName: found.providerName ?? "—" };
  }
}

export async function getUpcomingAppointments(
  pageSize = 10
): Promise<AppointmentListResponse> {
  try {
    return await apiClient.get<AppointmentListResponse>(
      `${APPOINTMENTS_BASE_PATH}?status=SCHEDULED&upcoming=true&size=${pageSize}`
    );
  } catch {
    const now = new Date();
    const upcoming = createDemoAppointments().filter(
      (a) => new Date(`${a.scheduledDate}T${a.scheduledTime}`) > now
    );
    return {
      content: upcoming.slice(0, pageSize),
      totalPages: 1,
      totalElements: upcoming.length,
      pageNumber: 1,
      pageSize,
    };
  }
}

export async function getPastAppointments(
  pageSize = 10
): Promise<AppointmentListResponse> {
  try {
    return await apiClient.get<AppointmentListResponse>(
      `${APPOINTMENTS_BASE_PATH}?past=true&size=${pageSize}`
    );
  } catch {
    const now = new Date();
    const past = createDemoAppointments().filter(
      (a) => new Date(`${a.scheduledDate}T${a.scheduledTime}`) <= now
    );
    return {
      content: past.slice(0, pageSize),
      totalPages: 1,
      totalElements: past.length,
      pageNumber: 1,
      pageSize,
    };
  }
}

export async function cancelAppointment(
  id: string,
  request?: CancelAppointmentRequest
): Promise<CancelAppointmentResponse> {
  try {
    return await apiClient.post<CancelAppointmentResponse>(
      `${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(id)}/cancel`,
      request ?? {}
    );
  } catch {
    return {
      id,
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
    };
  }
}

export { apiClient };