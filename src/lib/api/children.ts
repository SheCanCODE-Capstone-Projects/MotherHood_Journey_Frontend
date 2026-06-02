import { apiClient } from "./client";
import type {
  AdministerVaccinationRequest,
  ChildDTO,
  ChildRegistrationResponse,
  ChildVaccinationSessionResponse,
  MotherSearchResult,
} from "@/features/child/types";
import type { ChildFormData } from "@/lib/schemas/childSchema";
import { VACCINATION_API } from "@/features/child/api/constants";

const CHILDREN_BASE_PATH = "/api/v1/children";

export type ChildHealthStatus = "HEALTHY" | "AT_RISK" | "CRITICAL";

export interface VaccinationRow {
  id: string;
  vaccine_name: string;
  antigen_code: string;
  due_date: string;
  window_days: number;
  status: "PENDING" | "ADMINISTERED" | "MISSED" | "OVERDUE";
  administered_date: string | null;
  lot_number: string | null;
}

export interface ChildProfileDTO {
  id: string;
  health_id: string;
  first_name: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
  birth_weight: number;
  delivery_type: "NORMAL" | "CAESAREAN" | "ASSISTED";
  birth_certificate_number: string | null;
  health_status: ChildHealthStatus;
  mother_id: string;
  mother_name: string;
  facility_name: string;
  created_at: string;
  vaccinations: VaccinationRow[];
}

export async function getChildren(search?: string): Promise<ChildProfileDTO[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiClient.get<ChildProfileDTO[]>(`${CHILDREN_BASE_PATH}${query}`);
}

export async function getChildProfile(childId: string): Promise<ChildProfileDTO> {
  return apiClient.get<ChildProfileDTO>(`${CHILDREN_BASE_PATH}/${encodeURIComponent(childId)}`);
}

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

export async function searchChildVaccinationSession(searchTerm: string) {
  const params = new URLSearchParams();
  params.set(VACCINATION_API.QUERY_PARAMS.SEARCH_TERM, searchTerm.trim());

  return apiClient.get<ChildVaccinationSessionResponse>(
    `${VACCINATION_API.ENDPOINTS.SESSION_SEARCH}?${params.toString()}`,
  );
}

export async function getChildVaccinationSession(childId: string) {
  return apiClient.get<ChildVaccinationSessionResponse>(
    VACCINATION_API.ENDPOINTS.VACCINATION_CARD(childId),
  );
}

export async function administerVaccination(
  vaccinationId: string,
  body: AdministerVaccinationRequest,
) {
  return apiClient.put<{ success: boolean; message: string }>(
    VACCINATION_API.ENDPOINTS.ADMINISTER(vaccinationId),
    body,
  );
}
