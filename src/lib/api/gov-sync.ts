import { apiClient } from "./client";
import type {
  GovSyncEntry,
  GovSyncStatusResponse,
  SyncStatus,
  TargetSystem,
  BackendPage,
} from "@/shared/types/backend";

const BASE = "/api/v1/admin/gov-sync";

export interface GovSyncListParams {
  status?: SyncStatus;
  targetSystem?: TargetSystem;
  page?: number;
  size?: number;
}

export async function listGovSyncEntries(params: GovSyncListParams = {}): Promise<BackendPage<GovSyncEntry>> {
  const qp = new URLSearchParams();
  if (params.status)       qp.set("status",       params.status);
  if (params.targetSystem) qp.set("targetSystem",  params.targetSystem);
  qp.set("page", String(params.page  ?? 0));
  qp.set("size", String(params.size  ?? 20));
  return apiClient.get<BackendPage<GovSyncEntry>>(`${BASE}?${qp.toString()}`);
}

export async function getGovSyncStatus(): Promise<GovSyncStatusResponse> {
  return apiClient.get<GovSyncStatusResponse>(`${BASE}/status`);
}

export async function getDeadLetterQueue(): Promise<BackendPage<GovSyncEntry>> {
  return apiClient.get<BackendPage<GovSyncEntry>>(`${BASE}/dead-letter`);
}

export async function retryGovSyncEntry(id: string): Promise<GovSyncEntry> {
  return apiClient.post<GovSyncEntry>(`${BASE}/${encodeURIComponent(id)}/retry`);
}
