import { apiClient } from "./client";
import type {
  PatientSearchResult,
  ICD10Code,
  VisitFormData,
  VisitResponse,
  BackendHealthVisit,
  CreateVisitRequest,
} from "@/features/visit/types";


let _facilityId: string | null = null;
let _healthWorkerId: string | null = null;
let _geoLocationId: string | null = null;

export function setVisitAuthContext(opts: {
  facilityId: string;
  healthWorkerId: string;
  geoLocationId?: string;
}) {
  _facilityId = opts.facilityId;
  _healthWorkerId = opts.healthWorkerId;
  if (opts.geoLocationId) _geoLocationId = opts.geoLocationId;
}

const MOCK_PATIENTS: PatientSearchResult[] = [
  { health_id: "MTH-001", name: "Uwimana Marie", patient_type: "MOTHER", age: 28 },
  { health_id: "MTH-002", name: "Mukamana Jeanne", patient_type: "MOTHER", age: 32 },
  { health_id: "MTH-003", name: "Nyiramongi Alice", patient_type: "MOTHER", age: 24 },
  { health_id: "MTH-004", name: "Uwase Beatrice", patient_type: "MOTHER", age: 30 },
  { health_id: "MTH-005", name: "Nyirahabimana Claudine", patient_type: "MOTHER", age: 27 },
  { health_id: "MTH-006", name: "Mukandayisenga Olive", patient_type: "MOTHER", age: 35 },
  { health_id: "MTH-007", name: "Uwimana Angelique", patient_type: "MOTHER", age: 22 },
  { health_id: "CHD-001", name: "Habimana Jean", patient_type: "CHILD", age: 3 },
  { health_id: "CHD-002", name: "Ishimwe David", patient_type: "CHILD", age: 1 },
  { health_id: "CHD-003", name: "Uwimana Grace", patient_type: "CHILD", age: 5 },
  { health_id: "CHD-004", name: "Hakizimana Eric", patient_type: "CHILD", age: 2 },
  { health_id: "CHD-005", name: "Mukamana Alice", patient_type: "CHILD", age: 4 },
];

/**
 * Search patients by health ID or name
 *
 * TODO: Replace with backend patient search once available.
 * Backend has no generic patient search endpoint yet — using mock data.
 */
export async function searchPatients(
  query: string,
  patientType: "MOTHER" | "CHILD",
): Promise<PatientSearchResult[]> {
  const results = MOCK_PATIENTS.filter(
    (p) =>
      p.patient_type === patientType &&
      (p.health_id.toLowerCase().includes(query.toLowerCase()) ||
        p.name.toLowerCase().includes(query.toLowerCase())),
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
  return results;
}

export async function searchICD10Codes(query: string): Promise<ICD10Code[]> {
  const mockCodes: ICD10Code[] = [
    { code: "A00", name: "Cholera" },
    { code: "A01", name: "Typhoid and paratyphoid fevers" },
    { code: "A09", name: "Infectious gastroenteritis" },
    { code: "A15", name: "Respiratory tuberculosis" },
    { code: "B20", name: "HIV disease" },
    { code: "D50", name: "Iron deficiency anemia" },
    { code: "D51", name: "Vitamin B12 deficiency anemia" },
    { code: "E10", name: "Type 1 diabetes mellitus" },
    { code: "E11", name: "Type 2 diabetes mellitus" },
    { code: "E44", name: "Protein-energy malnutrition" },
    { code: "E86", name: "Volume depletion" },
    { code: "I10", name: "Essential (primary) hypertension" },
    { code: "J00", name: "Acute nasopharyngitis [common cold]" },
    { code: "J02", name: "Acute pharyngitis" },
    { code: "J03", name: "Acute tonsillitis" },
    { code: "J06", name: "Acute upper respiratory infections" },
    { code: "J11", name: "Influenza" },
    { code: "J15", name: "Bacterial pneumonia" },
    { code: "J18", name: "Pneumonia, unspecified" },
    { code: "J45", name: "Asthma" },
    { code: "K52", name: "Other noninfective gastroenteritis" },
    { code: "L08", name: "Local infections of skin" },
    { code: "L20", name: "Atopic dermatitis" },
    { code: "L22", name: "Diaper dermatitis" },
    { code: "M54", name: "Dorsalgia (back pain)" },
    { code: "N39", name: "Urinary tract infection" },
    { code: "O10", name: "Pre-existing hypertension complicating pregnancy" },
    { code: "O13", name: "Gestational hypertension" },
    { code: "O14", name: "Pre-eclampsia" },
    { code: "O15", name: "Eclampsia" },
    { code: "O20", name: "Haemorrhage in early pregnancy" },
    { code: "O21", name: "Excessive vomiting in pregnancy" },
    { code: "O23", name: "Urinary tract infection in pregnancy" },
    { code: "O24", name: "Diabetes mellitus in pregnancy" },
    { code: "O26", name: "Maternal care for other conditions" },
    { code: "O30", name: "Multiple gestation" },
    { code: "O34", name: "Maternal care for abnormality of pelvic organs" },
    { code: "O42", name: "Premature rupture of membranes" },
    { code: "O60", name: "Preterm delivery" },
    { code: "O70", name: "Perineal laceration during delivery" },
    { code: "O72", name: "Postpartum hemorrhage" },
    { code: "O80", name: "Single spontaneous delivery" },
    { code: "O82", name: "Delivery by caesarean section" },
    { code: "O85", name: "Puerperal sepsis" },
    { code: "O99", name: "Other maternal diseases classifiable elsewhere" },
    { code: "P05", name: "Slow fetal growth and fetal malnutrition" },
    { code: "P07", name: "Disorders related to short gestation" },
    { code: "P15", name: "Birth injuries" },
    { code: "P22", name: "Respiratory distress of newborn" },
    { code: "P23", name: "Congenital pneumonia" },
    { code: "P36", name: "Bacterial sepsis of newborn" },
    { code: "P55", name: "Hemolytic disease of newborn" },
    { code: "P59", name: "Neonatal jaundice" },
    { code: "P61", name: "Perinatal hematological disorders" },
    { code: "P80", name: "Hypothermia of newborn" },
    { code: "P92", name: "Feeding problems of newborn" },
    { code: "R50", name: "Fever of unknown origin" },
    { code: "R51", name: "Headache" },
    { code: "R53", name: "Malaise and fatigue" },
    { code: "R55", name: "Syncope and collapse" },
    { code: "R56", name: "Convulsions" },
    { code: "R59", name: "Enlarged lymph nodes" },
    { code: "R60", name: "Edema" },
    { code: "Z00", name: "Encounter for general examination" },
    { code: "Z01", name: "Encounter for other special examination" },
    { code: "Z23", name: "Immunization" },
    { code: "Z30", name: "Contraceptive management" },
    { code: "Z32", name: "Encounter for pregnancy test" },
    { code: "Z33", name: "Pregnant state" },
    { code: "Z34", name: "Supervision of normal pregnancy" },
    { code: "Z35", name: "Supervision of high-risk pregnancy" },
    { code: "Z36", name: "Antenatal screening" },
    { code: "Z37", name: "Outcome of delivery" },
    { code: "Z38", name: "Liveborn infants" },
    { code: "Z39", name: "Postpartum care and examination" },
  ].filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()),
  );
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockCodes;
}

// ─── Submit visit ─────────────────────────────────────────────────────────────

/**
 * Record a new health visit
 *
 * Maps the frontend form data (snake_case) to the backend API format (camelCase)
 * and calls POST /api/v1/health-visits.
 *
 * Falls back to mock if the API is unavailable.
 */
export async function submitVisit(data: VisitFormData): Promise<VisitResponse> {
  try {
    const body: CreateVisitRequest = {
      patientRefId: data.health_id,
      patientType: data.patient_type,
      facilityId: _facilityId ?? "unknown-facility",
      healthWorkerId: _healthWorkerId ?? "unknown-worker",
      geoLocationId: _geoLocationId ?? undefined,
      visitDatetime: new Date().toISOString(),
      visitType: data.visit_type,
      chiefComplaint: data.diagnoses.find((d) => d.is_primary)?.notes,
      weightKg: data.vitals.weight,
      heightCm: data.vitals.height,
      systolicBp: data.vitals.systolic_bp,
      diastolicBp: data.vitals.diastolic_bp,
      muacCm: data.vitals.muac,
      notes: "",
      diagnoses: data.diagnoses.map((d) => ({
        icd10Code: d.icd10_code,
        icd10Name: d.icd10_name,
        isPrimary: d.is_primary,
        notes: d.notes,
      })),
      prescriptions: (data.prescriptions ?? []).map((p) => ({
        medicationName: p.medication_name,
        dosage: p.dosage,
        frequency: p.frequency,
        durationDays: !isNaN(Number(p.duration)) ? Number(p.duration) : undefined,
        instructions: undefined,
      })),
    };

    const response = await apiClient.post<BackendHealthVisit>(
      "/api/v1/health-visits",
      body,
    );

    return {
      visit_id: response.id,
      patient_health_id: response.patientRefId,
      patient_name: data.patient_name,
      visit_type: response.visitType,
      recorded_at: response.createdAt,
    };
  } catch (error) {
    console.warn("submitVisit API call failed, using mock:", error);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      visit_id: `VIS-${Date.now()}`,
      patient_health_id: data.health_id,
      patient_name: data.patient_name,
      visit_type: data.visit_type,
      recorded_at: new Date().toISOString(),
    };
  }
}

export async function getVisitsByFacility(
  facilityId: string,
): Promise<BackendHealthVisit[]> {
  const response = await apiClient.get<{ content: BackendHealthVisit[] }>(
    `/api/v1/health-visits/by-facility/${facilityId}`,
  );
  return response.content;
}

export async function getVisitsByPatient(
  patientRefId: string,
): Promise<BackendHealthVisit[]> {
  const response = await apiClient.get<{ content: BackendHealthVisit[] }>(
    `/api/v1/health-visits/by-patient?patientRefId=${patientRefId}`,
  );
  return response.content;
}

/**
 * Get a single health visit by ID
 */
export async function getVisitById(id: string): Promise<BackendHealthVisit> {
  return apiClient.get<BackendHealthVisit>(`/api/v1/health-visits/${id}`);
}
