export type PatientType = "MOTHER" | "CHILD";
export type VisitType = "ANC" | "PNC" | "IMMUNIZATION" | "SICK_CHILD" | "GROWTH_MONITORING";

export interface PatientSearchResult {
  health_id: string;
  name: string;
  patient_type: PatientType;
  age: number;
}

export interface ICD10Code {
  code: string;
  name: string;
}

export interface VisitResponse {
  visit_id: string;
  patient_health_id: string;
  patient_name: string;
  visit_type: VisitType;
  recorded_at: string;
}

export type { VisitFormData, VitalsFormData, DiagnosisFormData, PrescriptionFormData } from "@/lib/schemas/visitSchema";

export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  ANC: "Antenatal Care",
  PNC: "Postnatal Care",
  IMMUNIZATION: "Immunization",
  SICK_CHILD: "Sick Child",
  GROWTH_MONITORING: "Growth Monitoring",
};

export interface BackendDiagnosis {
  id: string;
  icd10Code: string;
  icd10Name: string;
  isPrimary: boolean;
  notes?: string;
}

export interface BackendPrescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  instructions?: string;
}

export interface BackendHealthVisit {
  id: string;
  patientRefId: string;
  patientType: PatientType;
  facilityId: string;
  healthWorkerId: string;
  visitDatetime: string;
  visitType: VisitType;
  chiefComplaint?: string;
  weightKg?: number;
  heightCm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  muacCm?: number;
  notes?: string;
  createdAt: string;
  diagnoses: BackendDiagnosis[];
  prescriptions: BackendPrescription[];
}

export interface CreateVisitDiagnosis {
  icd10Code: string;
  icd10Name: string;
  isPrimary: boolean;
  notes?: string;
}

export interface CreateVisitPrescription {
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  instructions?: string;
}

export interface CreateVisitRequest {
  patientRefId: string;
  patientType: PatientType;
  facilityId: string;
  healthWorkerId: string;
  geoLocationId?: string;
  visitDatetime: string;
  visitType: VisitType;
  chiefComplaint?: string;
  weightKg?: number;
  heightCm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  muacCm?: number;
  notes?: string;
  diagnoses: CreateVisitDiagnosis[];
  prescriptions: CreateVisitPrescription[];
}
