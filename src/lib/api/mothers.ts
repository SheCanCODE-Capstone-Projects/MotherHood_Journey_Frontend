import { apiClient } from "./client";
import type {
  MotherDTO,
  MotherProfileDTO,
  PregnancyDTO,
} from "@/shared/types/mother";

const MOTHERS_BASE_PATH = "/api/v1/mothers";

const MOCK_MOTHERS: MotherDTO[] = [
  {
    id: "MTH-001",
    name: "Uwimana Marie",
    phone: "+250 788 000 001",
    dateOfBirth: "1995-03-15",
    nidaStatus: "verified",
    nidaNumber: "1199500123456789",
    location: { village: "Nyamirambo", cell: "Gitega", sector: "Nyarugenge", district: "Nyarugenge", province: "Kigali City" },
    chw: { id: "chw-001", name: "Jean Pierre Habimana", phone: "0788 123 456" },
  },
  {
    id: "MTH-002",
    name: "Mukamana Jeanne",
    phone: "+250 788 000 002",
    dateOfBirth: "1998-07-22",
    nidaStatus: "pending",
    nidaNumber: "1199800234567890",
    location: { village: "Kimihurura", cell: "Giporoso", sector: "Remera", district: "Gasabo", province: "Kigali City" },
    chw: { id: "chw-002", name: "Alice Nyiraneza", phone: "0788 234 567" },
  },
  {
    id: "MTH-003",
    name: "Nyiramongi Alice",
    phone: "+250 788 000 003",
    dateOfBirth: "2000-01-10",
    nidaStatus: "verified",
    nidaNumber: "2000003456789012",
    location: { village: "Batsinda", cell: "Batsinda", sector: "Kacyiru", district: "Gasabo", province: "Kigali City" },
    chw: { id: "chw-001", name: "Jean Pierre Habimana", phone: "0788 123 456" },
  },
  {
    id: "MTH-004",
    name: "Uwase Beatrice",
    phone: "+250 788 000 004",
    dateOfBirth: "1993-11-05",
    nidaStatus: "unverified",
    location: { village: "Gahanga", cell: "Gahanga", sector: "Gahanga", district: "Kicukiro", province: "Kigali City" },
    chw: { id: "chw-003", name: "Emmanuel Nsabimana", phone: "0788 345 678" },
  },
  {
    id: "MTH-005",
    name: "Nyirahabimana Claudine",
    phone: "+250 788 000 005",
    dateOfBirth: "1997-05-18",
    nidaStatus: "verified",
    nidaNumber: "1199700456789013",
    location: { village: "Masaka", cell: "Masaka", sector: "Masaka", district: "Kicukiro", province: "Kigali City" },
    chw: { id: "chw-002", name: "Alice Nyiraneza", phone: "0788 234 567" },
  },
  {
    id: "MTH-006",
    name: "Mukandayisenga Olive",
    phone: "+250 788 000 006",
    dateOfBirth: "2001-09-30",
    nidaStatus: "pending",
    location: { village: "Nyamata", cell: "Nyamata", sector: "Nyamata", district: "Bugesera", province: "Eastern Province" },
    chw: { id: "chw-003", name: "Emmanuel Nsabimana", phone: "0788 345 678" },
  },
];

export async function getMothers(search?: string): Promise<MotherDTO[]> {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await apiClient.get<unknown>(`${MOTHERS_BASE_PATH}${query}`);
    if (Array.isArray(response) && (response as MotherDTO[]).length > 0) {
      return response as MotherDTO[];
    }
  } catch {
    // fall through to mock
  }
  const q = search?.toLowerCase() ?? "";
  return q
    ? MOCK_MOTHERS.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.phone.includes(q),
      )
    : [...MOCK_MOTHERS];
}

export function getMotherProfile(motherId: string): Promise<MotherProfileDTO> {
  return Promise.resolve({
    mother: {
      id: motherId,
      name: "Uwimana Marie",
      phone: "+250 788 000 000",
      dateOfBirth: "1995-03-15",
      nidaStatus: "verified",
      nidaNumber: "1199580123456789",
      location: {
        village: "Nyamirambo",
        cell: "Gitega",
        sector: "Nyarugenge",
        district: "Nyarugenge",
        province: "Kigali City",
      },
      chw: {
        id: "chw-001",
        name: "Jean Pierre Habimana",
        phone: "0788 123 456",
      },
    },
    pregnancies: [
      {
        id: "1",
        motherId: motherId,
        gravida: 3,
        para: 2,
        lmpDate: "2026-01-10",
        eddDate: "2026-09-17",
        status: "active",
        isActive: true,
      },
      {
        id: "2",
        motherId: motherId,
        gravida: 2,
        para: 1,
        lmpDate: "2022-06-01",
        eddDate: "2023-03-04",
        status: "completed",
        isActive: false,
      },
      {
        id: "3",
        motherId: motherId,
        gravida: 1,
        para: 0,
        lmpDate: "2020-01-15",
        eddDate: "2020-10-19",
        status: "completed",
        isActive: false,
      },
    ],
    activePregnancy: {
      id: "1",
      motherId: motherId,
      gravida: 3,
      para: 2,
      lmpDate: "2026-01-10",
      eddDate: "2026-09-17",
      status: "active",
      isActive: true,
    },
  });
}

export function openPregnancy(
  motherId: string,
  data: Pick<PregnancyDTO, "lmpDate">
): Promise<PregnancyDTO> {
  return apiClient.post<PregnancyDTO>(
    `${MOTHERS_BASE_PATH}/${encodeURIComponent(motherId)}/pregnancies`,
    data
  );
}

export function closePregnancy(
  motherId: string,
  pregnancyId: string
): Promise<PregnancyDTO> {
  return apiClient.patch<PregnancyDTO>(
    `${MOTHERS_BASE_PATH}/${encodeURIComponent(motherId)}/pregnancies/${encodeURIComponent(pregnancyId)}/close`,
    {}
  );
}
