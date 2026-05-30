import { apiClient } from "@/lib/api/client";
import type { PageResponse } from "@/shared/types/api";
import type { Mother, MotherPageResponse, MotherRegistrationRequest, MotherRegistrationResponse } from "../types";

/**
 * Register a new mother
 * POST /api/v1/mothers
 */
export async function registerMother(
  data: MotherRegistrationRequest
): Promise<MotherRegistrationResponse> {
  return apiClient.post<MotherRegistrationResponse>(
    "/api/v1/mothers",
    {
      national_id: data.national_id,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      phone_number: data.phone_number,
      home_location: data.home_location,
      education_level: data.education_level,
    }
  );
}

/**
 * Search mothers by health_id, name, or NID
 * GET /api/v1/mothers/search
 * NOTE: This endpoint may not exist on backend yet — kept for future use.
 */
export async function searchMothers(
  searchTerm?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<MotherPageResponse> {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append("search_term", searchTerm);
  }
  params.append("page", (page - 1).toString());
  params.append("page_size", pageSize.toString());

  return apiClient.get<MotherPageResponse>(
    `/api/v1/mothers/search?${params.toString()}`
  );
}

/**
 * Get all mothers with pagination
 * GET /api/v1/mothers
 * NOTE: This endpoint may not exist on backend yet — kept for future use.
 */
export async function getMothers(
  page: number = 1,
  pageSize: number = 10
): Promise<MotherPageResponse> {
  const params = new URLSearchParams();
  params.append("page", (page - 1).toString());
  params.append("page_size", pageSize.toString());

  return apiClient.get<MotherPageResponse>(
    `/api/v1/mothers?${params.toString()}`
  );
}

/**
 * Get a mother by UUID
 * GET /api/v1/mothers/{id}
 */
export async function getMotherById(id: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/${id}`);
}

/**
 * Look up a mother by health ID
 * GET /api/v1/mothers/health/{healthId}
 */
export async function getMotherByHealthId(healthId: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/health/${healthId}`);
}

/**
 * List mothers awaiting NIDA verification
 * GET /api/v1/mothers/pending-nida
 */
export async function getPendingNidaMothers(): Promise<Mother[]> {
  return apiClient.get<Mother[]>("/api/v1/mothers/pending-nida");
}
