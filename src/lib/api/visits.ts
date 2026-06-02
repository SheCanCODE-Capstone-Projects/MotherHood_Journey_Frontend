import { apiClient } from "./client";
import { getVisitsByFacility, createHealthVisit } from "./health-visits";
import { searchMothers, getChildren } from "./children";
import type {
  PatientSearchResult,
  ICD10Code,
  VisitFormData,
  VisitResponse,
} from "@/features/visit/types";
import type { HealthVisitResponse, CreateHealthVisitRequest } from "@/shared/types/backend";

export interface VisitSummary {
  visit_id: string;
  patient_health_id: string;
  patient_name: string;
  patient_type: "MOTHER" | "CHILD";
  visit_type: string;
  primary_diagnosis_code: string | null;
  primary_diagnosis_name: string | null;
  recorded_at: string;
}

function mapToVisitSummary(v: HealthVisitResponse): VisitSummary {
  const primaryDx = v.diagnoses?.find((d) => d.isPrimary) ?? v.diagnoses?.[0] ?? null;
  return {
    visit_id: v.id,
    patient_health_id: v.patientRefId,
    patient_name: v.patientRefId,
    patient_type: v.patientType,
    visit_type: v.visitType,
    primary_diagnosis_code: primaryDx?.icd10Code ?? null,
    primary_diagnosis_name: primaryDx?.icd10Name ?? null,
    recorded_at: v.visitDatetime ?? v.createdAt,
  };
}

export async function getVisits(facilityId?: string, search?: string): Promise<VisitSummary[]> {
  try {
    let visits: VisitSummary[] = [];

    if (facilityId) {
      const page = await getVisitsByFacility(facilityId, 0, 50);
      visits = (page.content ?? []).map(mapToVisitSummary);
    } else {
      const response = await apiClient.get<unknown>("/api/v1/health-visits?page=0&size=50");
      if (Array.isArray(response)) {
        visits = (response as HealthVisitResponse[]).map(mapToVisitSummary);
      } else {
        const page = response as { content?: HealthVisitResponse[] };
        visits = (page.content ?? []).map(mapToVisitSummary);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      return visits.filter(
        (v) =>
          v.patient_name.toLowerCase().includes(q) ||
          v.patient_health_id.toLowerCase().includes(q) ||
          v.visit_type.toLowerCase().includes(q),
      );
    }
    return visits;
  } catch {
    return [];
  }
}

export async function searchPatients(
  query: string,
  patientType: "MOTHER" | "CHILD",
): Promise<PatientSearchResult[]> {
  try {
    if (patientType === "MOTHER") {
      const results = await searchMothers(query);
      return results.map((m) => {
        const raw = m as unknown as Record<string, unknown>;
        return {
          health_id: String(raw.health_id ?? raw.healthId ?? raw.id ?? ""),
          name: String(raw.name ?? raw.firstName ?? ""),
          patient_type: "MOTHER" as const,
          age: Number(raw.age ?? 0),
        };
      });
    } else {
      const results = await getChildren(query);
      return results.map((c) => ({
        health_id: c.health_id ?? c.id,
        name: c.first_name,
        patient_type: "CHILD" as const,
        age: Math.floor(
          (Date.now() - new Date(c.date_of_birth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        ),
      }));
    }
  } catch {
    return [];
  }
}

export function searchICD10Codes(query: string): Promise<ICD10Code[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const codes: ICD10Code[] = [
        // A00-B99 — Infectious diseases
        { code: "A00", name: "Cholera" },
        { code: "A01", name: "Typhoid and paratyphoid fevers" },
        { code: "A09", name: "Infectious gastroenteritis" },
        { code: "A15", name: "Respiratory tuberculosis" },
        { code: "B20", name: "HIV disease" },
        // D50-D89 — Blood disorders
        { code: "D50", name: "Iron deficiency anemia" },
        { code: "D51", name: "Vitamin B12 deficiency anemia" },
        { code: "D52", name: "Folate deficiency anemia" },
        { code: "D53", name: "Other nutritional anemias" },
        // E00-E90 — Endocrine/metabolic
        { code: "E10", name: "Type 1 diabetes mellitus" },
        { code: "E11", name: "Type 2 diabetes mellitus" },
        { code: "E14", name: "Unspecified diabetes mellitus" },
        { code: "E44", name: "Protein-energy malnutrition" },
        { code: "E86", name: "Volume depletion" },
        // I10-I99 — Circulatory
        { code: "I10", name: "Essential (primary) hypertension" },
        { code: "I15", name: "Secondary hypertension" },
        // J00-J99 — Respiratory
        { code: "J00", name: "Acute nasopharyngitis [common cold]" },
        { code: "J02", name: "Acute pharyngitis" },
        { code: "J03", name: "Acute tonsillitis" },
        { code: "J06", name: "Acute upper respiratory infections" },
        { code: "J11", name: "Influenza" },
        { code: "J15", name: "Bacterial pneumonia" },
        { code: "J18", name: "Pneumonia, unspecified" },
        { code: "J45", name: "Asthma" },
        // K00-K93 — Digestive
        { code: "K52", name: "Other noninfective gastroenteritis" },
        { code: "K59", name: "Other functional intestinal disorders" },
        // L00-L99 — Skin
        { code: "L08", name: "Local infections of skin" },
        { code: "L20", name: "Atopic dermatitis" },
        { code: "L22", name: "Diaper dermatitis" },
        { code: "L30", name: "Other dermatitis" },
        // M00-M99 — Musculoskeletal
        { code: "M54", name: "Dorsalgia (back pain)" },
        { code: "M79", name: "Other soft tissue disorders" },
        // N00-N99 — Genitourinary
        { code: "N39", name: "Urinary tract infection" },
        { code: "N76", name: "Vulvovaginal disorders" },
        // O00-O99 — Pregnancy & childbirth
        { code: "O10", name: "Pre-existing hypertension complicating pregnancy" },
        { code: "O11", name: "Pre-eclampsia superimposed on chronic hypertension" },
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
        { code: "O41", name: "Disorders of amniotic fluid" },
        { code: "O42", name: "Premature rupture of membranes" },
        { code: "O60", name: "Preterm delivery" },
        { code: "O68", name: "Labor complicated by fetal distress" },
        { code: "O70", name: "Perineal laceration during delivery" },
        { code: "O72", name: "Postpartum hemorrhage" },
        { code: "O80", name: "Single spontaneous delivery" },
        { code: "O82", name: "Delivery by caesarean section" },
        { code: "O85", name: "Puerperal sepsis" },
        { code: "O86", name: "Other puerperal infections" },
        { code: "O90", name: "Complications of the puerperium" },
        { code: "O99", name: "Other maternal diseases classifiable elsewhere" },
        // P00-P96 — Perinatal
        { code: "P05", name: "Slow fetal growth and fetal malnutrition" },
        { code: "P07", name: "Disorders related to short gestation" },
        { code: "P08", name: "Disorders related to long gestation" },
        { code: "P22", name: "Respiratory distress of newborn" },
        { code: "P23", name: "Congenital pneumonia" },
        { code: "P36", name: "Bacterial sepsis of newborn" },
        { code: "P59", name: "Neonatal jaundice" },
        { code: "P92", name: "Feeding problems of newborn" },
        // R00-R99 — Symptoms
        { code: "R50", name: "Fever of unknown origin" },
        { code: "R51", name: "Headache" },
        { code: "R52", name: "Pain, unspecified" },
        { code: "R53", name: "Malaise and fatigue" },
        { code: "R56", name: "Convulsions" },
        { code: "R60", name: "Edema" },
        { code: "R62", name: "Lack of expected normal physiological development" },
        { code: "R63", name: "Symptoms concerning food and fluid intake" },
        // Z00-Z99 — Factors influencing health
        { code: "Z00", name: "Encounter for general examination" },
        { code: "Z09", name: "Follow-up examination after treatment" },
        { code: "Z10", name: "Routine general health check" },
        { code: "Z23", name: "Immunization" },
        { code: "Z30", name: "Contraceptive management" },
        { code: "Z32", name: "Encounter for pregnancy test" },
        { code: "Z34", name: "Supervision of normal pregnancy" },
        { code: "Z35", name: "Supervision of high-risk pregnancy" },
        { code: "Z36", name: "Antenatal screening" },
        { code: "Z39", name: "Postpartum care and examination" },
      ].filter(
        (c) =>
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase()),
      );
      resolve(codes);
    }, 100);
  });
}

export async function submitVisit(data: VisitFormData): Promise<VisitResponse> {
  let facilityId = "";
  let healthWorkerId = "";

  if (typeof window !== "undefined") {
    try {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      facilityId = session?.user?.facilityId ? String(session.user.facilityId) : "";
      const userRec = session?.user as Record<string, unknown> | undefined;
      healthWorkerId = userRec?.id ? String(userRec.id) : "";
    } catch {
      // session unavailable
    }
  }

  const request: CreateHealthVisitRequest = {
    patientRefId: data.health_id,
    patientType: data.patient_type,
    facilityId,
    healthWorkerId,
    visitDatetime: new Date().toISOString(),
    visitType: data.visit_type as CreateHealthVisitRequest["visitType"],
    weightKg: data.vitals?.weight,
    heightCm: data.vitals?.height,
    systolicBp: data.vitals?.systolic_bp,
    diastolicBp: data.vitals?.diastolic_bp,
    muacCm: data.vitals?.muac,
    diagnoses: data.diagnoses?.map((d) => ({
      icd10Code: d.icd10_code,
      icd10Name: d.icd10_name,
      isPrimary: d.is_primary,
      notes: d.notes,
    })),
    prescriptions: data.prescriptions?.map((p) => ({
      medication: p.medication_name,
      dosage: p.dosage,
      duration: p.duration,
    })),
  };

  const result = await createHealthVisit(request);
  return {
    visit_id: result.id,
    patient_health_id: result.patientRefId,
    patient_name: data.patient_name,
    visit_type: result.visitType,
    recorded_at: result.visitDatetime ?? result.createdAt,
  };
}
