import { apiClient } from "@/lib/api/client";
import type { Mother, MotherRegistrationRequest, MotherRegistrationResponse } from "../types";

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
