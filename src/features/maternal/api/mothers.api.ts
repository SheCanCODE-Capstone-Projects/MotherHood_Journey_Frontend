<<<<<<< HEAD
import { createApiClient } from "@/lib/api/client";
import type {
  MotherRegistrationRequest,
  MotherRegistrationResponse,
} from "../types";

/**
 * Create a new mother registration
 * Sends POST request to /api/v1/mothers with mother data
 * Returns health_id and other registration details
 */
export async function registerMother(
  data: MotherRegistrationRequest
): Promise<MotherRegistrationResponse> {
  const client = createApiClient();

  const response = await client.post<MotherRegistrationResponse>(
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

=======
/**
 * Mothers API endpoints
 * Handles all mother/patient data operations
 * Based on backend: com.motherhood.journey.maternal.controller.MotherController
 */

import { apiClient } from "@/lib/api/client";
import type { PageResponse } from "@/shared/types/api";
import type { Mother, MotherPageResponse } from "../types";

/**
 * Search mothers by health_id, name, or NID
 * Endpoint: GET /api/v1/mothers/search
 * Returns paginated results using backend PageResponse shape
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
  // Backend typically uses 0-based page indexing
  params.append("page", (page - 1).toString());
  params.append("page_size", pageSize.toString());

  const response = await apiClient.get<MotherPageResponse>(
    `/api/v1/mothers/search?${params.toString()}`
  );
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
  return response;
}

/**
<<<<<<< HEAD
 * Get mother details by health ID
 * Used for verification or display purposes
 */
export async function getMotherByHealthId(
  healthId: string
): Promise<MotherRegistrationResponse> {
  const client = createApiClient();

  const response = await client.get<MotherRegistrationResponse>(
    `/api/v1/mothers/${healthId}`
  );

  return response;
=======
 * Get all mothers with pagination
 * Endpoint: GET /api/v1/mothers
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
 * Get a single mother by ID
 * Endpoint: GET /api/v1/mothers/{id}
 */
export async function getMotherById(id: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/${id}`);
}

/**
 * Get mother by health ID
 * Endpoint: GET /api/v1/mothers/health-id/{healthId}
 */
export async function getMotherByHealthId(healthId: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/health-id/${healthId}`);
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
}
