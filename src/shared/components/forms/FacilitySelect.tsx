"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicFacilities } from "@/lib/api/facilities";
import { queryKeys } from "@/shared/config/query-keys";

interface FacilitySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  province?: string;
  district?: string;
  sector?: string;
  showLabels?: boolean;
}

export function FacilitySelect({
  value,
  onChange,
  error,
  disabled = false,
  province,
  district,
  sector,
  showLabels = true,
}: FacilitySelectProps) {
  const { data: facilities, isLoading } = useQuery({
    queryKey: [...queryKeys.geo.facilities, province, district, sector],
    queryFn: () => getPublicFacilities(province, district, sector),
    enabled: !disabled,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const inputClass = (fieldError?: string) =>
    `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
      fieldError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`;

  return (
    <div className="space-y-2">
      {showLabels && (
        <label className="text-sm font-medium text-gray-700">
          Health Facility
        </label>
      )}
      <select
        value={value || ""}
        onChange={handleChange}
        disabled={disabled || isLoading}
        className={inputClass(error)}
      >
        <option value="">Select health facility...</option>
        {isLoading ? (
          <option disabled>Loading facilities...</option>
        ) : (
          facilities?.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name} ({facility.type}) - {facility.sector}
            </option>
          ))
        )}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {value && facilities && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Selected:</strong>{" "}
          {facilities.find((f) => f.id === value)?.name || value}
        </div>
      )}
    </div>
  );
}