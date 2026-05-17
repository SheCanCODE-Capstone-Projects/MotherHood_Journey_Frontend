/**
<<<<<<< HEAD
 * Types for maternal features
 */

export interface Mother {
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  home_location: string;
  education_level: string;
}

export interface MotherRegistrationRequest extends Mother {
  // Request body for creating a new mother
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

export interface MotherFormStepOneData {
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
}

export interface MotherFormStepTwoData {
  home_location: string;
  education_level: string;
}

export interface MotherFormData extends MotherFormStepOneData, MotherFormStepTwoData {}
=======
 * Maternal health feature types
 * Based on backend Mother entity structure
 */

/**
 * NIDA (National ID) verification status - matches backend NidaVerifiedStatus enum
 */
export type NidaStatus = "PENDING" | "VERIFIED" | "FAILED" | "MANUAL";

/**
 * Pregnancy status for a mother - matches backend PregnancyStatus enum
 */
export type PregnancyStatus = "ACTIVE" | "DELIVERED" | "LOST" | "TRANSFERRED";

/**
 * User info linked to Mother (OneToOne relationship in backend)
 */
export interface MotherUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

/**
 * Facility info associated with Mother
 */
export interface MotherFacility {
  id: string;
  name: string;
}

/**
 * Geo location info for Mother
 */
export interface MotherGeoLocation {
  id: string;
  sector?: string;
  district?: string;
  province?: string;
}

/**
 * Mother/Patient data model - matches backend Mother entity
 * Note: name comes from the linked User entity
 */
export interface Mother {
  id: string; // UUID
  user?: MotherUser; // OneToOne relationship
  facility?: MotherFacility; // ManyToOne relationship
  geoLocation?: MotherGeoLocation; // ManyToOne relationship
  healthId: string; // unique
  nidaVerifiedStatus: NidaStatus;
  dateOfBirth: string; // ISO date string (LocalDate in backend)
  educationLevel?: string;
  registeredAt: string; // ISO datetime string (LocalDateTime in backend)
  currentPregnancyStatus?: PregnancyStatus;
}

/**
 * Search request parameters for mothers
 */
export interface MotherSearchRequest {
  searchTerm?: string; // health_id, name, or NID
  page?: number;
  pageSize?: number;
}

/**
 * Paginated response from API
 */
export interface MotherPageResponse {
  content: Mother[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
