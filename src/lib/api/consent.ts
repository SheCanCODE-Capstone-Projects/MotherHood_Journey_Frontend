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

// Mutable mock store — modifications persist for the lifetime of the page session
const MOCK_CONSENTS: ConsentRecord[] = [
  {
    id: "consent-001",
    patientId: "1",
    consentType: "GOV_DATA_SHARE",
    status: "GRANTED",
    grantedDate: "2025-01-15T10:30:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    expiryDate: "2027-01-15T10:30:00Z",
    description: "Government Data Sharing",
  },
  {
    id: "consent-002",
    patientId: "1",
    consentType: "SMS_REMINDERS",
    status: "GRANTED",
    grantedDate: "2025-02-20T14:45:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    description: "SMS Reminders",
  },
  {
    id: "consent-003",
    patientId: "1",
    consentType: "RESEARCH_PARTICIPATION",
    status: "REVOKED",
    grantedDate: "2024-11-10T09:15:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    description: "Research Participation",
  },
  {
    id: "consent-004",
    patientId: "1",
    consentType: "FACILITY_TRANSFER",
    status: "GRANTED",
    grantedDate: "2025-03-05T16:20:00Z",
    legalBasis: "Rwanda Law No. 058/2021",
    expiryDate: "2026-03-05T16:20:00Z",
    description: "Facility Transfer",
  },
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
      patientId,
    });
    return response;
  } catch (error) {
    console.warn("grantConsent failed, using mock data:", error);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update existing record if present, otherwise insert
    const existing = MOCK_CONSENTS.find(
      (c) => c.patientId === patientId && c.consentType === request.consentType,
    );
    if (existing) {
      existing.status = "GRANTED";
      existing.grantedDate = request.grantedDate;
      if (request.expiryDate) existing.expiryDate = request.expiryDate;
      return { ...existing };
    }

    const newRecord: ConsentRecord = {
      id: `consent-${Date.now()}`,
      patientId,
      consentType: request.consentType,
      status: "GRANTED",
      grantedDate: request.grantedDate,
      legalBasis: "Rwanda Law No. 058/2021",
      expiryDate: request.expiryDate,
      description: getConsentDescription(request.consentType),
    };
    MOCK_CONSENTS.push(newRecord);
    return { ...newRecord };
  }
}

export async function revokeConsent(consentId: string): Promise<void> {
  try {
    await apiClient.delete(`${CONSENT_BASE_PATH}/${encodeURIComponent(consentId)}`);
  } catch (error) {
    console.warn("revokeConsent failed, using mock data:", error);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mutate the mock record so re-fetches reflect the revocation
    const record = MOCK_CONSENTS.find((c) => c.id === consentId);
    if (record) record.status = "REVOKED";
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