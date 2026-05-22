import { apiClient } from '../../shared/lib/axios';

export type ReportType = 'VACCINATION_COVERAGE' | 'ANC_ATTENDANCE' | 'BIRTH_REGISTRATION' | 'MATERNAL_HEALTH';
export type PeriodType = 'MONTH' | 'QUARTER' | 'YEAR';
export type ScopeLevel = 'NATIONAL' | 'PROVINCE' | 'DISTRICT' | 'SECTOR';

export interface GenerateReportRequest {
  reportType: ReportType;
  periodType: PeriodType;
  periodDate: string;
  scopeLevel: ScopeLevel;
  provinceId?: string;
  districtId?: string;
  sectorId?: string;
}

export interface GenerateReportResponse {
  reportId: string;
  reportUrl: string;
  generatedAt: string;
}

export const generateReport = async (
  request: GenerateReportRequest,
): Promise<GenerateReportResponse> => {
  const data = await apiClient.post<GenerateReportResponse>('/api/v1/reports/generate', request);
  return data;
};
