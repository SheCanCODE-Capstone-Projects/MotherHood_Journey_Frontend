"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  motherRegistrationSchema,
  motherRegistrationStepOneSchema,
  motherRegistrationStepTwoSchema,
} from "../schemas";
import { MotherRegistrationStep1 } from "./Step1";
import { MotherRegistrationStep2 } from "./Step2";
import { MotherRegistrationStep3 } from "./Step3";
import { MotherRegistrationSuccess } from "./Success";
import { useMother } from "../hooks/useMother";
import type { MotherRegistrationData } from "../schemas";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Main Multi-Step Form Component
 * 
 * Manages:
 * - Step navigation (1, 2, 3)
 * - Form validation using Zod
 * - State management for multi-step form
 * - API submission
 * - Success state with health ID display
 * 
 * Features:
 * - Back/Next navigation
 * - Validation at each step
 * - Final review before submission
 * - Health ID generation and display
 * - Print functionality
 */

export function MotherRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedHealthId, setSubmittedHealthId] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<{
    first: string;
    last: string;
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { mutate: submitRegistration, isPending } = useMother();

  // Initialize form with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
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

  /**
   * Validate current step and move to next
   */
  const handleNext = async () => {
    setGeneralError(null);

    let isValid = false;

    if (currentStep === 1) {
      // Validate step 1 fields
      isValid = await trigger([
        "national_id",
        "first_name",
        "last_name",
        "date_of_birth",
        "phone_number",
      ]);
    } else if (currentStep === 2) {
      // Validate step 2 fields
      isValid = await trigger(["home_location", "education_level"]);
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Go back to previous step
   */
  const handleBack = () => {
    setGeneralError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Submit the form and call the API
   */
  const onSubmit = async (data: MotherRegistrationData) => {
    setGeneralError(null);

    try {
      // Call the API to register mother
      submitRegistration(
        {
          national_id: data.national_id,
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          phone_number: data.phone_number,
          home_location: data.home_location,
          education_level: data.education_level,
        },
        {
          onSuccess: (response: any) => {
            // Store health ID and name for success screen
            setSubmittedHealthId(response.data.health_id);
            setSubmittedName({
              first: data.first_name,
              last: data.last_name,
            });
          },
          onError: (error: any) => {
            setGeneralError(
              error.message || "An error occurred during registration. Please try again."
            );
          },
        }
      );
    } catch (error: any) {
      setGeneralError(
        error.message || "An error occurred during registration. Please try again."
      );
    }
  };

  /**
   * Reset form for new registration
   */
  const handleNewRegistration = () => {
    setCurrentStep(1);
    setSubmittedHealthId(null);
    setSubmittedName(null);
    setGeneralError(null);
  };

  // Show success screen if registration was successful
  if (submittedHealthId && submittedName) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <MotherRegistrationSuccess
          healthId={submittedHealthId}
          firstName={submittedName.first}
          lastName={submittedName.last}
          onNewRegistration={handleNewRegistration}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header with Step Indicator */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mother Registration
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Step {currentStep} of 3</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step === currentStep
                    ? "bg-blue-600"
                    : step < currentStep
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* General Error Message */}
      {generalError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-red-900">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Registration Error</p>
            <p className="text-sm">{generalError}</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <MotherRegistrationStep1
            register={register}
            errors={errors}
            isLoading={isPending}
          />
        )}

        {/* Step 2: Location and Education */}
        {currentStep === 2 && (
          <MotherRegistrationStep2
            register={register}
            errors={errors}
            control={control}
            isLoading={isPending}
          />
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <MotherRegistrationStep3
            formData={getValues()}
            isLoading={isPending}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between pt-6 border-t">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 font-medium rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Next / Submit Button */}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
