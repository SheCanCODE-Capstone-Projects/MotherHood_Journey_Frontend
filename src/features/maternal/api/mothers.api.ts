import { apiClient } from "@/lib/api/client";
import { resolveGeoLocation } from "@/lib/api/geo";
import type { PageResponse } from "@/shared/types/api";
import type {
  Mother,
  MotherPageResponse,
  MotherRegistrationRequest,
  MotherRegistrationResult,
} from "../types";

const DEFAULT_FACILITY_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

async function resolveGeoId(homeLocation: string): Promise<string> {
  const parts = homeLocation.split(" > ").map((p) => p.trim());
  const result = await resolveGeoLocation({
    province: parts[0] ?? "",
    district: parts[1] ?? "",
    sector:   parts[2] ?? "",
    cell:     parts[3] ?? "",
    village:  parts[4] ?? "",
  });
  if (!result?.id) throw new Error("Could not resolve home location. Please reselect your location.");
  return result.id;
}

export async function registerMother(
  data: MotherRegistrationRequest,
): Promise<MotherRegistrationResult> {
  const facilityId = data.facility_id || DEFAULT_FACILITY_ID;
  const geoLocationId = await resolveGeoId(data.home_location);

  // Step 1 — create the user account for this mother
  const userResponse = await apiClient.post<{ id: string; role: string; active: boolean }>(
    "/api/v1/auth/register",
    {
      phoneNumber: data.phone_number,
      nationalId:  data.national_id,
      password:    "Password123!",
      firstName:   data.first_name,
      lastName:    data.last_name,
      role:        "PATIENT",
      geoLocationId,
      facilityId,
    },
  );

  if (!userResponse?.id) {
    throw new Error("Failed to register user account for the mother.");
  }

  const userId = userResponse.id;

  // Step 2 — create the mother record linked to that user
  const response = await apiClient.post<MotherRegistrationResult>("/api/v1/mothers", {
    userId,
    facilityId,
    nationalId:     data.national_id,
    geoLocationId,
    dateOfBirth:    data.date_of_birth,
    educationLevel: data.education_level?.toUpperCase() || "NONE",
  });

  return response;
}

export async function searchMothers(
  searchTerm?: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<MotherPageResponse> {
  const params = new URLSearchParams();
  if (searchTerm) params.append("search_term", searchTerm);
  params.append("page", (page - 1).toString());
  params.append("size", pageSize.toString());

  return apiClient.get<MotherPageResponse>(
    `/api/v1/mothers/search?${params.toString()}`,
  );
}

export async function getMothers(
  page: number = 1,
  pageSize: number = 10,
): Promise<MotherPageResponse> {
  const params = new URLSearchParams();
  params.append("page", (page - 1).toString());
  params.append("size", pageSize.toString());

  return apiClient.get<MotherPageResponse>(`/api/v1/mothers?${params.toString()}`);
}

export async function getMotherById(id: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/${id}`);
}

export async function getMotherByHealthId(healthId: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/health/${healthId}`);
}
