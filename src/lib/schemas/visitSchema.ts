import { z } from "zod";

export const vitalsSchema = z.object({
  weight: z
    .number({ message: "Weight is required" })
    .min(0.5, "Minimum 0.5 kg")
    .max(300, "Maximum 300 kg"),
  height: z
    .number({ message: "Height is required" })
    .min(10, "Minimum 10 cm")
    .max(250, "Maximum 250 cm"),
  systolic_bp: z
    .number({ message: "Systolic BP is required" })
    .min(50, "Minimum 50 mmHg")
    .max(300, "Maximum 300 mmHg"),
  diastolic_bp: z
    .number({ message: "Diastolic BP is required" })
    .min(30, "Minimum 30 mmHg")
    .max(200, "Maximum 200 mmHg"),
  muac: z
    .number({ message: "MUAC is required" })
    .min(5, "Minimum 5 cm")
    .max(60, "Maximum 60 cm"),
});

export const diagnosisSchema = z.object({
  icd10_code: z.string().min(1, "ICD-10 code is required"),
  icd10_name: z.string().min(1, "Diagnosis name is required"),
  is_primary: z.boolean(),
  notes: z.string().optional(),
});

export const prescriptionSchema = z.object({
  medication_name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
});

export const visitSchema = z.object({
  patient_type: z.enum(["MOTHER", "CHILD"], {
    message: "Select patient type",
  }),
  health_id: z.string().min(1, "Please search and select a patient"),
  patient_name: z.string().min(1, "Patient name is required"),
  visit_type: z.enum(
    ["ANC", "PNC", "IMMUNIZATION", "SICK_CHILD", "GROWTH_MONITORING"],
    { message: "Select visit type" },
  ),
  vitals: vitalsSchema,
  diagnoses: z
    .array(diagnosisSchema)
    .min(1, "At least one diagnosis is required")
    .refine(
      (diags) => diags.some((d) => d.is_primary),
      { message: "One diagnosis must be marked as primary" },
    ),
  prescriptions: z.array(prescriptionSchema).optional(),
});

export type VisitFormData = z.infer<typeof visitSchema>;
export type VitalsFormData = z.infer<typeof vitalsSchema>;
export type DiagnosisFormData = z.infer<typeof diagnosisSchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
