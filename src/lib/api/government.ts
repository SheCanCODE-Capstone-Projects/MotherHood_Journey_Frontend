import { apiClient } from "@/lib/api/client";

export type GovSyncTargetSystem = "NIDA" | "HMIS" | "IREMBO";
export type GovSyncStatus = "PENDING" | "IN_FLIGHT" | "SUCCEEDED" | "FAILED" | "DEAD_LETTER";

export type GovSyncLog = {
  id: string;
  createdAt: string;
  targetSystem: GovSyncTargetSystem;
  syncType: string;
  status: GovSyncStatus;
  retryCount: number;
  lastErrorMessage: string | null;
};

export type GovSyncRetryResult = {
  id: string;
  status: GovSyncStatus;
  source: "api" | "demo";
};

const DEMO_STORAGE_KEY = "motherhood:gov-sync-logs-demo";

function addMinutes(base: Date, minutes: number) {
  const date = new Date(base);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function createDemoGovSyncLogs(): GovSyncLog[] {
  const now = new Date();

  return [
    {
      id: "742dfbd2-041b-4539-95ab-8e8b91317791",
      createdAt: addMinutes(now, -6),
      targetSystem: "HMIS",
      syncType: "MATERNAL_VISIT_PUSH",
      status: "IN_FLIGHT",
      retryCount: 1,
      lastErrorMessage: null,
    },
    {
      id: "2a6c2c56-c0c2-4818-86f8-7c9df72ea861",
      createdAt: addMinutes(now, -18),
      targetSystem: "NIDA",
      syncType: "NATIONAL_ID_LOOKUP",
      status: "SUCCEEDED",
      retryCount: 0,
      lastErrorMessage: null,
    },
    {
      id: "a2cbb6e9-0d7f-44ad-b13a-010e2b8bcb0c",
      createdAt: addMinutes(now, -31),
      targetSystem: "IREMBO",
      syncType: "APPOINTMENT_NOTIFICATION",
      status: "FAILED",
      retryCount: 2,
      lastErrorMessage:
        "IREMBO gateway returned HTTP 503 after the appointment payload was accepted by the local queue.",
    },
    {
      id: "c2b5e266-8b49-44f6-8500-a9f63e2d596c",
      createdAt: addMinutes(now, -47),
      targetSystem: "HMIS",
      syncType: "DELIVERY_OUTCOME_PUSH",
      status: "DEAD_LETTER",
      retryCount: 5,
      lastErrorMessage:
        "HMIS rejected the delivery outcome because facilityCode was missing after all retry attempts.",
    },
    {
      id: "ebb5e723-e3fc-40f2-9384-9d074f1377ad",
      createdAt: addMinutes(now, -69),
      targetSystem: "NIDA",
      syncType: "MOTHER_DEMOGRAPHICS_VERIFY",
      status: "PENDING",
      retryCount: 0,
      lastErrorMessage: null,
    },
  ];
}

function readStoredDemoGovSyncLogs(): GovSyncLog[] {
  if (typeof window === "undefined") {
    return createDemoGovSyncLogs();
  }

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);

    if (!raw) {
      const demo = createDemoGovSyncLogs();
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }

    const parsed = JSON.parse(raw) as GovSyncLog[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : createDemoGovSyncLogs();
  } catch {
    return createDemoGovSyncLogs();
  }
}

function writeStoredDemoGovSyncLogs(logs: GovSyncLog[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(logs));
}

function normalizeTargetSystem(value: unknown): GovSyncTargetSystem {
  const normalized = String(value ?? "HMIS").toUpperCase();
  return normalized === "NIDA" || normalized === "IREMBO" ? normalized : "HMIS";
}

function normalizeStatus(value: unknown): GovSyncStatus {
  const normalized = String(value ?? "PENDING").toUpperCase();

  if (
    normalized === "IN_FLIGHT" ||
    normalized === "SUCCEEDED" ||
    normalized === "FAILED" ||
    normalized === "DEAD_LETTER"
  ) {
    return normalized;
  }

  return "PENDING";
}

function normalizeSyncLog(record: unknown): GovSyncLog | null {
  if (!record || typeof record !== "object") {
    return null;
  }

  const candidate = record as Record<string, unknown>;
  const createdAt = candidate.createdAt ?? candidate.created_at ?? candidate.createdDate;
  const targetSystem = candidate.targetSystem ?? candidate.target_system ?? candidate.system;
  const syncType = candidate.syncType ?? candidate.sync_type ?? candidate.type;
  const retryCount = candidate.retryCount ?? candidate.retry_count ?? candidate.retries;
  const lastErrorMessage =
    candidate.lastErrorMessage ?? candidate.last_error_message ?? candidate.errorMessage;

  return {
    id: String(candidate.id ?? candidate.uuid ?? ""),
    createdAt: typeof createdAt === "string" ? createdAt : new Date().toISOString(),
    targetSystem: normalizeTargetSystem(targetSystem),
    syncType: String(syncType ?? "UNKNOWN_SYNC"),
    status: normalizeStatus(candidate.status),
    retryCount: Number(retryCount ?? 0),
    lastErrorMessage: typeof lastErrorMessage === "string" && lastErrorMessage ? lastErrorMessage : null,
  };
}

function normalizeSyncLogResponse(response: unknown): GovSyncLog[] {
  if (Array.isArray(response)) {
    return response.map(normalizeSyncLog).filter(Boolean) as GovSyncLog[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const candidate = response as Record<string, unknown>;
  const records = candidate.content ?? candidate.data ?? candidate.items ?? candidate.logs;

  if (!Array.isArray(records)) {
    return [];
  }

  return records.map(normalizeSyncLog).filter(Boolean) as GovSyncLog[];
}

export async function getGovSyncLogs(): Promise<GovSyncLog[]> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/government/sync-logs");
    const logs = normalizeSyncLogResponse(response);

    if (logs.length > 0) {
      return logs;
    }
  } catch {
    // Keep the page usable while the backend endpoint is not available locally.
  }

  return readStoredDemoGovSyncLogs();
}

export async function retryGovSyncLog(id: string): Promise<GovSyncRetryResult> {
  try {
    await apiClient.post(`/api/v1/government/sync-logs/${id}/retry`);
    return { id, status: "PENDING", source: "api" };
  } catch {
    const updated = readStoredDemoGovSyncLogs().map((log) =>
      log.id === id
        ? {
            ...log,
            status: "PENDING" as GovSyncStatus,
            retryCount: log.retryCount + 1,
            lastErrorMessage: null,
          }
        : log,
    );
    writeStoredDemoGovSyncLogs(updated);
    return { id, status: "PENDING", source: "demo" };
  }
}
