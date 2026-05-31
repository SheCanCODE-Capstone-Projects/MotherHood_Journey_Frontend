/**
 * Report Types
 * Type definitions for report entities and related data
 */

/**
 * Report status enum
 * Represents the sync status of a report with HMIS
 */
export type ReportStatus = "NOT_PUSHED" | "QUEUED" | "PUSHED" | "FAILED";

/**
 * Report type enum
 * Represents different types of reports available
 */
export type ReportType = 
  | "VACCINATION_COVERAGE" 
  | "ANC_ATTENDANCE" 
  | "BIRTH_REGISTRATION" 
  | "MATERNAL_HEALTH";

/**
 * Vaccination coverage data point
 */
export type VaccinationDataPoint = {
  vaccineType: string;
  coverage: number;
  target: number;
};

/**
 * ANC attendance data point
 */
export type AncAttendanceDataPoint = {
  month: string;
  attendance: number;
};

/**
 * Birth registration data point by district
 */
export type BirthRegistrationDataPoint = {
  district: string;
  registrations: number;
};

/**
 * Maternal health statistics
 */
export type MaternalHealthStats = {
  maternalMortalityProxy: number;
  ancCoverage: number;
  institutionalDeliveryRate: number;
};

/**
 * Report data based on type
 */
export type ReportData = {
  VACCINATION_COVERAGE: {
    byVaccineType: VaccinationDataPoint[];
  };
  ANC_ATTENDANCE: {
    monthlyAttendance: AncAttendanceDataPoint[];
  };
  BIRTH_REGISTRATION: {
    byDistrict: BirthRegistrationDataPoint[];
  };
  MATERNAL_HEALTH: {
    stats: MaternalHealthStats;
  };
};

/**
 * Report entity
 */
export interface Report {
  id: string;
  reportType: ReportType;
  status: ReportStatus;
  title: string;
  description: string;
  generatedAt: string;
  period?: string;
  scopeLevel?: string;
  generatedById?: string;
  geoLocationId?: string;
  hmisPushStatus?: string;
  periodStart: string;
  periodEnd: string;
  facilityName?: string;
  districtName?: string;
  data: ReportData[ReportType];
  aggregates?: Record<string, unknown>;
}

/**
 * Push to HMIS response
 */
export type PushHmisResponse = {
  success: boolean;
  message: string;
  pushedAt?: string;
};