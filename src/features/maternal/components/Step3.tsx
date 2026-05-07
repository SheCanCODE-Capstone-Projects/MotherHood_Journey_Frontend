"use client";

import React from "react";
import type { MotherRegistrationData } from "../schemas";

/**
 * Step 3 Component - Confirmation Summary
 * 
 * Displays all the information collected from Step 1 and Step 2
 * Allows user to review before final submission
 * 
 * Props:
 * - formData: All collected form data
 * - isLoading: Whether form is being submitted
 */

interface Step3Props {
  formData: MotherRegistrationData;
  isLoading?: boolean;
}

// Map education level values to display labels
const EDUCATION_LEVEL_LABELS: Record<string, string> = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
  none: "None",
};

// Map location IDs to display labels
const LOCATION_LABELS: Record<string, string> = {
  kigali: "Kigali",
  eastern: "Eastern Province",
  northern: "Northern Province",
  southern: "Southern Province",
  western: "Western Province",
};

export function MotherRegistrationStep3({
  formData,
  isLoading = false,
}: Step3Props) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Confirm Information
      </h2>

      <p className="text-sm text-gray-600">
        Please review the information below before submitting. Once submitted,
        you will receive a health ID that will be used for all future visits.
      </p>

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {/* Section 1: Personal Information */}
        <div className="border-b pb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Personal Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">National ID:</span>
              <span className="font-medium text-gray-900">
                {formData.national_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">First Name:</span>
              <span className="font-medium text-gray-900">
                {formData.first_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Name:</span>
              <span className="font-medium text-gray-900">
                {formData.last_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium text-gray-900">
                {formatDate(formData.date_of_birth)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-medium text-gray-900">
                {formData.phone_number}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Location and Education */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Location and Education
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Home Location:</span>
              <span className="font-medium text-gray-900">
                {LOCATION_LABELS[formData.home_location] ||
                  formData.home_location}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Education Level:</span>
              <span className="font-medium text-gray-900">
                {EDUCATION_LEVEL_LABELS[formData.education_level] ||
                  formData.education_level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900">
        ℹ️ By clicking "Submit", you agree to register for the maternal health
        tracking system. You will receive a unique Health ID after registration.
      </div>
    </div>
  );
}
