export type ServiceTypeId =
  | "BIRTH_CERT"
  | "VACCINATION_CARD"
  | "REFERRAL"
  | "HEALTH_SUMMARY"
  | "REPRINT";
  
export type DocKey = "ID_COPY" | "BIRTH_PROOF" | "FACILITY_LETTER";
  
export interface ServiceType {
  id: ServiceTypeId;
  label: string;
  description: string;
  requiredDocs: DocKey[];
  icon: React.ReactNode;
}
  
export interface DocMeta {
  label: string;
  sub: string;
  icon: React.ReactNode;
}
  
export interface UploadedFiles {
  [key: string]: File;
}
  
export interface SubmitPayload {
  serviceType: ServiceTypeId;
  files: UploadedFiles;
}
  
export interface SubmitResponse {
  referenceNumber: string;
}

export type ServiceRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ESCALATED";

export interface ServiceRequestDTO {
  id: string;
  referenceNo: string;
  patientName: string;
  serviceType: ServiceTypeId;
  submittedDate: string;
  status: ServiceRequestStatus;
  documents: Array<{ key: DocKey; name: string; url: string }>;
  rejectionReason?: string;
}

export interface ReviewActionPayload {
  id: string;
  action: "APPROVED" | "REJECTED" | "ESCALATED";
  rejectionReason?: string;
}

export interface ListServiceRequestsParams {
  status?: ServiceRequestStatus;
  serviceType?: ServiceTypeId;
}

// ─── Backend-aligned types (service-requests API) ─────────────────────────────

export type BackendServiceTypeId =
  | "BIRTH_CERT"
  | "VACCINATION_CARD"
  | "REFERRAL"
  | "HEALTH_SUMMARY"
  | "REPRINT";

export type BackendServiceRequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "IREMBO_SUBMITTED"
  | "COMPLETED";

export interface BackendServiceRequestResponse {
  id: string;
  referenceNo: string;
  serviceType: BackendServiceTypeId;
  status: BackendServiceRequestStatus;
  facilityId: string;
  requesterId: string;
  rejectionReason?: string;
  submittedAt: string;
  resolvedAt?: string;
}

export interface BackendServiceRequestDocResponse {
  id: string;
  requestId: string;
  documentType: string;
  filePath: string;
  fileHash: string;
  uploadedAt: string;
}

export interface CreateServiceRequestPayload {
  serviceType: BackendServiceTypeId;
  facilityId: string;
  geoLocationId?: string;
  payload?: Record<string, unknown>;
}