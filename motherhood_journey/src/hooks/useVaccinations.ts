import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type VaccinationStatus = 'PENDING' | 'ADMINISTERED' | 'MISSED' | 'OVERDUE';

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  antigenCode: string;
  dueDate: string;
  windowStart: string;
  windowEnd: string;
  status: VaccinationStatus;
  administeredDate?: string;
  lotNumber?: string;
  administeredBy?: string;
  facilityName?: string;
}

export interface MarkAdministeredRequest {
  vaccinationId: string;
  administeredDate: string;
  lotNumber: string;
  facilityName: string;
}

// Mock data
const MOCK_VACCINATIONS: Record<string, VaccinationRecord[]> = {
  '1': [
    {
      id: 'v1',
      vaccineName: 'BCG',
      antigenCode: 'BCG-001',
      dueDate: '2024-01-15',
      windowStart: '2024-01-15',
      windowEnd: '2024-02-15',
      status: 'ADMINISTERED',
      administeredDate: '2024-01-16',
      lotNumber: 'LOT-BCG-2024-001',
      administeredBy: 'Nurse Jane',
      facilityName: 'Kigali Health Center',
    },
    {
      id: 'v2',
      vaccineName: 'OPV 0',
      antigenCode: 'OPV-000',
      dueDate: '2024-01-15',
      windowStart: '2024-01-15',
      windowEnd: '2024-02-15',
      status: 'ADMINISTERED',
      administeredDate: '2024-01-16',
      lotNumber: 'LOT-OPV-2024-001',
      administeredBy: 'Nurse Jane',
      facilityName: 'Kigali Health Center',
    },
    {
      id: 'v3',
      vaccineName: 'Pentavalent 1',
      antigenCode: 'PENTA-001',
      dueDate: '2024-02-26',
      windowStart: '2024-02-26',
      windowEnd: '2024-03-26',
      status: 'OVERDUE',
    },
    {
      id: 'v4',
      vaccineName: 'OPV 1',
      antigenCode: 'OPV-001',
      dueDate: '2024-02-26',
      windowStart: '2024-02-26',
      windowEnd: '2024-03-26',
      status: 'OVERDUE',
    },
    {
      id: 'v5',
      vaccineName: 'PCV 1',
      antigenCode: 'PCV-001',
      dueDate: '2024-02-26',
      windowStart: '2024-02-26',
      windowEnd: '2024-03-26',
      status: 'PENDING',
    },
  ],
};

const USE_MOCK_DATA = true;

export const useChildVaccinations = (childId: string) => {
  return useQuery({
    queryKey: ['vaccinations', childId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_VACCINATIONS[childId] || [];
      }
      // Real API call would go here
      const response = await fetch(`/api/v1/children/${childId}/vaccinations`);
      return response.json();
    },
    enabled: !!childId,
  });
};

export const useMarkAdministered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MarkAdministeredRequest) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
      // Real API call would go here
      const response = await fetch(`/api/v1/vaccinations/${request.vaccinationId}/administer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations'] });
    },
  });
};
