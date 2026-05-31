import { apiClient } from "./client";
import type {
  ChildDTO,
  ChildRegistrationResponse,
  MotherSearchResult,
} from "@/features/child/types";
import type { ChildFormData } from "@/lib/schemas/childSchema";

const CHILDREN_BASE_PATH = "/api/v1/children";

/**
 * Register a new child with the backend API
 * Returns the child data along with the vaccination schedule
 */
export async function registerChild(data: ChildFormData): Promise<ChildRegistrationResponse> {
  return apiClient.post<ChildRegistrationResponse>(CHILDREN_BASE_PATH, {
    mother_health_id: data.mother_health_id,
    first_name: data.first_name,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    birth_weight: data.birth_weight,
    delivery_type: data.delivery_type,
    birth_certificate_number: data.birth_certificate_number,
  });
}

/**
 * Search mothers by health ID or name
 * Used for linking child to mother during registration
 */
export async function searchMothers(query: string): Promise<MotherSearchResult[]> {
  const params = new URLSearchParams();
  params.set("search_term", query.trim());

  return apiClient.get<MotherSearchResult[]>(
    `/api/v1/mothers/search?${params.toString()}`
  );
}

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
