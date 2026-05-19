import type {
  PatientSearchResult,
  ICD10Code,
  VisitFormData,
  VisitResponse,
} from "@/features/visit/types";

export function searchPatients(
  query: string,
  patientType: "MOTHER" | "CHILD",
): Promise<PatientSearchResult[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allPatients = [
        { health_id: "MTH-001", name: "Uwimana Marie", patient_type: "MOTHER" as const, age: 28 },
        { health_id: "MTH-002", name: "Mukamana Jeanne", patient_type: "MOTHER" as const, age: 32 },
        { health_id: "MTH-003", name: "Nyiramongi Alice", patient_type: "MOTHER" as const, age: 24 },
        { health_id: "MTH-004", name: "Uwase Beatrice", patient_type: "MOTHER" as const, age: 30 },
        { health_id: "MTH-005", name: "Nyirahabimana Claudine", patient_type: "MOTHER" as const, age: 27 },
        { health_id: "MTH-006", name: "Mukandayisenga Olive", patient_type: "MOTHER" as const, age: 35 },
        { health_id: "MTH-007", name: "Uwimana Angelique", patient_type: "MOTHER" as const, age: 22 },
        { health_id: "CHD-001", name: "Habimana Jean", patient_type: "CHILD" as const, age: 3 },
        { health_id: "CHD-002", name: "Ishimwe David", patient_type: "CHILD" as const, age: 1 },
        { health_id: "CHD-003", name: "Uwimana Grace", patient_type: "CHILD" as const, age: 5 },
        { health_id: "CHD-004", name: "Hakizimana Eric", patient_type: "CHILD" as const, age: 2 },
        { health_id: "CHD-005", name: "Mukamana Alice", patient_type: "CHILD" as const, age: 4 },
      ].filter(
        (p) =>
          p.patient_type === patientType &&
          (p.health_id.toLowerCase().includes(query.toLowerCase()) ||
            p.name.toLowerCase().includes(query.toLowerCase())),
      );
      resolve(allPatients);
    }, 300);
  });
}

export function searchICD10Codes(query: string): Promise<ICD10Code[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCodes: ICD10Code[] = [
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
        { code: "P15", name: "Birth injuries" },
        { code: "P22", name: "Respiratory distress of newborn" },
        { code: "P23", name: "Congenital pneumonia" },
        { code: "P24", name: "Neonatal aspiration syndromes" },
        { code: "P36", name: "Bacterial sepsis of newborn" },
        { code: "P37", name: "Other congenital infectious diseases" },
        { code: "P39", name: "Other infections specific to perinatal period" },
        { code: "P55", name: "Hemolytic disease of newborn" },
        { code: "P59", name: "Neonatal jaundice" },
        { code: "P61", name: "Perinatal hematological disorders" },
        { code: "P70", name: "Transitory disorders of glucose metabolism" },
        { code: "P71", name: "Transitory neonatal calcium/magnesium disorders" },
        { code: "P74", name: "Other transitory electrolyte disturbances" },
        { code: "P78", name: "Perinatal digestive system disorders" },
        { code: "P80", name: "Hypothermia of newborn" },
        { code: "P83", name: "Other integument disorders specific to newborn" },
        { code: "P92", name: "Feeding problems of newborn" },
        { code: "P96", name: "Other perinatal conditions" },
        // R00-R99 — Symptoms
        { code: "R50", name: "Fever of unknown origin" },
        { code: "R51", name: "Headache" },
        { code: "R52", name: "Pain, unspecified" },
        { code: "R53", name: "Malaise and fatigue" },
        { code: "R55", name: "Syncope and collapse" },
        { code: "R56", name: "Convulsions" },
        { code: "R57", name: "Shock" },
        { code: "R59", name: "Enlarged lymph nodes" },
        { code: "R60", name: "Edema" },
        { code: "R62", name: "Lack of expected normal physiological development" },
        { code: "R63", name: "Symptoms concerning food and fluid intake" },
        { code: "R73", name: "Elevated blood glucose level" },
        { code: "R74", name: "Abnormal serum enzyme levels" },
        { code: "R80", name: "Isolated proteinuria" },
        { code: "R81", name: "Glycosuria" },
        { code: "R82", name: "Other abnormal urine findings" },
        { code: "R91", name: "Abnormal findings on lung imaging" },
        // Z00-Z99 — Factors influencing health
        { code: "Z00", name: "Encounter for general examination" },
        { code: "Z01", name: "Encounter for other special examination" },
        { code: "Z03", name: "Encounter for medical observation" },
        { code: "Z09", name: "Follow-up examination after treatment" },
        { code: "Z10", name: "Routine general health check" },
        { code: "Z20", name: "Contact with infectious diseases" },
        { code: "Z21", name: "Asymptomatic HIV infection status" },
        { code: "Z23", name: "Immunization" },
        { code: "Z29", name: "Need for other prophylactic measures" },
        { code: "Z30", name: "Contraceptive management" },
        { code: "Z32", name: "Encounter for pregnancy test" },
        { code: "Z33", name: "Pregnant state" },
        { code: "Z34", name: "Supervision of normal pregnancy" },
        { code: "Z35", name: "Supervision of high-risk pregnancy" },
        { code: "Z36", name: "Antenatal screening" },
        { code: "Z37", name: "Outcome of delivery" },
        { code: "Z38", name: "Liveborn infants" },
        { code: "Z39", name: "Postpartum care and examination" },
        { code: "Z50", name: "Care involving rehabilitation" },
        { code: "Z51", name: "Other medical care" },
        { code: "Z71", name: "Health counseling" },
        { code: "Z72", name: "Problems related to lifestyle" },
        { code: "Z76", name: "Persons encountering health services" },
      ].filter(
        (c) =>
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase()),
      );
      resolve(mockCodes);
    }, 200);
  });
}

export function submitVisit(data: VisitFormData): Promise<VisitResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const primaryDiagnosis = data.diagnoses.find((d) => d.is_primary);
      const patientName = primaryDiagnosis?.icd10_name ?? "Unknown";

      resolve({
        visit_id: `VIS-${Date.now()}`,
        patient_health_id: data.health_id,
        patient_name: data.patient_name,
        visit_type: data.visit_type,
        recorded_at: new Date().toISOString(),
      });
    }, 1000);
  });
}
