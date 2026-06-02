import { apiClient } from "./client";

const CONSENT_BASE_PATH = "/api/v1/consent";

export type ConsentType =
  | "GOV_DATA_SHARE"
  | "SMS_REMINDERS"
  | "RESEARCH_PARTICIPATION"
  | "FACILITY_TRANSFER";

export interface ConsentRecord {
  id: string;
  patientId: string;
  consentType: ConsentType;
  status: "GRANTED" | "REVOKED";
  grantedDate: string;
  legalBasis: string;
  expiryDate?: string;
  description: string;
}

export interface ConsentRequest {
  consentType: ConsentType;
  grantedDate: string;
  expiryDate?: string;
}

export async function getAllConsents(patientId: string): Promise<ConsentRecord[]> {
  const response = await apiClient.get<ConsentRecord[]>(
    `${CONSENT_BASE_PATH}?patientId=${encodeURIComponent(patientId)}`
  );
  return response;
}

export async function grantConsent(
  patientId: string,
  request: ConsentRequest
): Promise<ConsentRecord> {
  const response = await apiClient.post<ConsentRecord>(CONSENT_BASE_PATH, {
    ...request,
    patientId
  });
  return response;
}

export async function revokeConsent(consentId: string): Promise<void> {
  await apiClient.delete(`${CONSENT_BASE_PATH}/${encodeURIComponent(consentId)}`);
}

function getConsentDescription(type: ConsentType): string {
  const descriptions: Record<ConsentType, string> = {
    GOV_DATA_SHARE: "Government Data Sharing",
    SMS_REMINDERS: "SMS Reminders",
    RESEARCH_PARTICIPATION: "Research Participation",
    FACILITY_TRANSFER: "Facility Transfer"
  };
  return descriptions[type];
}
