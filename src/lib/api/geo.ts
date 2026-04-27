import { apiClient } from "./client";
import type { GeoLocationDTO } from "@/shared/types/api";

const GEO_BASE_PATH = "/api/v1/geo";

export type SectorQueryContext = {
  province: string;
};

export type CellQueryContext = {
  province: string;
  district: string;
};

export type VillageQueryContext = {
  province: string;
  district: string;
  sector: string;
};

function buildGeoPath(path: string, query?: Record<string, string>): string {
  const queryString = query
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return `${GEO_BASE_PATH}${path}${queryString}`;
}

export function getProvinces(): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(buildGeoPath("/provinces"));
}

export function getDistricts(province: string): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/districts", { province }),
  );
}

export function getSectors(
  district: string,
  context: SectorQueryContext,
): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/sectors", { province: context.province, district }),
  );
}

export function getCells(
  sector: string,
  context: CellQueryContext,
): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/cells", {
      province: context.province,
      district: context.district,
      sector,
    }),
  );
}

export function getVillages(
  cell: string,
  context: VillageQueryContext,
): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/villages", {
      province: context.province,
      district: context.district,
      sector: context.sector,
      cell,
    }),
  );
}