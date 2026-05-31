import { apiClient } from "./client";
import type {
  AdministerVaccinationRequest,
  ChildDTO,
  ChildRegistrationResponse,
  ChildVaccinationSessionResponse,
  MotherSearchResult,
} from "@/features/child/types";
import type { ChildFormData } from "@/lib/schemas/childSchema";
import { VACCINATION_API } from "@/features/child/api/constants";

const CHILDREN_BASE_PATH = "/api/v1/children";

<<<<<<< HEAD
export type ChildHealthStatus = "HEALTHY" | "AT_RISK" | "CRITICAL";

export interface VaccinationRow {
  id: string;
  vaccine_name: string;
  antigen_code: string;
  due_date: string;
  window_days: number;
  status: "PENDING" | "ADMINISTERED" | "MISSED" | "OVERDUE";
  administered_date: string | null;
  lot_number: string | null;
}

export interface ChildProfileDTO {
  id: string;
  health_id: string;
  first_name: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
  birth_weight: number;
  delivery_type: "NORMAL" | "CAESAREAN" | "ASSISTED";
  birth_certificate_number: string | null;
  health_status: ChildHealthStatus;
  mother_id: string;
  mother_name: string;
  facility_name: string;
  created_at: string;
  vaccinations: VaccinationRow[];
}

function buildMockVaccinations(dob: string): VaccinationRow[] {
  const birth = new Date(dob);
  const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const today = new Date();

  const schedule: Array<{ name: string; code: string; offsetDays: number; window: number }> = [
    { name: "BCG", code: "BCG-1", offsetDays: 0, window: 7 },
    { name: "Hepatitis B (Birth)", code: "HepB-0", offsetDays: 0, window: 7 },
    { name: "Polio (OPV 0)", code: "OPV-0", offsetDays: 0, window: 7 },
    { name: "DPT-HepB-Hib 1", code: "PENTA-1", offsetDays: 42, window: 14 },
    { name: "Polio (OPV 1)", code: "OPV-1", offsetDays: 42, window: 14 },
    { name: "Rotavirus 1", code: "ROTA-1", offsetDays: 42, window: 14 },
    { name: "DPT-HepB-Hib 2", code: "PENTA-2", offsetDays: 70, window: 14 },
    { name: "Polio (OPV 2)", code: "OPV-2", offsetDays: 70, window: 14 },
    { name: "Rotavirus 2", code: "ROTA-2", offsetDays: 70, window: 14 },
    { name: "DPT-HepB-Hib 3", code: "PENTA-3", offsetDays: 98, window: 14 },
    { name: "Polio (OPV 3)", code: "OPV-3", offsetDays: 98, window: 14 },
    { name: "Measles-Rubella 1", code: "MR-1", offsetDays: 274, window: 30 },
    { name: "Yellow Fever", code: "YF-1", offsetDays: 274, window: 30 },
  ];

  return schedule.map((s, i) => {
    const dueDate = addDays(birth, s.offsetDays);
    const windowEnd = addDays(dueDate, s.window);
    let status: VaccinationRow["status"];
    let administered_date: string | null = null;
    const lot_number: string | null = null;

    if (i < 3) {
      status = "ADMINISTERED";
      administered_date = fmt(addDays(dueDate, 1));
    } else if (dueDate > today) {
      status = "PENDING";
    } else if (windowEnd < today) {
      status = i % 3 === 0 ? "OVERDUE" : "MISSED";
    } else {
      status = "PENDING";
    }

    return {
      id: `vax-${i + 1}`,
      vaccine_name: s.name,
      antigen_code: s.code,
      due_date: fmt(dueDate),
      window_days: s.window,
      status,
      administered_date,
      lot_number,
    };
  });
}

const MOCK_CHILDREN: ChildProfileDTO[] = [
  {
    id: "child-001",
    health_id: "CHD-001",
    first_name: "Amara",
    gender: "FEMALE",
    date_of_birth: "2024-11-20",
    birth_weight: 3.2,
    delivery_type: "NORMAL",
    birth_certificate_number: "BC-2024-0041",
    health_status: "HEALTHY",
    mother_id: "MTH-001",
    mother_name: "Uwimana Marie",
    facility_name: "Nyamata Health Center",
    created_at: "2024-11-20T08:00:00Z",
    vaccinations: buildMockVaccinations("2024-11-20"),
  },
  {
    id: "child-002",
    health_id: "CHD-002",
    first_name: "Ishimwe",
    gender: "MALE",
    date_of_birth: "2026-03-22",
    birth_weight: 2.9,
    delivery_type: "CAESAREAN",
    birth_certificate_number: "BC-2026-0029",
    health_status: "AT_RISK",
    mother_id: "MTH-002",
    mother_name: "Mukamana Jeanne",
    facility_name: "Nyamata Health Center",
    created_at: "2026-03-22T10:30:00Z",
    vaccinations: buildMockVaccinations("2026-03-22"),
  },
];

export async function getChildren(search?: string): Promise<ChildProfileDTO[]> {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await apiClient.get<unknown>(`${CHILDREN_BASE_PATH}${query}`);
    if (Array.isArray(response) && (response as ChildProfileDTO[]).length > 0) {
      return response as ChildProfileDTO[];
    }
  } catch {
    // fall through to mock
  }
  const q = search?.toLowerCase() ?? "";
  const list = [...MOCK_CHILDREN];
  return q
    ? list.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.health_id.toLowerCase().includes(q) ||
          c.mother_name.toLowerCase().includes(q),
      )
    : list;
}

export async function getChildProfile(childId: string): Promise<ChildProfileDTO> {
  try {
    const response = await apiClient.get<unknown>(`${CHILDREN_BASE_PATH}/${encodeURIComponent(childId)}`);
    return response as ChildProfileDTO;
  } catch {
    // fall through to mock
  }
  const mock = MOCK_CHILDREN.find((c) => c.id === childId || c.health_id === childId);
  if (!mock) throw new Error("Child not found");
  return mock;
}

export function registerChild(data: ChildFormData): Promise<ChildRegistrationResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const child: ChildDTO = {
        id: `child-${Date.now()}`,
        mother_id: data.mother_health_id,
        first_name: data.first_name,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        birth_weight: data.birth_weight,
        delivery_type: data.delivery_type,
        birth_certificate_number: data.birth_certificate_number,
        created_at: new Date().toISOString(),
      };

      const vaccination_schedule = [
        {
          id: "vax-1",
          vaccine_name: "BCG",
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending" as const,
        },
        {
          id: "vax-2",
          vaccine_name: "Hepatitis B",
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending" as const,
        },
        {
          id: "vax-3",
          vaccine_name: "Polio (OPV 0)",
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending" as const,
        },
        {
          id: "vax-4",
          vaccine_name: "DPT-HepB-Hib (Pentavalent 1)",
          due_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending" as const,
        },
        {
          id: "vax-5",
          vaccine_name: "Polio (OPV 1)",
          due_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending" as const,
        },
        {
          id: "vax-6",
          vaccine_name: "Rotavirus 1",
          due_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending" as const,
        },
      ];

      resolve({
        child,
        vaccination_schedule,
      });
    }, 1000);
=======
/**
 * Register a new child with the backend API
 * Returns the child data along with the vaccination schedule
 */
export async function registerChild(data: ChildFormData): Promise<ChildRegistrationResponse> {
  return apiClient.post<ChildRegistrationResponse>(CHILDREN_BASE_PATH, {
    mother_health_id: data.mother_health_id,
    first_name: data.first_name,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    birth_weight: data.birth_weight,
    delivery_type: data.delivery_type,
    birth_certificate_number: data.birth_certificate_number,
>>>>>>> main
  });
}

/**
 * Search mothers by health ID or name
 * Used for linking child to mother during registration
 */
export async function searchMothers(query: string): Promise<MotherSearchResult[]> {
  const params = new URLSearchParams();
  params.set("search_term", query.trim());

  return apiClient.get<MotherSearchResult[]>(
    `/api/v1/mothers/search?${params.toString()}`
  );
}

export async function searchChildVaccinationSession(searchTerm: string) {
  const params = new URLSearchParams();
  params.set(VACCINATION_API.QUERY_PARAMS.SEARCH_TERM, searchTerm.trim());

  return apiClient.get<ChildVaccinationSessionResponse>(
    `${VACCINATION_API.ENDPOINTS.SESSION_SEARCH}?${params.toString()}`,
  );
}

export async function getChildVaccinationSession(childId: string) {
  return apiClient.get<ChildVaccinationSessionResponse>(
    VACCINATION_API.ENDPOINTS.VACCINATION_CARD(childId),
  );
}

export async function administerVaccination(
  vaccinationId: string,
  body: AdministerVaccinationRequest,
) {
  return apiClient.put<{ success: boolean; message: string }>(
    VACCINATION_API.ENDPOINTS.ADMINISTER(vaccinationId),
    body,
  );
}
