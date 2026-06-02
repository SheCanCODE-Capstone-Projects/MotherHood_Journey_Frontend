"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  motherRegistrationSchema,
} from "../schemas";
import { MotherRegistrationStep1 } from "./Step1";
import { MotherRegistrationStep2 } from "./Step2";
import { MotherRegistrationStep3 } from "./Step3";
import { MotherRegistrationSuccess } from "./Success";
import { useMother } from "../hooks/useMother";
import type { MotherRegistrationData } from "../schemas";
import { AlertCircle, ChevronLeft, ChevronRight, Check } from "lucide-react";

const STEPS = [
  { number: 1, label: "Identity" },
  { number: 2, label: "Location" },
  { number: 3, label: "Review" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Registration progress" className="mb-8">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const done = step.number < current;
          const active = step.number === current;
          return (
            <React.Fragment key={step.number}>
              <li className="flex flex-col items-center gap-1.5 min-w-[72px]">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                    done
                      ? "border-teal-600 bg-teal-600 text-white"
                      : active
                      ? "border-teal-600 bg-white text-teal-700 shadow-sm shadow-teal-200"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${
                    active ? "text-teal-700" : done ? "text-teal-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </li>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mb-5 h-0.5 flex-1 transition-all ${
                    done ? "bg-teal-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export function MotherRegistrationForm() {
  const { data: session } = useSession();
  const facilityId = session?.user?.facilityId ? String(session.user.facilityId) : "";

  const [currentStep, setCurrentStep] = useState(1);
  const [submittedHealthId, setSubmittedHealthId] = useState<string | null>(null);
  const [submittedMotherId, setSubmittedMotherId] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<{ first: string; last: string } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { mutate: submitRegistration, isPending } = useMother();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm<MotherRegistrationData>({
    resolver: zodResolver(motherRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      national_id: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      phone_number: "",
      home_location: "",
      education_level: "",
    },
  });

  const handleNext = async () => {
    setGeneralError(null);
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["national_id", "first_name", "last_name", "date_of_birth", "phone_number"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["home_location", "education_level"]);
    }
    if (isValid) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setGeneralError(null);
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const onSubmit = (data: MotherRegistrationData) => {
    setGeneralError(null);
    submitRegistration(
      {
        national_id: data.national_id,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        phone_number: data.phone_number,
        home_location: data.home_location,
        education_level: data.education_level,
        facility_id: facilityId || undefined,
      },
      {
        onSuccess: (response) => {
          setSubmittedHealthId(response.healthId);
          setSubmittedMotherId(response.id);
          setSubmittedName({ first: data.first_name, last: data.last_name });
        },
        onError: (error) => {
          setGeneralError(error.message || "Registration failed. Please try again.");
        },
      },
    );
  };

  const handleNewRegistration = () => {
    setCurrentStep(1);
    setSubmittedHealthId(null);
    setSubmittedMotherId(null);
    setSubmittedName(null);
    setGeneralError(null);
    reset();
  };

  if (submittedHealthId && submittedName) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <MotherRegistrationSuccess
          healthId={submittedHealthId}
          motherId={submittedMotherId ?? ""}
          firstName={submittedName.first}
          lastName={submittedName.last}
          onNewRegistration={handleNewRegistration}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator current={currentStep} />

      {generalError && (
        <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Registration Error</p>
            <p className="mt-0.5 text-sm">{generalError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <MotherRegistrationStep1 register={register} errors={errors} isLoading={isPending} />
        )}
        {currentStep === 2 && (
          <MotherRegistrationStep2 register={register} errors={errors} control={control} isLoading={isPending} />
        )}
        {currentStep === 3 && (
          <MotherRegistrationStep3 formData={getValues()} isLoading={isPending} />
        )}

        <div className="flex items-center justify-between border-t pt-5">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isPending}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Registering…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Register Mother
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
