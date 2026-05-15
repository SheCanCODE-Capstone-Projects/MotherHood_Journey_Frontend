import { apiClient } from '@/shared/lib/axios';
import { Province, District, Sector, Cell, Village } from '@/features/geo/types';

// Toggle this to test without backend
const USE_MOCK_DATA = true;

// Mock data for Rwanda
const MOCK_PROVINCES: Province[] = [
  { id: '1', name: 'Kigali City', code: 'KGL' },
  { id: '2', name: 'Eastern Province', code: 'EST' },
  { id: '3', name: 'Northern Province', code: 'NTH' },
  { id: '4', name: 'Southern Province', code: 'STH' },
  { id: '5', name: 'Western Province', code: 'WST' },
];

const MOCK_DISTRICTS: Record<string, District[]> = {
  '1': [
    { id: '11', name: 'Gasabo', code: 'GSB' },
    { id: '12', name: 'Kicukiro', code: 'KCK' },
    { id: '13', name: 'Nyarugenge', code: 'NYR' },
  ],
  '2': [
    { id: '21', name: 'Bugesera', code: 'BGS' },
    { id: '22', name: 'Gatsibo', code: 'GTS' },
    { id: '23', name: 'Kayonza', code: 'KYZ' },
  ],
  '3': [
    { id: '31', name: 'Burera', code: 'BRR' },
    { id: '32', name: 'Gakenke', code: 'GKK' },
    { id: '33', name: 'Gicumbi', code: 'GCM' },
  ],
};

const MOCK_SECTORS: Record<string, Sector[]> = {
  '11': [
    { id: '111', name: 'Bumbogo', code: 'BMB' },
    { id: '112', name: 'Gatsata', code: 'GTS' },
    { id: '113', name: 'Gikomero', code: 'GKM' },
  ],
  '12': [
    { id: '121', name: 'Gahanga', code: 'GHG' },
    { id: '122', name: 'Gikondo', code: 'GKD' },
    { id: '123', name: 'Kagarama', code: 'KGR' },
  ],
  '13': [
    { id: '131', name: 'Gitega', code: 'GTG' },
    { id: '132', name: 'Kanyinya', code: 'KNY' },
    { id: '133', name: 'Kigali', code: 'KGL' },
  ],
};

const MOCK_CELLS: Record<string, Cell[]> = {
  '111': [
    { id: '1111', name: 'Bumbogo I', code: 'BMB1' },
    { id: '1112', name: 'Bumbogo II', code: 'BMB2' },
  ],
  '112': [
    { id: '1121', name: 'Gatsata I', code: 'GTS1' },
    { id: '1122', name: 'Gatsata II', code: 'GTS2' },
  ],
  '121': [
    { id: '1211', name: 'Gahanga I', code: 'GHG1' },
    { id: '1212', name: 'Gahanga II', code: 'GHG2' },
  ],
};

const MOCK_VILLAGES: Record<string, Village[]> = {
  '1111': [
    { id: '11111', name: 'Bumbogo Village A', code: 'BMBA' },
    { id: '11112', name: 'Bumbogo Village B', code: 'BMBB' },
    { id: '11113', name: 'Bumbogo Village C', code: 'BMBC' },
  ],
  '1112': [
    { id: '11121', name: 'Bumbogo Village D', code: 'BMBD' },
    { id: '11122', name: 'Bumbogo Village E', code: 'BMBE' },
  ],
  '1121': [
    { id: '11211', name: 'Gatsata Village A', code: 'GTSA' },
    { id: '11212', name: 'Gatsata Village B', code: 'GTSB' },
  ],
};

export const geoApi = {
  getProvinces: async (): Promise<Province[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_PROVINCES;
    }
    const { data } = await apiClient.get('/geo/provinces');
    return data;
  },

  getDistricts: async (provinceId: string): Promise<District[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DISTRICTS[provinceId] || [];
    }
    const { data } = await apiClient.get(`/geo/provinces/${provinceId}/districts`);
    return data;
  },

  getSectors: async (districtId: string): Promise<Sector[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_SECTORS[districtId] || [];
    }
    const { data } = await apiClient.get(`/geo/districts/${districtId}/sectors`);
    return data;
  },

  getCells: async (sectorId: string): Promise<Cell[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_CELLS[sectorId] || [];
    }
    const { data } = await apiClient.get(`/geo/sectors/${sectorId}/cells`);
    return data;
  },

  getVillages: async (cellId: string): Promise<Village[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_VILLAGES[cellId] || [];
    }
    const { data } = await apiClient.get(`/geo/cells/${cellId}/villages`);
    return data;
  },
};
