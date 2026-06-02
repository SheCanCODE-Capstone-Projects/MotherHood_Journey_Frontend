import { apiClient } from "./client";
import type { VaccinationRecordResponse, AdministerVaccinationRequest } from "@/shared/types/backend";

const BASE = "/api/v1/vaccinations";

export async function administerVaccination(
  id: string,
  data: AdministerVaccinationRequest
): Promise<VaccinationRecordResponse> {
  return apiClient.patch<VaccinationRecordResponse>(
    `${BASE}/${encodeURIComponent(id)}/administer`,
    data
  );
}

export async function getVaccinationsByChild(
  childId: string,
  facilityId: string
): Promise<VaccinationRecordResponse[]> {
  const params = new URLSearchParams({ facilityId });
  return apiClient.get<VaccinationRecordResponse[]>(
    `${BASE}/by-child/${encodeURIComponent(childId)}?${params.toString()}`
  );
}
