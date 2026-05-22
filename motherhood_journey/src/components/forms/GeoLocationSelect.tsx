"use client";

import { useState, useEffect } from 'react';
import { useProvinces, useDistricts, useSectors, useCells, useVillages } from '../../hooks/useGeoLocation';

// Minimal local DTO used by this component (keeps nested app independent)
export interface GeoLocationSummaryDTO {
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  sectorId?: string;
  sectorName?: string;
  cellId?: string;
  cellName?: string;
  villageId?: string;
  villageName?: string;
}

interface GeoLocationSelectProps {
  value?: GeoLocationSummaryDTO;
  onChange?: (location: GeoLocationSummaryDTO) => void;
  required?: boolean;
  disabled?: boolean;
  maxLevel?: 'province' | 'district' | 'sector' | 'cell' | 'village';
  provinceId?: string;
  districtId?: string;
  sectorId?: string;
  cellId?: string;
  onProvinceChange?: (id: string) => void;
  onDistrictChange?: (id: string) => void;
  onSectorChange?: (id: string) => void;
  onCellChange?: (id: string) => void;
  onVillageChange?: (id: string) => void;
}

export function GeoLocationSelect({ 
  value, 
  onChange, 
  required = false,
  disabled = false,
  maxLevel = 'village',
  provinceId: controlledProvinceId,
  districtId: controlledDistrictId,
  sectorId: controlledSectorId,
  cellId: controlledCellId,
  onProvinceChange,
  onDistrictChange,
  onSectorChange,
  onCellChange,
  onVillageChange,
}: GeoLocationSelectProps) {
  const isControlled = controlledProvinceId !== undefined;
  
  const [selectedProvince, setSelectedProvince] = useState<string>(value?.provinceId || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(value?.districtId || '');
  const [selectedSector, setSelectedSector] = useState<string>(value?.sectorId || '');
  const [selectedCell, setSelectedCell] = useState<string>(value?.cellId || '');
  const [selectedVillage, setSelectedVillage] = useState<string>(value?.villageId || '');
  
  const provinceId = isControlled ? controlledProvinceId : selectedProvince;
  const districtId = isControlled ? (controlledDistrictId || '') : selectedDistrict;
  const sectorId = isControlled ? (controlledSectorId || '') : selectedSector;
  const cellId = isControlled ? (controlledCellId || '') : selectedCell;

  const { data: provinces, isLoading: loadingProvinces } = useProvinces();
  const { data: districts, isLoading: loadingDistricts } = useDistricts(provinceId);
  const { data: sectors, isLoading: loadingSectors } = useSectors(districtId);
  const { data: cells, isLoading: loadingCells } = useCells(sectorId);
  const { data: villages, isLoading: loadingVillages } = useVillages(cellId);

  useEffect(() => {
    if (!onChange || isControlled) return;
    
    const province = provinces?.find(p => p.id === selectedProvince);
    const district = districts?.find(d => d.id === selectedDistrict);
    const sector = sectors?.find(s => s.id === selectedSector);
    const cell = cells?.find(c => c.id === selectedCell);
    const village = villages?.find(v => v.id === selectedVillage);

    const locationData: GeoLocationSummaryDTO = {
      provinceId: selectedProvince || undefined,
      provinceName: province?.name || undefined,
      districtId: selectedDistrict || undefined,
      districtName: district?.name || undefined,
      sectorId: selectedSector || undefined,
      sectorName: sector?.name || undefined,
      cellId: selectedCell || undefined,
      cellName: cell?.name || undefined,
      villageId: selectedVillage || undefined,
      villageName: village?.name || undefined,
    };

    onChange(locationData);
  }, [selectedProvince, selectedDistrict, selectedSector, selectedCell, selectedVillage, provinces, districts, sectors, cells, villages, onChange, isControlled]);

  const handleProvinceChange = (id: string) => {
    if (isControlled) {
      onProvinceChange?.(id);
    } else {
      setSelectedProvince(id);
      setSelectedDistrict('');
      setSelectedSector('');
      setSelectedCell('');
      setSelectedVillage('');
    }
  };

  const handleDistrictChange = (id: string) => {
    if (isControlled) {
      onDistrictChange?.(id);
    } else {
      setSelectedDistrict(id);
      setSelectedSector('');
      setSelectedCell('');
      setSelectedVillage('');
    }
  };

  const handleSectorChange = (id: string) => {
    if (isControlled) {
      onSectorChange?.(id);
    } else {
      setSelectedSector(id);
      setSelectedCell('');
      setSelectedVillage('');
    }
  };

  const handleCellChange = (id: string) => {
    if (isControlled) {
      onCellChange?.(id);
    } else {
      setSelectedCell(id);
      setSelectedVillage('');
    }
  };
  
  const handleVillageChange = (id: string) => {
    if (isControlled) {
      onVillageChange?.(id);
    } else {
      setSelectedVillage(id);
    }
  };

  const shouldShowLevel = (level: string) => {
    const levels = ['province', 'district', 'sector', 'cell', 'village'];
    const maxIndex = levels.indexOf(maxLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex <= maxIndex;
  };

  return (
    <div className="space-y-4">
      {shouldShowLevel('province') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Province {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={provinceId}
          onChange={(e) => handleProvinceChange(e.target.value)}
          disabled={disabled || loadingProvinces}
          required={required}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Province</option>
          {provinces?.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>}

      {shouldShowLevel('district') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          District {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={districtId}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={disabled || !provinceId || loadingDistricts}
          required={required}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select District</option>
          {districts?.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>}

      {shouldShowLevel('sector') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sector {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={sectorId}
          onChange={(e) => handleSectorChange(e.target.value)}
          disabled={disabled || !districtId || loadingSectors}
          required={required}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Sector</option>
          {sectors?.map((sector) => (
            <option key={sector.id} value={sector.id}>
              {sector.name}
            </option>
          ))}
        </select>
      </div>}

      {shouldShowLevel('cell') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cell {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={cellId}
          onChange={(e) => handleCellChange(e.target.value)}
          disabled={disabled || !sectorId || loadingCells}
          required={required}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Cell</option>
          {cells?.map((cell) => (
            <option key={cell.id} value={cell.id}>
              {cell.name}
            </option>
          ))}
        </select>
      </div>}

      {shouldShowLevel('village') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Village {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedVillage}
          onChange={(e) => handleVillageChange(e.target.value)}
          disabled={disabled || !cellId || loadingVillages}
          required={required}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Village</option>
          {villages?.map((village) => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
        </select>
      </div>}
    </div>
  );
}
