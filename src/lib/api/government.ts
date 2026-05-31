import { apiClient } from "@/lib/api/client";
<<<<<<< HEAD
import type { ReportType, ReportStatus } from "@/shared/types/report";
=======
import type { Report, ReportStatus, ReportType } from "@/shared/types/report";

export type GovReportRequest = {
  reportType: ReportType;
  period: string;
  scopeLevel: string;
  geoLocationId: string;
  aggregates: Record<string, unknown>;
};
>>>>>>> main

export type GovSyncTargetSystem = "NIDA" | "HMIS" | "IREMBO";
export type GovSyncStatus = "PENDING" | "IN_FLIGHT" | "SUCCEEDED" | "FAILED" | "DEAD_LETTER";

<<<<<<< HEAD
=======
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

function getRecordValue(record: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }

  return undefined;
}

function normalizePeriodLabel(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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

>>>>>>> main
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

function normalizeGovReportStatus(value: unknown): ReportStatus {
  const normalized = String(value ?? "").toUpperCase();

  if (normalized === "IN_FLIGHT" || normalized === "QUEUED") {
    return "QUEUED";
  }

  if (normalized === "SUCCEEDED" || normalized === "PUSHED") {
    return "PUSHED";
  }

  if (normalized === "FAILED" || normalized === "DEAD_LETTER") {
    return "FAILED";
  }

  return "NOT_PUSHED";
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

function normalizeMeProfileId(response: unknown): string | null {
  const unwrapped = unwrapApiData<Record<string, unknown>>(response);

  if (!unwrapped) {
    return null;
  }

  const profile = "data" in unwrapped && unwrapped.data && typeof unwrapped.data === "object"
    ? (unwrapped.data as Record<string, unknown>)
    : unwrapped;
  const id = getRecordValue(profile, ["id", "userId", "uuid"]);

  return typeof id === "string" && id ? id : null;
}

export type GovernmentProfile = {
  id: string;
  geoLocationId: string | null;
};

function normalizeGovernmentProfile(response: unknown): GovernmentProfile | null {
  const unwrapped = unwrapApiData<Record<string, unknown>>(response);

  if (!unwrapped) {
    return null;
  }

  const profile = "data" in unwrapped && unwrapped.data && typeof unwrapped.data === "object"
    ? (unwrapped.data as Record<string, unknown>)
    : unwrapped;
  const id = getRecordValue(profile, ["id", "userId", "uuid"]);
  const geoLocationId = getRecordValue(profile, ["geoLocationId", "geo_location_id"]);

  if (typeof id !== "string" || !id) {
    return null;
  }

  return {
    id,
    geoLocationId: typeof geoLocationId === "string" && geoLocationId ? geoLocationId : null,
  };
}

function normalizeReportPeriod(report: Record<string, unknown>): string {
  const period = normalizePeriodLabel(getRecordValue(report, ["period"]));

  if (period) {
    return period;
  }

  const periodStart = normalizePeriodLabel(getRecordValue(report, ["periodStart", "period_start"]));
  const periodEnd = normalizePeriodLabel(getRecordValue(report, ["periodEnd", "period_end"]));

  if (periodStart && periodEnd) {
    return `${periodStart} - ${periodEnd}`;
  }

  return periodStart ?? periodEnd ?? new Date().toISOString();
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
  const reportType = normalizeReportType(
    getRecordValue(payload, ["reportType", "report_type"]) ?? getRecordValue(candidate, ["reportType", "report_type"]),
  );

  if (!reportType) {
    return null;
  }

  const generatedAt = getRecordValue(payload, ["generatedAt", "generated_at"]) ?? getRecordValue(candidate, ["generatedAt", "generated_at"]);
  const period = normalizeReportPeriod(payload);
  const aggregates = getRecordValue(payload, ["aggregates", "data"]) ?? getRecordValue(candidate, ["aggregates", "data"]);
  const scopeLevel = getRecordValue(payload, ["scopeLevel", "scope_level", "scope"]);
  const geoLocationId = getRecordValue(payload, ["geoLocationId", "geo_location_id"]);
  const generatedById = getRecordValue(payload, ["generatedById", "generated_by_id"]);
  const hmisPushStatus = getRecordValue(payload, ["hmisPushStatus", "hmis_push_status"]);

  return {
    id: String(payload.id ?? candidate.id ?? ""),
    reportType,
    status: normalizeGovReportStatus(hmisPushStatus ?? payload.status ?? candidate.status),
    title: String(payload.title ?? candidate.title ?? `${reportType.replaceAll("_", " ")} Report`),
    description: String(
      payload.description ??
        candidate.description ??
        `${reportType.replaceAll("_", " ")} analytics for ${String(scopeLevel ?? "national").toLowerCase()}`,
    ),
    generatedAt: typeof generatedAt === "string" ? generatedAt : new Date().toISOString(),
    period,
    scopeLevel: typeof scopeLevel === "string" ? scopeLevel : undefined,
    generatedById: typeof generatedById === "string" ? generatedById : undefined,
    geoLocationId: typeof geoLocationId === "string" ? geoLocationId : undefined,
    hmisPushStatus: typeof hmisPushStatus === "string" ? hmisPushStatus : undefined,
    periodStart: period,
    periodEnd: period,
    facilityName: typeof payload.facilityName === "string" ? payload.facilityName : typeof candidate.facilityName === "string" ? candidate.facilityName : undefined,
    districtName: typeof payload.districtName === "string" ? payload.districtName : typeof candidate.districtName === "string" ? candidate.districtName : undefined,
    data: aggregates as GovReport["data"],
    aggregates: aggregates as Record<string, unknown>,
  };
}

function normalizeReportResponse(response: unknown): GovReport | null {
  return normalizeReport(unwrapApiData<GovReport>(response));
}

function normalizeReportListResponse(response: unknown): GovReport[] {
  const unwrapped = unwrapApiData<ApiListResponse<GovReport> | Record<string, unknown>>(response);

  if (!unwrapped) {
    return [];
  }

  const candidate = unwrapped as Record<string, unknown>;
  const nestedData = candidate.data && typeof candidate.data === "object" ? (candidate.data as Record<string, unknown>) : null;
  const records =
    (Array.isArray((candidate as ApiListResponse<GovReport>).content) && (candidate as ApiListResponse<GovReport>).content) ||
    (Array.isArray(candidate.content) && candidate.content) ||
    (Array.isArray(candidate.items) && candidate.items) ||
    (Array.isArray(candidate.reports) && candidate.reports) ||
    (nestedData && (Array.isArray(nestedData.content) ? nestedData.content : Array.isArray(nestedData.items) ? nestedData.items : Array.isArray(nestedData.reports) ? nestedData.reports : null)) ||
    (nestedData && Array.isArray(nestedData.data) ? nestedData.data : null);

  if (!Array.isArray(records)) {
    return [];
  }

  return records.map(normalizeReport).filter(Boolean) as GovReport[];
}

export async function getCurrentGovernmentUserId(): Promise<string | null> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/me");
    return normalizeMeProfileId(response);
  } catch {
    return null;
  }
}

export async function getCurrentGovernmentProfile(): Promise<GovernmentProfile | null> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/me");
    return normalizeGovernmentProfile(response);
  } catch {
    return null;
  }
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

export async function generateGovReport(request: GovReportRequest): Promise<GovReport> {
  const response = await apiClient.post<unknown>("/api/v1/gov-reports", request);
  const report = normalizeReportResponse(response);

  if (!report) {
    throw new Error("Government report generation returned an unexpected format");
  }

  return report;
}
