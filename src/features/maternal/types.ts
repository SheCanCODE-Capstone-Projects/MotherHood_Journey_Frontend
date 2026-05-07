/**
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
