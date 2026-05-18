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