import { apiClient } from "./client";
import type {
  ChildDTO,
  ChildRegistrationResponse,
  MotherSearchResult,
} from "@/features/child/types";
import type { ChildFormData } from "@/lib/schemas/childSchema";

const CHILDREN_BASE_PATH = "/api/v1/children";

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
  });
}

export function searchMothers(query: string): Promise<MotherSearchResult[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMothers: MotherSearchResult[] = [
        { health_id: "MTH-001", name: "Uwimana Marie", phone: "+250 788 000 000" },
        { health_id: "MTH-002", name: "Mukamana Jeanne", phone: "+250 788 111 111" },
        { health_id: "MTH-003", name: "Nyiramongi Alice", phone: "+250 788 222 222" },
        { health_id: "MTH-004", name: "Uwase Beatrice", phone: "+250 788 333 333" },
        { health_id: "MTH-005", name: "Nyirahabimana Claudine", phone: "+250 788 444 444" },
      ].filter(
        (m) =>
          m.health_id.toLowerCase().includes(query.toLowerCase()) ||
          m.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(mockMothers);
    }, 300);
  });
}
