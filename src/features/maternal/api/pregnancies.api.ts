import { apiClient } from "@/lib/api/client";
import type {
  BackendPregnancy,
  CreatePregnancyRequest,
  UpdatePregnancyRequest,
} from "@/features/maternal/types";

const BASE = "/api/v1/pregnancies";

export async function getPregnanciesByMother(
  motherId: string,
): Promise<BackendPregnancy[]> {
  const response = await apiClient.get<{ content: BackendPregnancy[] }>(
    `${BASE}/by-mother/${encodeURIComponent(motherId)}`,
  );
  return response.content ?? [];
}

export async function getPregnancyById(
  id: string,
): Promise<BackendPregnancy> {
  return apiClient.get<BackendPregnancy>(
    `${BASE}/${encodeURIComponent(id)}`,
  );
}

export async function createPregnancy(
  data: CreatePregnancyRequest,
): Promise<BackendPregnancy> {
  return apiClient.post<BackendPregnancy>(BASE, data);
}

export async function updatePregnancy(
  id: string,
  data: UpdatePregnancyRequest,
): Promise<BackendPregnancy> {
  return apiClient.patch<BackendPregnancy>(
    `${BASE}/${encodeURIComponent(id)}`,
    data,
  );
}
