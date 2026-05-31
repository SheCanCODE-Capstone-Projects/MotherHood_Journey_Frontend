import { apiClient } from "./client";

const FACILITIES_BASE_PATH = "/api/v1/facilities";

export interface FacilityDTO {
  id: string;
  code: string;
  name: string;
  type: "HC" | "HP" | "HOSPITAL" | "CLINIC";
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  phone?: string;
  email?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityCreateDTO {
  code: string;
  name: string;
  type: "HC" | "HP" | "HOSPITAL" | "CLINIC";
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  phone?: string;
  email?: string;
}

export interface FacilityUpdateDTO {
  name?: string;
  type?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

export interface FacilityListResponse {
  content: FacilityDTO[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FacilityPublicDTO {
  id: string;
  name: string;
  type: string;
  province: string;
  district: string;
  sector: string;
}

function buildFacilitiesPath(path: string, query?: Record<string, string>): string {
  const queryString = query
    ? `?${new URLSearchParams(query).toString()}`
    : "";
  return `${FACILITIES_BASE_PATH}${path}${queryString}`;
}

// CRUD Operations
export async function getFacilities(
  page = 0,
  size = 20,
  signal?: AbortSignal
): Promise<FacilityListResponse> {
  return apiClient.get<FacilityListResponse>(
    buildFacilitiesPath("", { page: String(page), size: String(size) }),
    { signal }
  );
}

export async function getFacilityById(
  id: string,
  signal?: AbortSignal
): Promise<FacilityDTO> {
  return apiClient.get<FacilityDTO>(buildFacilitiesPath(`/${id}`), { signal });
}

export async function createFacility(
  data: FacilityCreateDTO,
  signal?: AbortSignal
): Promise<FacilityDTO> {
  return apiClient.post<FacilityDTO>(FACILITIES_BASE_PATH, data, { signal });
}

export async function updateFacility(
  id: string,
  data: FacilityUpdateDTO,
  signal?: AbortSignal
): Promise<FacilityDTO> {
  return apiClient.put<FacilityDTO>(buildFacilitiesPath(`/${id}`), data, { signal });
}

export async function deleteFacility(
  id: string,
  signal?: AbortSignal
): Promise<void> {
  return apiClient.delete<void>(buildFacilitiesPath(`/${id}`), { signal });
}

// Public listing for registration pickers
export async function getPublicFacilities(
  province?: string,
  district?: string,
  sector?: string,
  signal?: AbortSignal
): Promise<FacilityPublicDTO[]> {
  const query: Record<string, string> = {};
  if (province) query.province = province;
  if (district) query.district = district;
  if (sector) query.sector = sector;
  
  return apiClient.get<FacilityPublicDTO[]>(
    buildFacilitiesPath("/public", query),
    { signal }
  );
}

// Per-facility analytics
export interface FacilityAnalyticsDTO {
  facilityId: string;
  facilityName: string;
  totalMothers: number;
  activePregnancies: number;
  deliveredMothers: number;
  ancAttendanceRate: number;
  vaccinationCoverageRate: number;
  noShowRate: number;
  recentVisits: number;
  lastUpdated: string;
}

export async function getFacilityAnalytics(
  id: string,
  signal?: AbortSignal
): Promise<FacilityAnalyticsDTO> {
  return apiClient.get<FacilityAnalyticsDTO>(
    buildFacilitiesPath(`/${id}/analytics`),
    { signal }
  );
}

// Search facilities
export async function searchFacilities(
  query: string,
  page = 0,
  size = 20,
  signal?: AbortSignal
): Promise<FacilityListResponse> {
  return apiClient.get<FacilityListResponse>(
    buildFacilitiesPath("/search", { q: query, page: String(page), size: String(size) }),
    { signal }
  );
}