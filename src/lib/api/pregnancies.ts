import { apiClient } from "./client";
import type {
  PregnancyResponse,
  CreatePregnancyRequest,
  UpdatePregnancyRequest,
} from "@/shared/types/backend";

const BASE = "/api/v1/pregnancies";

export async function createPregnancy(data: CreatePregnancyRequest): Promise<PregnancyResponse> {
  return apiClient.post<PregnancyResponse>(BASE, data);
}

export async function getPregnancyById(id: string, facilityId: string): Promise<PregnancyResponse> {
  return apiClient.get<PregnancyResponse>(
    `${BASE}/${encodeURIComponent(id)}?facilityId=${encodeURIComponent(facilityId)}`,
  );
}

export async function updatePregnancy(
  id: string,
  facilityId: string,
  data: UpdatePregnancyRequest,
): Promise<PregnancyResponse> {
  return apiClient.patch<PregnancyResponse>(
    `${BASE}/${encodeURIComponent(id)}?facilityId=${encodeURIComponent(facilityId)}`,
    data,
  );
}

// facilityId is required by the backend for scope enforcement
export async function getPregnanciesByMother(
  motherId: string,
  facilityId?: string,
): Promise<PregnancyResponse[]> {
  const qs = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : "";
  const res = await apiClient.get<unknown>(
    `${BASE}/by-mother/${encodeURIComponent(motherId)}${qs}`,
  );
  if (Array.isArray(res)) return res as PregnancyResponse[];
  if (res && typeof res === "object") {
    const r = res as Record<string, unknown>;
    if (Array.isArray(r.content)) return r.content as PregnancyResponse[];
  }
  return [];
}
