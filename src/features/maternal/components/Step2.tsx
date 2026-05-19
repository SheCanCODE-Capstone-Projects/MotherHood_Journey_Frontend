"use client";

import React from "react";
import { UseFormRegister, FieldErrors, Controller, Control } from "react-hook-form";
import { GeoLocationSelect } from "@/shared/components/forms/GeoLocationSelect";
import type { MotherRegistrationData } from "../schemas";

/**
 * Step 2 Component - Location and Education
 * 
 * Collects:
 * - Home Location (using GeoLocationSelect component)
 * - Education Level dropdown
 * 
 * Props:
 * - register: React Hook Form register function
 * - errors: Form validation errors
 * - control: React Hook Form control object
 * - isLoading: Whether form is being submitted
 */

interface Step2Props {
  register: UseFormRegister<MotherRegistrationData>;
  errors: FieldErrors<MotherRegistrationData>;
  control: Control<MotherRegistrationData>;
  isLoading?: boolean;
}

const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "tertiary", label: "Tertiary" },
  { value: "none", label: "None" },
];

export function MotherRegistrationStep2({
  register,
  errors,
  control,
  isLoading = false,
}: Step2Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Location and Education
      </h2>

      {/* Home Location */}
      <Controller
        name="home_location"
        control={control}
        render={({ field }) => (
          <GeoLocationSelect
            value={field.value}
            onChange={field.onChange}
            error={errors.home_location?.message}
            disabled={isLoading}
          />
        )}
      />

      {/* Education Level */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Education Level
        </label>
        <select
          disabled={isLoading}
          {...register("education_level")}
          className={`w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            errors.education_level
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        >
          <option value="">Select education level...</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {errors.education_level && (
          <p className="mt-1 text-xs text-red-500">
            {errors.education_level.message}
          </p>
        )}
      </div>
    </div>
  );
}
