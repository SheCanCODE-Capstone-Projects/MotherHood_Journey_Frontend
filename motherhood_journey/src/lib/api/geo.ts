import { apiClient } from "./client";
import type { GeoLocationDTO } from "@/shared/types/api";

const GEO_BASE_PATH = "/api/v1/geo";

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
  province: string,
  district: string,
): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/sectors", { province, district }),
  );
}

export function getCells(
  province: string,
  district: string,
  sector: string,
): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/cells", { province, district, sector }),
  );
}

export function getVillages(
  province: string,
  district: string,
  sector: string,
  cell: string,
): Promise<GeoLocationDTO[]> {
  return apiClient.get<GeoLocationDTO[]>(
    buildGeoPath("/villages", { province, district, sector, cell }),
  );
}