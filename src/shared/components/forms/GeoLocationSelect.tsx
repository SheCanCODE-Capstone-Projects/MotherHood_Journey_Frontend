"use client";

import React from "react";

/**
 * GeoLocationSelect Component
 * 
 * Displays a simple location select dropdown.
 * In a real app, this would fetch data from your geo API.
 * 
 * Props:
 * - value: Current selected location
 * - onChange: Callback when selection changes
 * - error: Error message to display
 * - disabled: Whether the input is disabled
 */

interface GeoLocationSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Sample Rwanda locations - replace with API call in production
const RWANDA_LOCATIONS = [
  { id: "kigali", label: "Kigali" },
  { id: "eastern", label: "Eastern Province" },
  { id: "northern", label: "Northern Province" },
  { id: "southern", label: "Southern Province" },
  { id: "western", label: "Western Province" },
];

export function GeoLocationSelect({
  value,
  onChange,
  error,
  disabled = false,
}: GeoLocationSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Home Location
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      >
        <option value="">Select a location...</option>
        {RWANDA_LOCATIONS.map((location) => (
          <option key={location.id} value={location.id}>
            {location.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
