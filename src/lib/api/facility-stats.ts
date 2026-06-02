import { apiClient } from "./client";

export interface FacilityStatsDTO {
  id: string;
  name: string;
  sector: string;
  sectorId: number;
  ancAttendance: number;
  vaccinationCoverage: number;
  noShowRate: number;
  trend: { week: string; anc: number; vax: number; noShow: number }[];
}

export interface FacilityNoShowHeatmapDTO {
  facilityId: string;
  facilityName: string;
  days: Record<string, number>;
}

const SECTOR_IDS: Record<string, number> = {
  Nyamata: 1,
  Kamabuye: 2,
  Ruhuha: 3,
  Rilima: 4,
  Gashora: 5,
  Ntarama: 6,
};

function filterByScope(
  facilities: FacilityStatsDTO[],
  geoScopeIds?: string[],
): FacilityStatsDTO[] {
  if (!geoScopeIds || geoScopeIds.length === 0) return facilities;
  return facilities.filter((f) => geoScopeIds.includes(String(f.sectorId)));
}

export async function getFacilityStats(
  geoScopeIds?: string[],
  signal?: AbortSignal,
): Promise<FacilityStatsDTO[]> {
  const response = await apiClient.get<FacilityStatsDTO[]>(
    "/api/v1/facilities/stats",
    { signal },
  );
  return filterByScope(response, geoScopeIds);
}

export async function getFacilityStatsById(
  id: string,
  signal?: AbortSignal,
): Promise<FacilityStatsDTO | null> {
  try {
    const response = await apiClient.get<FacilityStatsDTO>(
      `/api/v1/facilities/${id}/stats`,
      { signal },
    );
    return response;
  } catch (error) {
    console.error(`Failed to fetch facility stats for ${id}:`, error);
    return null;
  }
}

export async function getFacilityNoShowHeatmap(
  geoScopeIds?: string[],
  signal?: AbortSignal,
): Promise<FacilityNoShowHeatmapDTO[]> {
  const response = await apiClient.get<FacilityNoShowHeatmapDTO[]>(
    "/api/v1/facilities/no-show-heatmap",
    { signal },
  );
  
  // If geoScopeIds are provided, filter by scoped facilities
  if (geoScopeIds && geoScopeIds.length > 0) {
    // First get the facilities to know which sectorIds are in scope
    const facilities = await getFacilityStats(geoScopeIds, signal);
    const facilityIds = new Set(facilities.map((f) => f.id));
    return response.filter((row) => facilityIds.has(row.facilityId));
  }
  
  return response;
}

export { SECTOR_IDS };