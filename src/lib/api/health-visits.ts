import { apiClient } from "./client";
import type {
  HealthVisitResponse,
  CreateHealthVisitRequest,
  UpdateHealthVisitRequest,
  PatientType,
  BackendPage,
} from "@/shared/types/backend";

const BASE = "/api/v1/health-visits";

export async function createHealthVisit(data: CreateHealthVisitRequest): Promise<HealthVisitResponse> {
  return apiClient.post<HealthVisitResponse>(BASE, data);
}

export async function getHealthVisitById(id: string, facilityId: string): Promise<HealthVisitResponse> {
  return apiClient.get<HealthVisitResponse>(
    `${BASE}/${encodeURIComponent(id)}?facilityId=${encodeURIComponent(facilityId)}`
  );
}

export async function updateHealthVisit(id: string, data: UpdateHealthVisitRequest): Promise<HealthVisitResponse> {
  return apiClient.patch<HealthVisitResponse>(`${BASE}/${encodeURIComponent(id)}`, data);
}

export async function getVisitsByPatient(
  patientRefId: string,
  patientType: PatientType,
  facilityId: string
): Promise<HealthVisitResponse[]> {
  const params = new URLSearchParams({ patientRefId, patientType, facilityId });
  return apiClient.get<HealthVisitResponse[]>(`${BASE}/by-patient?${params.toString()}`);
}

export async function getVisitsByFacility(
  facilityId: string,
  page = 0,
  size = 20
): Promise<BackendPage<HealthVisitResponse>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiClient.get<BackendPage<HealthVisitResponse>>(
    `${BASE}/by-facility/${encodeURIComponent(facilityId)}?${params.toString()}`
  );
}
