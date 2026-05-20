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
