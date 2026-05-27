import { apiClient } from "@/lib/api/client";
import type { ReportType, ReportStatus } from "@/shared/types/report";

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

// ─── Report generation ──────────────────────────────────────────────────────

export type ReportPeriodType = "MONTH" | "QUARTER" | "YEAR";
export type ReportScopeLevel = "NATIONAL" | "PROVINCE" | "DISTRICT";

export interface GenerateReportRequest {
  reportType: ReportType;
  periodType: ReportPeriodType;
  periodYear: string;
  periodMonth?: string;
  periodQuarter?: string;
  scopeLevel: ReportScopeLevel;
  scopeId?: string;
  scopeName?: string;
}

export interface StoredReport {
  id: string;
  reportType: ReportType;
  status: ReportStatus;
  title: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  scopeLevel: ReportScopeLevel;
  scopeName: string;
}

const GOV_REPORTS_KEY = "motherhood:gov-reports";

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  VACCINATION_COVERAGE: "Vaccination Coverage",
  ANC_ATTENDANCE: "ANC Attendance",
  BIRTH_REGISTRATION: "Birth Registration",
  MATERNAL_HEALTH: "Maternal Health",
};

const SEED_REPORTS: StoredReport[] = [
  {
    id: "rpt-vaccination-001",
    reportType: "VACCINATION_COVERAGE",
    status: "NOT_PUSHED",
    title: "Vaccination Coverage Report - Q1 2024",
    generatedAt: "2024-03-31T10:00:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-03-31T23:59:59Z",
    scopeLevel: "NATIONAL",
    scopeName: "National",
  },
  {
    id: "rpt-anc-002",
    reportType: "ANC_ATTENDANCE",
    status: "QUEUED",
    title: "ANC Attendance Report - H1 2024",
    generatedAt: "2024-06-15T14:30:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-06-30T23:59:59Z",
    scopeLevel: "DISTRICT",
    scopeName: "Bugesera District",
  },
  {
    id: "rpt-birth-003",
    reportType: "BIRTH_REGISTRATION",
    status: "PUSHED",
    title: "Birth Registration Report - Q2 2024",
    generatedAt: "2024-07-01T09:00:00Z",
    periodStart: "2024-04-01T00:00:00Z",
    periodEnd: "2024-06-30T23:59:59Z",
    scopeLevel: "NATIONAL",
    scopeName: "National",
  },
  {
    id: "rpt-maternal-004",
    reportType: "MATERNAL_HEALTH",
    status: "FAILED",
    title: "Maternal Health Report - H1 2024",
    generatedAt: "2024-08-10T11:00:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-07-31T23:59:59Z",
    scopeLevel: "PROVINCE",
    scopeName: "Eastern Province",
  },
];

function readStoredReports(): StoredReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GOV_REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildPeriodDates(req: GenerateReportRequest): {
  start: string;
  end: string;
  label: string;
} {
  const year = parseInt(req.periodYear);
  if (req.periodType === "YEAR") {
    return {
      start: `${year}-01-01T00:00:00Z`,
      end: `${year}-12-31T23:59:59Z`,
      label: String(year),
    };
  }
  if (req.periodType === "QUARTER") {
    const q = parseInt(req.periodQuarter ?? "1");
    const startMonth = (q - 1) * 3 + 1;
    const endMonth = q * 3;
    const endDay = [3, 6, 9].includes(endMonth) ? 30 : 31;
    return {
      start: `${year}-${String(startMonth).padStart(2, "0")}-01T00:00:00Z`,
      end: `${year}-${String(endMonth).padStart(2, "0")}-${endDay}T23:59:59Z`,
      label: `Q${q} ${year}`,
    };
  }
  const month = parseInt(req.periodMonth ?? "1");
  const lastDay = new Date(year, month, 0).getDate();
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  return {
    start: `${year}-${String(month).padStart(2, "0")}-01T00:00:00Z`,
    end: `${year}-${String(month).padStart(2, "0")}-${lastDay}T23:59:59Z`,
    label: `${monthLabel} ${year}`,
  };
}

export async function getGovernmentReports(): Promise<StoredReport[]> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/government/reports");
    if (Array.isArray(response) && (response as StoredReport[]).length > 0) {
      return response as StoredReport[];
    }
  } catch {
    // fall through to local
  }
  const stored = readStoredReports();
  const storedIds = new Set(stored.map((r) => r.id));
  return [...stored, ...SEED_REPORTS.filter((r) => !storedIds.has(r.id))];
}

export async function generateReport(req: GenerateReportRequest): Promise<{ id: string }> {
  const { start, end, label } = buildPeriodDates(req);
  const scopeName =
    req.scopeName ?? (req.scopeLevel === "NATIONAL" ? "National" : (req.scopeId ?? ""));
  const id = `rpt-${req.reportType.toLowerCase().replace(/_/g, "-")}-${Date.now()}`;
  const report: StoredReport = {
    id,
    reportType: req.reportType,
    status: "NOT_PUSHED",
    title: `${REPORT_TYPE_LABELS[req.reportType]} Report - ${label}`,
    generatedAt: new Date().toISOString(),
    periodStart: start,
    periodEnd: end,
    scopeLevel: req.scopeLevel,
    scopeName,
  };

  try {
    await apiClient.post("/api/v1/government/reports/generate", req);
  } catch {
    // store locally while API is unavailable
    const existing = readStoredReports();
    existing.unshift(report);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GOV_REPORTS_KEY, JSON.stringify(existing.slice(0, 20)));
    }
  }

  return { id };
}

// ────────────────────────────────────────────────────────────────────────────

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
