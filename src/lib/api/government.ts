import { apiClient } from "@/lib/api/client";
import type { Report, ReportStatus, ReportType } from "@/shared/types/report";

export type GovSyncTargetSystem = "NIDA" | "HMIS" | "IREMBO";
export type GovSyncStatus = "PENDING" | "IN_FLIGHT" | "SUCCEEDED" | "FAILED" | "DEAD_LETTER";

export type ProvinceId = "northern" | "eastern" | "kigali" | "southern" | "western";
export type DashboardMetric = "vaccination_coverage" | "anc_attendance" | "birth_registration";

export interface ProvinceMetricData {
  provinceId: ProvinceId;
  provinceName: string;
  value: number;
  districts: DistrictMetricData[];
}

export interface DistrictMetricData {
  districtId: string;
  districtName: string;
  value: number;
}

export interface NationalTotals {
  totalPopulation: number;
  targetPopulation: number;
  totalVaccinated: number;
  totalAncVisits: number;
  totalBirthRegistrations: number;
  vaccinationCoverage: number;
  ancAttendance: number;
  birthRegistrationRate: number;
}

export interface NationalDashboardData {
  metric: DashboardMetric;
  period: string;
  provinces: ProvinceMetricData[];
  national: NationalTotals;
  lastUpdated: string;
}

const DISTRICT_NAMES: Record<ProvinceId, string[]> = {
  northern: ["Musanze", "Gicumbi", "Rulindo", "Burera", "Gakenke"],
  eastern: ["Rwamagana", "Kayonza", "Nyagatare", "Gatsibo", "Kirche", "Ngoma", "Bugesera"],
  kigali: ["Nyarugenge", "Gasabo", "Kicukiro"],
  southern: ["Huye", "Nyanza", "Gisagara", "Nyamagabe", "Ruhango", "Nyaruguru", "Muhanga", "Kamonyi"],
  western: ["Karongi", "Rutsiro", "Rubavu", "Nyabihu", "Ngororero", "Rusizi", "Nyamasheke"],
};

function generateDistrictData(districts: string[], baseValue: number): DistrictMetricData[] {
  return districts.map((name) => ({
    districtId: name.toLowerCase().replace(/\s+/g, "-"),
    districtName: name,
    value: Math.min(100, Math.max(20, baseValue + Math.round((Math.random() - 0.5) * 24))),
  }));
}

function generateMockDashboardData(
  metric: DashboardMetric,
  period: string,
): NationalDashboardData {
  const provinceBaseValues: Record<ProvinceId, number> = {
    northern: 78,
    eastern: 72,
    kigali: 88,
    southern: 81,
    western: 75,
  };

  const provinces: ProvinceMetricData[] = (
    Object.entries(provinceBaseValues) as [ProvinceId, number][]
  ).map(([id, base]) => {
    const value = Math.min(100, Math.max(20, base + Math.round((Math.random() - 0.5) * 10)));
    return {
      provinceId: id,
      provinceName: id.charAt(0).toUpperCase() + id.slice(1),
      value,
      districts: generateDistrictData(DISTRICT_NAMES[id], value),
    };
  });

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const avgCoverage = avg(provinces.map((p) => p.value));

  return {
    metric,
    period,
    provinces,
    national: {
      totalPopulation: 13200000,
      targetPopulation: 4850000,
      totalVaccinated: Math.round(avgCoverage * 0.01 * 4850000),
      totalAncVisits: 218000,
      totalBirthRegistrations: 295000,
      vaccinationCoverage: metric === "vaccination_coverage" ? avgCoverage : 82,
      ancAttendance: metric === "anc_attendance" ? avgCoverage : 79,
      birthRegistrationRate: metric === "birth_registration" ? avgCoverage : 85,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export async function getNationalDashboardMetrics(
  metric: DashboardMetric,
  period: string,
): Promise<NationalDashboardData> {
  try {
    const response = await apiClient.get<unknown>(
      `/api/v1/government/dashboard?metric=${metric}&period=${period}`,
    );
    return response as unknown as NationalDashboardData;
  } catch {
    return generateMockDashboardData(metric, period);
  }
}

export type GovSyncLog = {
  id: string;
  createdAt: string;
  targetSystem: GovSyncTargetSystem;
  syncType: string;
  status: GovSyncStatus;
  retryCount: number;
  lastErrorMessage: string | null;
};

export type GovSyncTriggerResult = {
  status: string;
  source: "api" | "demo";
  startedAt: string;
};

export type GovSyncRetryResult = {
  id: string;
  status: GovSyncStatus;
  source: "api" | "demo";
};

export type GovReport = Report;

type ApiListResponse<T> = {
  content?: T[];
  data?: T[];
  items?: T[];
  logs?: T[];
  reports?: T[];
};

const GOV_REPORT_TYPES: ReportType[] = [
  "VACCINATION_COVERAGE",
  "ANC_ATTENDANCE",
  "BIRTH_REGISTRATION",
  "MATERNAL_HEALTH",
];

const GOV_REPORT_STATUSES: ReportStatus[] = ["NOT_PUSHED", "QUEUED", "PUSHED", "FAILED"];

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

function normalizeReportType(value: unknown): ReportType | null {
  const normalized = String(value ?? "").toUpperCase() as ReportType;
  return GOV_REPORT_TYPES.includes(normalized) ? normalized : null;
}

function normalizeReportStatus(value: unknown): ReportStatus {
  const normalized = String(value ?? "NOT_PUSHED").toUpperCase() as ReportStatus;
  return GOV_REPORT_STATUSES.includes(normalized) ? normalized : "NOT_PUSHED";
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

function unwrapApiData<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const candidate = response as Record<string, unknown>;

  if ("data" in candidate && candidate.data && typeof candidate.data === "object") {
    return candidate.data as T;
  }

  return response as T;
}

function normalizeReport(record: unknown): GovReport | null {
  if (!record || typeof record !== "object") {
    return null;
  }

  const candidate = record as Record<string, unknown>;
  const payload = candidate.data && typeof candidate.data === "object" ? (candidate.data as Record<string, unknown>) : candidate;
  const reportType = normalizeReportType(payload.reportType ?? payload.report_type ?? candidate.reportType ?? candidate.report_type);

  if (!reportType) {
    return null;
  }

  const generatedAt = payload.generatedAt ?? payload.generated_at ?? candidate.generatedAt ?? candidate.generated_at;
  const periodStart = payload.periodStart ?? payload.period_start ?? candidate.periodStart ?? candidate.period_start;
  const periodEnd = payload.periodEnd ?? payload.period_end ?? candidate.periodEnd ?? candidate.period_end;
  const data = payload.data ?? candidate.data ?? {};

  return {
    id: String(payload.id ?? candidate.id ?? ""),
    reportType,
    status: normalizeReportStatus(payload.status ?? candidate.status),
    title: String(payload.title ?? candidate.title ?? `${reportType.replaceAll("_", " ")} Report`),
    description: String(payload.description ?? candidate.description ?? ""),
    generatedAt: typeof generatedAt === "string" ? generatedAt : new Date().toISOString(),
    periodStart: typeof periodStart === "string" ? periodStart : new Date().toISOString(),
    periodEnd: typeof periodEnd === "string" ? periodEnd : new Date().toISOString(),
    facilityName: typeof payload.facilityName === "string" ? payload.facilityName : typeof candidate.facilityName === "string" ? candidate.facilityName : undefined,
    districtName: typeof payload.districtName === "string" ? payload.districtName : typeof candidate.districtName === "string" ? candidate.districtName : undefined,
    data: data as GovReport["data"],
  };
}

function normalizeReportResponse(response: unknown): GovReport | null {
  return normalizeReport(unwrapApiData<GovReport>(response));
}

function normalizeReportListResponse(response: unknown): GovReport[] {
  const unwrapped = unwrapApiData<ApiListResponse<GovReport>>(response);

  if (!unwrapped) {
    return [];
  }

  const records = unwrapped.content ?? unwrapped.data ?? unwrapped.items ?? unwrapped.reports;

  if (!Array.isArray(records)) {
    return [];
  }

  return records.map(normalizeReport).filter(Boolean) as GovReport[];
}

export async function getGovSyncLogs(): Promise<GovSyncLog[]> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/admin/gov-sync?page=0&size=200");
    return normalizeSyncLogResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to load sync logs");
  }
}

export async function getGovDeadLetterLogs(): Promise<GovSyncLog[]> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/admin/gov-sync/dead-letter");
    return normalizeSyncLogResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to load dead-letter queue");
  }
}

export async function getGovSyncStatus(): Promise<Record<string, number>> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/admin/gov-sync/status");
    const data = unwrapApiData<Record<string, unknown>>(response);

    if (!data) {
      return {};
    }

    return Object.entries(data).reduce<Record<string, number>>((accumulator, [key, value]) => {
      accumulator[key] = Number(value ?? 0);
      return accumulator;
    }, {});
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to load sync status");
  }
}

export async function triggerFullSync(): Promise<GovSyncTriggerResult> {
  try {
    await apiClient.post("/api/v1/government/sync");
    return { status: "started", source: "api", startedAt: new Date().toISOString() };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to start full sync");
  }
}

export async function exportGovData(format = "csv"): Promise<{ filename: string; content: string } | null> {
  try {
    const response = await apiClient.get<unknown>(`/api/v1/government/export?format=${encodeURIComponent(format)}`);

    if (typeof response === "string") {
      return { filename: `gov-export.${format}`, content: response };
    }

    if (response && typeof response === "object") {
      const candidate = response as Record<string, unknown>;
      const content = candidate.content ?? candidate.data ?? candidate.text ?? candidate.csv;

      if (typeof content === "string") {
        return { filename: `gov-export.${format}`, content };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function retryGovSyncLog(id: string): Promise<GovSyncRetryResult> {
  try {
    await apiClient.post(`/api/v1/government/sync-logs/${id}/retry`);
    return { id, status: "PENDING", source: "api" };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to retry sync log");
  }
}

export async function getGovReport(reportId: string): Promise<GovReport> {
  const response = await apiClient.get<unknown>(`/api/v1/gov-reports/${reportId}`);
  const report = normalizeReportResponse(response);

  if (!report) {
    throw new Error(`Report ${reportId} was returned in an unexpected format`);
  }

  return report;
}

export async function getGovReportsByUser(userId: string): Promise<GovReport[]> {
  const response = await apiClient.get<unknown>(`/api/v1/gov-reports/by-user/${userId}?page=0&size=50`);
  return normalizeReportListResponse(response);
}
