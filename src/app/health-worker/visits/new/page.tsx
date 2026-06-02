"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import { visitSchema, type VisitFormData } from "@/lib/schemas/visitSchema";
import {
  searchPatients,
  searchICD10Codes,
  submitVisit,
  setVisitAuthContext,
} from "@/lib/api/visits";
import { cn } from "@/shared/lib/utils";
import {
  VISIT_TYPE_LABELS,
  type PatientSearchResult,
  type ICD10Code,
  type VisitResponse,
} from "@/features/visit/types";

const STEPS = [
  { number: 1, label: "Patient" },
  { number: 2, label: "Visit" },
  { number: 3, label: "Diagnoses" },
  { number: 4, label: "Prescriptions" },
];

const VITAL_FIELDS = [
  { key: "weight", label: "Weight (kg)", min: 0.5, max: 300, step: 0.1 },
  { key: "height", label: "Height (cm)", min: 10, max: 250, step: 0.1 },
  { key: "systolic_bp", label: "Systolic BP (mmHg)", min: 50, max: 300, step: 1 },
  { key: "diastolic_bp", label: "Diastolic BP (mmHg)", min: 30, max: 200, step: 1 },
  { key: "muac", label: "MUAC (cm)", min: 5, max: 60, step: 0.1 },
] as const;

type FormStatus = "form" | "success";

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                currentStep > step.number
                  ? "bg-[#2C6F73] text-white"
                  : currentStep === step.number
                    ? "bg-[#2C6F73] text-white ring-2 ring-[#2C6F73]/30"
                    : "border-2 border-gray-300 bg-white text-gray-400",
              )}
            >
              {currentStep > step.number ? (
                <Check className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                "mt-1.5 text-xs font-medium",
                currentStep >= step.number
                  ? "text-[#1D5052]"
                  : "text-gray-400",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-3 h-px w-12 sm:w-20",
                currentStep > step.number ? "bg-[#2C6F73]" : "bg-gray-200",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function NewVisitPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<FormStatus>("form");
  const [visitResult, setVisitResult] = useState<VisitResponse | null>(null);

  useEffect(() => {
    if (session?.user?.facilityId && session?.user?.accessToken) {
      setVisitAuthContext({
        facilityId: String(session.user.facilityId),
        healthWorkerId: session.user.id ?? "",
      });
    }
  }, [session]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientSearchResult | null>(null);

  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [icdResults, setIcdResults] = useState<ICD10Code[]>([]);
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [isSearchingIcd, setIsSearchingIcd] = useState(false);

  const patientDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const icdDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      patient_type: undefined,
      health_id: "",
      patient_name: "",
      visit_type: undefined,
      vitals: {
        weight: undefined,
        height: undefined,
        systolic_bp: undefined,
        diastolic_bp: undefined,
        muac: undefined,
      },
      diagnoses: [],
      prescriptions: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    control,
  } = form;

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
    update: updateDiagnosis,
  } = useFieldArray({ control, name: "diagnoses" });

  const {
    fields: prescriptionFields,
    append: appendPrescription,
    remove: removePrescription,
  } = useFieldArray({ control, name: "prescriptions" });

  const patientType = form.watch("patient_type");

  const mutation = useMutation({
    mutationFn: submitVisit,
    onSuccess: (data) => {
      setVisitResult(data);
      setStatus("success");
    },
  });

  const handlePatientSearch = useCallback(
    (query: string) => {
      if (
        selectedPatient &&
        query !== `${selectedPatient.health_id} - ${selectedPatient.name}`
      ) {
        setSelectedPatient(null);
        setValue("health_id", "", { shouldValidate: false });
      }

      setSearchQuery(query);

      if (patientDebounce.current) clearTimeout(patientDebounce.current);

      if (query.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      if (!patientType) return;

      patientDebounce.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await searchPatients(query, patientType);
          setSearchResults(results);
          setShowDropdown(results.length > 0);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [selectedPatient, setValue, patientType],
  );

  const selectPatient = (patient: PatientSearchResult) => {
    setValue("health_id", patient.health_id, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("patient_name", patient.name, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSearchQuery(`${patient.health_id} - ${patient.name}`);
    setSelectedPatient(patient);
    setShowDropdown(false);
  };

  const handlePatientTypeChange = (type: "MOTHER" | "CHILD") => {
    setValue("patient_type", type, { shouldValidate: true });
    setSelectedPatient(null);
    setSearchQuery("");
    setValue("health_id", "", { shouldValidate: false });
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleIcdSearch = useCallback((query: string) => {
    setIcdSearchQuery(query);

    if (icdDebounce.current) clearTimeout(icdDebounce.current);

    if (query.length < 2) {
      setIcdResults([]);
      setShowIcdDropdown(false);
      return;
    }

    icdDebounce.current = setTimeout(async () => {
      setIsSearchingIcd(true);
      try {
        const results = await searchICD10Codes(query);
        setIcdResults(results);
        setShowIcdDropdown(results.length > 0);
      } finally {
        setIsSearchingIcd(false);
      }
    }, 200);
  }, []);

  const addDiagnosis = (icd: ICD10Code) => {
    const isFirst = diagnosisFields.length === 0;
    appendDiagnosis({
      icd10_code: icd.code,
      icd10_name: icd.name,
      is_primary: isFirst,
      notes: "",
    });
    setIcdSearchQuery("");
    setIcdResults([]);
    setShowIcdDropdown(false);
  };

  const handleSetPrimary = (index: number) => {
    const currentDiagnoses = getValues("diagnoses");
    currentDiagnoses.forEach((_, i) => {
      updateDiagnosis(i, { ...currentDiagnoses[i], is_primary: i === index });
    });
  };

  const removeDiagnosisWithCheck = (index: number) => {
    const currentDiagnoses = getValues("diagnoses");
    const wasPrimary = currentDiagnoses[index]?.is_primary;

    removeDiagnosis(index);

    if (wasPrimary && currentDiagnoses.length > 1) {
      const remaining = getValues("diagnoses");
      if (remaining.length > 0 && !remaining.some((d) => d.is_primary)) {
        updateDiagnosis(0, { ...remaining[0], is_primary: true });
      }
    }
  };

  const addPrescription = () => {
    appendPrescription({
      medication_name: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
  };

  const nextStep = async () => {
    let valid = false;

    if (step === 1) {
      valid = await trigger(["patient_type", "health_id"]);
    } else if (step === 2) {
      valid = await trigger(["visit_type", "vitals"]);
    } else if (step === 3) {
      valid = await trigger(["diagnoses"]);
    }

    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: VisitFormData) => {
    mutation.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setStep(1);
    setStatus("form");
    setVisitResult(null);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPatient(null);
    setIcdSearchQuery("");
    setIcdResults([]);
  };

  if (status === "success" && visitResult) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-5 rounded-lg">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">
              Visit recorded successfully
            </p>
            <p className="text-sm text-emerald-700">
              The clinical visit has been saved to the patient&apos;s record
            </p>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-6 rounded-lg">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Visit summary
          </h2>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[
              { label: "Visit ID", value: visitResult.visit_id },
              {
                label: "Patient ID",
                value: visitResult.patient_health_id,
              },
              {
                label: "Visit type",
                value: VISIT_TYPE_LABELS[visitResult.visit_type],
              },
              {
                label: "Recorded at",
                value: new Date(
                  visitResult.recorded_at,
                ).toLocaleString("en-RW"),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Record another visit
          </button>
          <button
            onClick={() => router.push("/visits")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2C6F73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
          >
            View all visits
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Record visit</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a new clinical visit for a mother or child
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <div className="border border-gray-200 bg-white rounded-lg">
          {step === 1 && (
            <div className="p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">
                Select patient
              </h2>

              <input type="hidden" {...register("patient_type")} />
              <input type="hidden" {...register("health_id")} />

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Patient type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePatientTypeChange("MOTHER")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      patientType === "MOTHER"
                        ? "border-[#2C6F73] bg-[#2C6F73] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    Mother
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePatientTypeChange("CHILD")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      patientType === "CHILD"
                        ? "border-[#2C6F73] bg-[#2C6F73] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    Child
                  </button>
                </div>
                {errors.patient_type && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.patient_type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Search by health ID or name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={
                      patientType
                        ? `Search ${patientType === "MOTHER" ? "mother" : "child"} by health ID or name...`
                        : "Select patient type first"
                    }
                    value={searchQuery}
                    onChange={(e) => handlePatientSearch(e.target.value)}
                    onFocus={() =>
                      searchResults.length > 0 && setShowDropdown(true)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowDropdown(false), 200)
                    }
                    disabled={!patientType}
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2C6F73] border-t-transparent" />
                    </div>
                  )}

                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                      {searchResults.map((patient) => (
                        <button
                          key={patient.health_id}
                          type="button"
                          onMouseDown={() => selectPatient(patient)}
                          className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {patient.health_id} — {patient.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {patient.patient_type === "MOTHER" ? "Mother" : "Child"}
                            {patient.age ? ` · Age ${patient.age}` : ""}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedPatient && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2">
                    <Check className="h-4 w-4 text-[#2C6F73]" />
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedPatient.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({selectedPatient.health_id})
                    </span>
                  </div>
                )}

                {errors.health_id && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.health_id.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">
                Visit type & vitals
              </h2>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Visit type
                </label>
                <div className="relative">
                  <select
                    {...register("visit_type")}
                    defaultValue=""
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                  >
                    <option value="" disabled>
                      Select visit type
                    </option>
                    {(Object.entries(VISIT_TYPE_LABELS) as [string, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.visit_type && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.visit_type.message}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Vital signs
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {VITAL_FIELDS.map(({ key, label, min, max, step: stepVal }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-sm text-gray-700">
                        {label}
                      </label>
                      <input
                        {...register(`vitals.${key}` as const, {
                          setValueAs: (v: string) =>
                            v === "" ? undefined : Number(v),
                        })}
                        type="number"
                        step={stepVal}
                        min={min}
                        max={max}
                        placeholder={`${min}–${max}`}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                      />
                      {errors.vitals?.[key as keyof typeof errors.vitals] && (
                        <p className="mt-1 text-sm text-red-500">
                          {
                            (
                              errors.vitals as Record<
                                string,
                                { message?: string }
                              >
                            )[key]?.message
                          }
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">
                Diagnoses
              </h2>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Search ICD-10 code
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by code or name..."
                    value={icdSearchQuery}
                    onChange={(e) => handleIcdSearch(e.target.value)}
                    onFocus={() =>
                      icdResults.length > 0 && setShowIcdDropdown(true)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowIcdDropdown(false), 200)
                    }
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                  />
                  {isSearchingIcd && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2C6F73] border-t-transparent" />
                    </div>
                  )}

                  {showIcdDropdown && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md">
                      {icdResults.map((icd) => (
                        <button
                          key={icd.code}
                          type="button"
                          onMouseDown={() => addDiagnosis(icd)}
                          className="w-full px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                        >
                          <span className="text-sm font-semibold text-[#2C6F73]">
                            {icd.code}
                          </span>
                          <span className="ml-2 text-sm text-gray-700">
                            {icd.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {diagnosisFields.length > 0 && (
                <div className="space-y-3">
                  {diagnosisFields.map((field, index) => {
                    const currentDiagnoses = getValues("diagnoses");
                    const diagnosis = currentDiagnoses[index];
                    return (
                      <div
                        key={field.id}
                        className={cn(
                          "rounded-lg border p-4 transition-colors",
                          diagnosis?.is_primary
                            ? "border-[#2C6F73] bg-[#F0F9F9]"
                            : "border-gray-200 bg-white",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(index)}
                              className={cn(
                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                diagnosis?.is_primary
                                  ? "border-[#2C6F73] bg-[#2C6F73]"
                                  : "border-gray-300 hover:border-gray-400",
                              )}
                              title={
                                diagnosis?.is_primary
                                  ? "Primary diagnosis"
                                  : "Mark as primary"
                              }
                            >
                              {diagnosis?.is_primary && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                <span className="text-[#2C6F73]">
                                  {diagnosis?.icd10_code}
                                </span>
                                {" — "}
                                {diagnosis?.icd10_name}
                              </p>
                              {diagnosis?.is_primary && (
                                <span className="mt-0.5 inline-block rounded bg-[#2C6F73]/10 px-2 py-0.5 text-[11px] font-semibold text-[#2C6F73]">
                                  PRIMARY
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDiagnosisWithCheck(index)}
                            className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Remove diagnosis"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3">
                          <textarea
                            {...register(`diagnoses.${index}.notes`)}
                            rows={2}
                            placeholder="Add clinical notes (optional)"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20 resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.diagnoses && (
                <p className="text-sm text-red-500">
                  {errors.diagnoses.message ??
                    errors.diagnoses.root?.message}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Prescriptions
                </h2>
                <button
                  type="button"
                  onClick={addPrescription}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#2C6F73] px-3 py-1.5 text-sm font-medium text-[#2C6F73] transition-colors hover:bg-[#F0F9F9]"
                >
                  <Plus className="h-4 w-4" />
                  Add prescription
                </button>
              </div>

              {prescriptionFields.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-400">
                    No prescriptions added yet. Click &quot;Add prescription&quot; to
                    prescribe medication.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptionFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Prescription #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePrescription(index)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Remove prescription"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs text-gray-500">
                            Medication name
                          </label>
                          <input
                            {...register(`prescriptions.${index}.medication_name`)}
                            type="text"
                            placeholder="e.g. Amoxicillin"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                          />
                          {errors.prescriptions?.[index]?.medication_name && (
                            <p className="mt-1 text-xs text-red-500">
                              {
                                errors.prescriptions[index]?.medication_name
                                  ?.message
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-gray-500">
                            Dosage
                          </label>
                          <input
                            {...register(`prescriptions.${index}.dosage`)}
                            type="text"
                            placeholder="e.g. 500mg"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                          />
                          {errors.prescriptions?.[index]?.dosage && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.prescriptions[index]?.dosage?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-gray-500">
                            Frequency
                          </label>
                          <input
                            {...register(`prescriptions.${index}.frequency`)}
                            type="text"
                            placeholder="e.g. 3 times daily"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                          />
                          {errors.prescriptions?.[index]?.frequency && (
                            <p className="mt-1 text-xs text-red-500">
                              {
                                errors.prescriptions[index]?.frequency
                                  ?.message
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-gray-500">
                            Duration
                          </label>
                          <input
                            {...register(`prescriptions.${index}.duration`)}
                            type="text"
                            placeholder="e.g. 7 days"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                          />
                          {errors.prescriptions?.[index]?.duration && (
                            <p className="mt-1 text-xs text-red-500">
                              {
                                errors.prescriptions[index]?.duration
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {mutation.isError && (
          <p className="text-center text-sm text-red-500">
            Failed to record visit. Please try again.
          </p>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2C6F73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2C6F73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Recording...
                </>
              ) : (
                "Record visit"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
