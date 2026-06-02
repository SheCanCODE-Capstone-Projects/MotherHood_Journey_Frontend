"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProvinces, getDistricts, getSectors, getCells, getVillages } from "@/lib/api/geo";
import { queryKeys } from "@/shared/config/query-keys";

interface GeoLocationSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  levels?: number; // 1=province only, 2=province+district, 3=+sector, 4=+cell, 5=+village
  showLabels?: boolean;
}

interface LocationSelection {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export function GeoLocationSelect({
  value,
  onChange,
  error,
  disabled = false,
  levels = 5,
  showLabels = true,
}: GeoLocationSelectProps) {
  const [selection, setSelection] = useState<LocationSelection>({
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  });

  // Parse initial value if provided (format: "Province > District > Sector > Cell > Village")
  useEffect(() => {
    if (value) {
      const parts = value.split(" > ").map(p => p.trim());
      setSelection(prev => ({
        province: parts[0] || "",
        district: parts[1] || "",
        sector: parts[2] || "",
        cell: parts[3] || "",
        village: parts[4] || "",
      }));
    }
  }, [value]);

  // Build display string from selection
  const buildLocationString = useCallback((sel: LocationSelection): string => {
    const parts = [sel.province, sel.district, sel.sector, sel.cell, sel.village].filter(Boolean);
    return parts.join(" > ");
  }, []);

  // Notify parent of changes
  const updateSelection = useCallback((updates: Partial<LocationSelection>) => {
    const newSelection = { ...selection, ...updates };
    setSelection(newSelection);
    onChange(buildLocationString(newSelection));
  }, [selection, buildLocationString, onChange]);

  // Fetch provinces
  const { data: provinces, isLoading: loadingProvinces } = useQuery({
    queryKey: queryKeys.geo.provinces,
    queryFn: getProvinces,
  });

  // Fetch districts when province is selected
  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: [...queryKeys.geo.districts, selection.province],
    queryFn: () => getDistricts(selection.province),
    enabled: !!selection.province && levels >= 2,
  });

  // Fetch sectors when district is selected
  const { data: sectors, isLoading: loadingSectors } = useQuery({
    queryKey: [...queryKeys.geo.sectors, selection.province, selection.district],
    queryFn: () => getSectors(selection.district, { province: selection.province }),
    enabled: !!selection.district && levels >= 3,
  });

  // Fetch cells when sector is selected
  const { data: cells, isLoading: loadingCells } = useQuery({
    queryKey: [...queryKeys.geo.cells, selection.province, selection.district, selection.sector],
    queryFn: () => getCells(selection.sector, { 
      province: selection.province, 
      district: selection.district 
    }),
    enabled: !!selection.sector && levels >= 4,
  });

  // Fetch villages when cell is selected
  const { data: villages, isLoading: loadingVillages } = useQuery({
    queryKey: [...queryKeys.geo.villages, selection.province, selection.district, selection.sector, selection.cell],
    queryFn: () => getVillages(selection.cell, {
      province: selection.province,
      district: selection.district,
      sector: selection.sector,
    }),
    enabled: !!selection.cell && levels >= 5,
  });

  const isLoading = loadingProvinces || loadingDistricts || loadingSectors || loadingCells || loadingVillages;

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    updateSelection({
      province,
      district: "",
      sector: "",
      cell: "",
      village: "",
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    updateSelection({
      district,
      sector: "",
      cell: "",
      village: "",
    });
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sector = e.target.value;
    updateSelection({
      sector,
      cell: "",
      village: "",
    });
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cell = e.target.value;
    updateSelection({
      cell,
      village: "",
    });
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const village = e.target.value;
    updateSelection({ village });
  };

  const inputClass = (fieldError?: string) =>
    `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
      fieldError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`;

  return (
    <div className="space-y-4">
      {showLabels && (
        <label className="text-sm font-medium text-gray-700">
          Home Location
        </label>
      )}

      {/* Province - Always shown */}
      <div>
        {showLabels && <label className="text-xs text-gray-600">Province</label>}
        <select
          value={selection.province}
          onChange={handleProvinceChange}
          disabled={disabled || isLoading}
          className={inputClass(error)}
        >
          <option value="">Select province...</option>
          {provinces?.map((province: string) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* District - Level 2 */}
      {levels >= 2 && selection.province && (
        <div>
          {showLabels && <label className="text-xs text-gray-600">District</label>}
          <select
            value={selection.district}
            onChange={handleDistrictChange}
            disabled={disabled || loadingDistricts}
            className={inputClass(error)}
          >
            <option value="">Select district...</option>
            {districts?.map((district: string) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {loadingDistricts && <p className="text-xs text-gray-500 mt-1">Loading districts...</p>}
        </div>
      )}

      {/* Sector - Level 3 */}
      {levels >= 3 && selection.district && (
        <div>
          {showLabels && <label className="text-xs text-gray-600">Sector</label>}
          <select
            value={selection.sector}
            onChange={handleSectorChange}
            disabled={disabled || loadingSectors}
            className={inputClass(error)}
          >
            <option value="">Select sector...</option>
            {sectors?.map((sector: string) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          {loadingSectors && <p className="text-xs text-gray-500 mt-1">Loading sectors...</p>}
        </div>
      )}

      {/* Cell - Level 4 */}
      {levels >= 4 && selection.sector && (
        <div>
          {showLabels && <label className="text-xs text-gray-600">Cell</label>}
          <select
            value={selection.cell}
            onChange={handleCellChange}
            disabled={disabled || loadingCells}
            className={inputClass(error)}
          >
            <option value="">Select cell...</option>
            {cells?.map((cell: string) => (
              <option key={cell} value={cell}>
                {cell}
              </option>
            ))}
          </select>
          {loadingCells && <p className="text-xs text-gray-500 mt-1">Loading cells...</p>}
        </div>
      )}

      {/* Village - Level 5 */}
      {levels >= 5 && selection.cell && (
        <div>
          {showLabels && <label className="text-xs text-gray-600">Village</label>}
          <select
            value={selection.village}
            onChange={handleVillageChange}
            disabled={disabled || loadingVillages}
            className={inputClass(error)}
          >
            <option value="">Select village...</option>
            {villages?.map((village: string) => (
              <option key={village} value={village}>
                {village}
              </option>
            ))}
          </select>
          {loadingVillages && <p className="text-xs text-gray-500 mt-1">Loading villages...</p>}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      
      {/* Display current selection */}
      {value && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Selected:</strong> {value}
        </div>
      )}
    </div>
  );
}