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

const MOCK_CONSENTS: ConsentRecord[] = [
  {
    id: "consent-001",
    patientId: "patient-1",
    consentType: "GOV_DATA_SHARE",
    status: "GRANTED",
    grantedDate: "2025-01-15T10:30:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    expiryDate: "2027-01-15T10:30:00Z",
    description: "Government Data Sharing"
  },
  {
    id: "consent-002",
    patientId: "patient-1",
    consentType: "SMS_REMINDERS",
    status: "GRANTED",
    grantedDate: "2025-02-20T14:45:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    description: "SMS Reminders"
  },
  {
    id: "consent-003",
    patientId: "patient-1",
    consentType: "RESEARCH_PARTICIPATION",
    status: "REVOKED",
    grantedDate: "2024-11-10T09:15:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    description: "Research Participation"
  },
  {
    id: "consent-004",
    patientId: "patient-1",
    consentType: "FACILITY_TRANSFER",
    status: "GRANTED",
    grantedDate: "2025-03-05T16:20:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    expiryDate: "2026-03-05T16:20:00Z",
    description: "Facility Transfer"
  }
];

export async function getAllConsents(patientId: string): Promise<ConsentRecord[]> {
  try {
    const response = await apiClient.get<ConsentRecord[]>(
      `${CONSENT_BASE_PATH}?patientId=${encodeURIComponent(patientId)}`
    );
    return response;
  } catch (error) {
    console.warn("getAllConsents failed, using mock data:", error);
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CONSENTS.filter(c => c.patientId === patientId);
  }
}

export async function grantConsent(
  patientId: string,
  request: ConsentRequest
): Promise<ConsentRecord> {
  try {
    const response = await apiClient.post<ConsentRecord>(CONSENT_BASE_PATH, {
      ...request,
      patientId
    });
    return response;
  } catch (error) {
    console.warn("grantConsent failed, using mock data:", error);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newConsent: ConsentRecord = {
      id: `consent-${Date.now()}`,
      patientId,
      consentType: request.consentType,
      status: "GRANTED",
      grantedDate: request.grantedDate,
      legalBasis: "Rwanda Law No. 058/2021",
      expiryDate: request.expiryDate,
      description: getConsentDescription(request.consentType)
    };
    
    return newConsent;
  }
}

export async function revokeConsent(consentId: string): Promise<void> {
  try {
    await apiClient.delete(`${CONSENT_BASE_PATH}/${encodeURIComponent(consentId)}`);
  } catch (error) {
    console.warn("revokeConsent failed, using mock data:", error);
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock successful revocation
  }
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