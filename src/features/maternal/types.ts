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
}

export interface MotherRegistrationResponse {
  success: boolean;
  data: {
    mother_id: string;
    health_id: string;
    national_id: string;
    first_name: string;
    last_name: string;
    created_at: string;
  };
  message: string;
}

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
