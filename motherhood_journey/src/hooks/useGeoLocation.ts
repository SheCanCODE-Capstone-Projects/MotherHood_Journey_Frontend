import { useQuery } from '@tanstack/react-query';
import { geoApi } from '@/lib/api/geo';

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => geoApi.getProvinces(),
  });
};

export const useDistricts = (provinceId: string) => {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () => geoApi.getDistricts(provinceId),
    enabled: !!provinceId,
  });
};

export const useSectors = (districtId: string) => {
  return useQuery({
    queryKey: ['sectors', districtId],
    queryFn: () => geoApi.getSectors(districtId),
    enabled: !!districtId,
  });
};

export const useCells = (sectorId: string) => {
  return useQuery({
    queryKey: ['cells', sectorId],
    queryFn: () => geoApi.getCells(sectorId),
    enabled: !!sectorId,
  });
};

export const useVillages = (cellId: string) => {
  return useQuery({
    queryKey: ['villages', cellId],
    queryFn: () => geoApi.getVillages(cellId),
    enabled: !!cellId,
  });
};
