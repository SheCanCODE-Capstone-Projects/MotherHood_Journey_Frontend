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

const MOCK_FACILITIES: FacilityStatsDTO[] = [
  {
    id: "nyamata-hc",
    name: "Nyamata HC",
    sector: "Nyamata",
    sectorId: 1,
    ancAttendance: 92,
    vaccinationCoverage: 95,
    noShowRate: 3,
    trend: [
      { week: "Wk 1", anc: 80, vax: 85, noShow: 12 },
      { week: "Wk 2", anc: 82, vax: 87, noShow: 10 },
      { week: "Wk 3", anc: 83, vax: 89, noShow: 9 },
      { week: "Wk 4", anc: 85, vax: 90, noShow: 9 },
      { week: "Wk 5", anc: 86, vax: 91, noShow: 8 },
      { week: "Wk 6", anc: 92, vax: 95, noShow: 3 },
    ],
  },
  {
    id: "kamabuye-hp",
    name: "Kamabuye HP",
    sector: "Kamabuye",
    sectorId: 2,
    ancAttendance: 78,
    vaccinationCoverage: 82,
    noShowRate: 14,
    trend: [
      { week: "Wk 1", anc: 72, vax: 74, noShow: 20 },
      { week: "Wk 2", anc: 73, vax: 76, noShow: 19 },
      { week: "Wk 3", anc: 75, vax: 78, noShow: 17 },
      { week: "Wk 4", anc: 76, vax: 79, noShow: 16 },
      { week: "Wk 5", anc: 77, vax: 81, noShow: 15 },
      { week: "Wk 6", anc: 78, vax: 82, noShow: 14 },
    ],
  },
  {
    id: "ruhuha-hc",
    name: "Ruhuha HC",
    sector: "Ruhuha",
    sectorId: 3,
    ancAttendance: 88,
    vaccinationCoverage: 91,
    noShowRate: 6,
    trend: [
      { week: "Wk 1", anc: 72, vax: 74, noShow: 20 },
      { week: "Wk 2", anc: 74, vax: 76, noShow: 19 },
      { week: "Wk 3", anc: 75, vax: 77, noShow: 18 },
      { week: "Wk 4", anc: 77, vax: 79, noShow: 17 },
      { week: "Wk 5", anc: 78, vax: 80, noShow: 16 },
      { week: "Wk 6", anc: 88, vax: 91, noShow: 6 },
    ],
  },
  {
    id: "rilima-hp",
    name: "Rilima HP",
    sector: "Rilima",
    sectorId: 4,
    ancAttendance: 71,
    vaccinationCoverage: 68,
    noShowRate: 23,
    trend: [
      { week: "Wk 1", anc: 65, vax: 60, noShow: 30 },
      { week: "Wk 2", anc: 66, vax: 62, noShow: 28 },
      { week: "Wk 3", anc: 68, vax: 64, noShow: 27 },
      { week: "Wk 4", anc: 69, vax: 65, noShow: 25 },
      { week: "Wk 5", anc: 70, vax: 67, noShow: 24 },
      { week: "Wk 6", anc: 71, vax: 68, noShow: 23 },
    ],
  },
  {
    id: "gashora-hc",
    name: "Gashora HC",
    sector: "Gashora",
    sectorId: 5,
    ancAttendance: 65,
    vaccinationCoverage: 72,
    noShowRate: 19,
    trend: [
      { week: "Wk 1", anc: 58, vax: 65, noShow: 25 },
      { week: "Wk 2", anc: 60, vax: 67, noShow: 23 },
      { week: "Wk 3", anc: 61, vax: 68, noShow: 22 },
      { week: "Wk 4", anc: 63, vax: 70, noShow: 21 },
      { week: "Wk 5", anc: 64, vax: 71, noShow: 20 },
      { week: "Wk 6", anc: 65, vax: 72, noShow: 19 },
    ],
  },
  {
    id: "ntarama-hc",
    name: "Ntarama HC",
    sector: "Ntarama",
    sectorId: 6,
    ancAttendance: 58,
    vaccinationCoverage: 61,
    noShowRate: 31,
    trend: [
      { week: "Wk 1", anc: 50, vax: 54, noShow: 38 },
      { week: "Wk 2", anc: 52, vax: 56, noShow: 36 },
      { week: "Wk 3", anc: 53, vax: 57, noShow: 35 },
      { week: "Wk 4", anc: 55, vax: 59, noShow: 33 },
      { week: "Wk 5", anc: 57, vax: 60, noShow: 32 },
      { week: "Wk 6", anc: 58, vax: 61, noShow: 31 },
    ],
  },
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) / 0xffffffff);
  };
}

function generateMockHeatmap(
  facilities: FacilityStatsDTO[],
): FacilityNoShowHeatmapDTO[] {
  return facilities.map((f) => {
    const rng = seededRandom(f.sectorId * 1000 + f.noShowRate);
    const base = f.noShowRate;
    const days: Record<string, number> = {};
    WEEKDAYS.forEach((day) => {
      const variation = (rng() - 0.5) * 16;
      const val = Math.round((base + variation) * 10) / 10;
      days[day] = Math.max(0, val);
    });
    return { facilityId: f.id, facilityName: f.name, days };
  });
}

function filterByScope(
  facilities: FacilityStatsDTO[],
  geoScopeIds?: number[],
): FacilityStatsDTO[] {
  if (!geoScopeIds || geoScopeIds.length === 0) return facilities;
  return facilities.filter((f) => geoScopeIds.includes(f.sectorId));
}

export async function getFacilityStats(
  geoScopeIds?: number[],
  signal?: AbortSignal,
): Promise<FacilityStatsDTO[]> {
  try {
    const response = await apiClient.get<unknown>(
      "/api/v1/facilities/stats",
      { signal },
    );
    const data = response as FacilityStatsDTO[];
    return filterByScope(data, geoScopeIds);
  } catch {
    return filterByScope(MOCK_FACILITIES, geoScopeIds);
  }
}

export async function getFacilityStatsById(
  id: string,
  signal?: AbortSignal,
): Promise<FacilityStatsDTO | null> {
  try {
    const response = await apiClient.get<unknown>(
      `/api/v1/facilities/${id}/stats`,
      { signal },
    );
    return response as FacilityStatsDTO;
  } catch {
    const found = MOCK_FACILITIES.find((f) => f.id === id);
    return found ?? null;
  }
}

export async function getFacilityNoShowHeatmap(
  geoScopeIds?: number[],
  signal?: AbortSignal,
): Promise<FacilityNoShowHeatmapDTO[]> {
  try {
    const response = await apiClient.get<unknown>(
      "/api/v1/facilities/no-show-heatmap",
      { signal },
    );
    const data = response as FacilityNoShowHeatmapDTO[];
    const facilityIds = new Set(
      filterByScope(MOCK_FACILITIES, geoScopeIds).map((f) => f.id),
    );
    return data.filter((row) => facilityIds.has(row.facilityId));
  } catch {
    const scoped = filterByScope(MOCK_FACILITIES, geoScopeIds);
    return generateMockHeatmap(scoped);
  }
}

export { SECTOR_IDS };
