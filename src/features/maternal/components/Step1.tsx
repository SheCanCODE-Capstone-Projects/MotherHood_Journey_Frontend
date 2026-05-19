"use client";

import React from "react";
import { UseFormRegister, FieldErrors, Controller } from "react-hook-form";
import type { MotherRegistrationData } from "../schemas";

/**
 * Step 1 Component - Personal Information
 * 
 * Collects:
 * - National ID (Rwanda format: 16 digits)
 * - First Name
 * - Last Name
 * - Date of Birth
 * - Phone Number
 * 
 * Props:
 * - register: React Hook Form register function
 * - errors: Form validation errors
 * - isLoading: Whether form is being submitted
 */

interface Step1Props {
  register: UseFormRegister<MotherRegistrationData>;
  errors: FieldErrors<MotherRegistrationData>;
  isLoading?: boolean;
}

export function MotherRegistrationStep1({
  register,
  errors,
  isLoading = false,
}: Step1Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h2>

      {/* National ID */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          National ID (16 digits)
        </label>
        <input
          type="text"
          placeholder="1234567890123456"
          disabled={isLoading}
          {...register("national_id")}
          className={`w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            errors.national_id
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
        {errors.national_id && (
          <p className="mt-1 text-xs text-red-500">
            {errors.national_id.message}
          </p>
        )}
      </div>

      {/* First Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          placeholder="e.g., Marie"
          disabled={isLoading}
          {...register("first_name")}
          className={`w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            errors.first_name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
        {errors.first_name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.first_name.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          placeholder="e.g., Uwamahoro"
          disabled={isLoading}
          {...register("last_name")}
          className={`w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            errors.last_name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
        {errors.last_name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.last_name.message}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          disabled={isLoading}
          {...register("date_of_birth")}
          className={`w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            errors.date_of_birth
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
        {errors.date_of_birth && (
          <p className="mt-1 text-xs text-red-500">
            {errors.date_of_birth.message}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="+250 7XX XXX XXX or 07XX XXX XXX"
          disabled={isLoading}
          {...register("phone_number")}
          className={`w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            errors.phone_number
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
        {errors.phone_number && (
          <p className="mt-1 text-xs text-red-500">
            {errors.phone_number.message}
          </p>
        )}
      </div>
    </div>
  );
}
