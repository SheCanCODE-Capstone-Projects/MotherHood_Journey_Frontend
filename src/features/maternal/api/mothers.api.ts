import { apiClient } from "@/lib/api/client";
import { resolveGeoLocation } from "@/lib/api/geo";
import type {
  Mother,
  MotherPageResponse,
  MotherRegistrationRequest,
  MotherRegistrationResult,
} from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.trim() ??
  "https://motherhoodjourneybackend-production.up.railway.app";

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
  if (!data.facility_id) {
    throw new Error("Facility ID is required. Please ensure you are logged in as a facility user.");
  }
  const facilityId = data.facility_id;
  const geoLocationId = await resolveGeoId(data.home_location);

  // Step 1 — create the user account (public endpoint — no auth token)
  const registerRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phoneNumber: data.phone_number,
      nationalId:  data.national_id,
      password:    "Password123!",
      firstName:   data.first_name,
      lastName:    data.last_name,
      role:        "PATIENT",
      geoLocationId,
      facilityId,
    }),
  });

  const registerBody = await registerRes.json().catch(() => ({}));
  if (!registerRes.ok || registerBody?.success === false) {
    const msg = registerBody?.message ?? `Registration failed (${registerRes.status})`;
    throw new Error(msg);
  }

  const userResponse = registerBody?.data ?? registerBody;
  if (!userResponse?.id) {
    throw new Error("Failed to register user account for the mother.");
  }

  const userId = userResponse.id;

  // Step 2 — create the mother record (auth required — apiClient adds token)
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
