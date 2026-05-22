import { useQuery } from '@tanstack/react-query';

// When running with `USE_MOCK_DATA = true` we don't need the real apiClient.
// Declare a loose `apiClient` to keep TS happy for the unused branch.
declare const apiClient: any;

interface Pregnancy {
  id: string;
  edd: string;
  trimester: number;
  weekNumber: number;
  assignedCHW: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  motherName?: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  vaccinationStatus: 'UP_TO_DATE' | 'PENDING' | 'OVERDUE';
}

interface NextAppointment {
  id: string;
  date: string;
  time: string;
  facilityName: string;
  appointmentType: string;
  doctorName: string;
}

// Mock data for testing without backend
const MOCK_PREGNANCY: Pregnancy = {
  id: '1',
  edd: '2024-06-15',
  trimester: 3,
  weekNumber: 34,
  assignedCHW: {
    id: 'chw1',
    name: 'Jane Mukamana',
    phone: '+250 788 123 456',
    email: 'jane.mukamana@health.rw',
  },
  motherName: 'Divine',
};

const MOCK_CHILDREN: Child[] = [
  {
    id: '1',
    firstName: 'Grace',
    lastName: 'Divine',
    dateOfBirth: '2023-09-15',
    vaccinationStatus: 'UP_TO_DATE',
  },
  {
    id: '2',
    firstName: 'Emmanuel',
    lastName: 'Divine',
    dateOfBirth: '2021-03-20',
    vaccinationStatus: 'PENDING',
  },
  {
    id: '3',
    firstName: 'Hope',
    lastName: 'Divine',
    dateOfBirth: '2019-07-10',
    vaccinationStatus: 'OVERDUE',
  },
];

const MOCK_APPOINTMENT: NextAppointment = {
  id: '1',
  date: '2024-02-15',
  time: '10:00 AM',
  facilityName: 'Kigali Health Center',
  appointmentType: 'Antenatal Checkup',
  doctorName: 'Dr. Helena Smith',
};

const USE_MOCK_DATA = true; // Set to false when API is ready

export const useActivePregnancy = () => {
  return useQuery({
    queryKey: ['activePregnancy'],
    queryFn: async (): Promise<Pregnancy> => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_PREGNANCY;
      }
      const { data } = await apiClient.get('/pregnancies/active');
      return data;
    },
  });
};

export const useMotherChildren = () => {
  return useQuery({
    queryKey: ['motherChildren'],
    queryFn: async (): Promise<Child[]> => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_CHILDREN;
      }
      const { data } = await apiClient.get('/mothers/me/children');
      return data;
    },
  });
};

export const useNextAppointment = () => {
  return useQuery({
    queryKey: ['nextAppointment'],
    queryFn: async (): Promise<NextAppointment> => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        return MOCK_APPOINTMENT;
      }
      const { data } = await apiClient.get('/appointments/next');
      return data;
    },
  });
};
