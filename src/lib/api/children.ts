import { apiClient } from "@/lib/api/client";
import type {
  AdministerVaccinationRequest,
  ChildVaccinationSessionResponse,
} from "@/features/child/types";

export async function searchChildVaccinationSession(searchTerm: string) {
  const params = new URLSearchParams();
  params.set("search_term", searchTerm.trim());

  return apiClient.get<ChildVaccinationSessionResponse>(
    `/api/v1/children/search?${params.toString()}`,
  );
}

export async function getChildVaccinationSession(childId: string) {
  return apiClient.get<ChildVaccinationSessionResponse>(
    `/api/v1/children/${encodeURIComponent(childId)}/vaccinations`,
  );
}

export async function administerVaccination(
  vaccinationId: string,
  body: AdministerVaccinationRequest,
) {
  return apiClient.put<{ success: boolean; message: string }>(
    `/api/v1/vaccinations/${encodeURIComponent(vaccinationId)}/administer`,
    body,
  );
}
