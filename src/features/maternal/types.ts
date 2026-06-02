/**
 * Maternal health feature types
 * Based on backend Mother entity structure
 */

/**
 * Request payload for mother registration
 */
export interface MotherRegistrationRequest {
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  home_location: string;
  education_level: string;
  facility_id?: string;
}

// Matches the MotherResponse schema returned by POST /api/v1/mothers
export interface MotherRegistrationResult {
  id: string;
  healthId: string;
  userId: string;
  facilityId?: string;
  nationalId?: string;
  nidaVerifiedStatus?: string;
  dateOfBirth?: string;
  educationLevel?: string;
  facilityName?: string;
  registeredAt?: string;
}

export type MotherRegistrationResponse = MotherRegistrationResult;

export type NidaStatus = "PENDING" | "VERIFIED" | "FAILED" | "MANUAL";

export type PregnancyStatus = "ACTIVE" | "DELIVERED" | "LOST" | "TRANSFERRED";

export interface MotherUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface MotherFacility {
  id: string;
  name: string;
}

export interface MotherGeoLocation {
  id: string;
  sector?: string;
  district?: string;
  province?: string;
}

export interface Mother {
  id: string;
  user?: MotherUser;
  facility?: MotherFacility;
  geoLocation?: MotherGeoLocation;
  healthId: string;
  nidaVerifiedStatus: NidaStatus;
  dateOfBirth: string;
  educationLevel?: string;
  registeredAt: string;
  currentPregnancyStatus?: PregnancyStatus;
}

export interface MotherSearchRequest {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface MotherPageResponse {
  content: Mother[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ─── Pregnancy types (backend-aligned) ────────────────────────────────────────

export interface BackendPregnancy {
  id: string;
  motherId: string;
  lmpDate: string;
  edd: string;
  status: PregnancyStatus;
  gravida: number;
  para: number;
  assignedChwId?: string;
  outcomeNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePregnancyRequest {
  motherId: string;
  lmpDate: string;
  edd?: string;
  gravida?: number;
  para?: number;
  assignedChwId?: string;
}

export interface UpdatePregnancyRequest {
  status?: PregnancyStatus;
  lmpDate?: string;
  edd?: string;
  gravida?: number;
  para?: number;
  assignedChwId?: string;
  outcomeNotes?: string;
}
