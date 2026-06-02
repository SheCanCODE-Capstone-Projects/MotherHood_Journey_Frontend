import { apiClient } from "./client";
import type {
  MotherDTO,
  MotherProfileDTO,
  PregnancyDTO,
  NidaStatus,
  PregnancyStatus,
  CommunityHealthWorkerDTO,
} from "@/shared/types/mother";

const MOTHERS_BASE_PATH = "/api/v1/mothers";

function normalizeNidaStatus(raw: string): NidaStatus {
  const s = raw.toUpperCase();
  if (s === "VERIFIED") return "verified";
  if (s === "PENDING" || s === "PARTIAL_MATCH") return "pending";
  return "unverified";
}

function normalizePregnancyStatus(raw: string): PregnancyStatus {
  const s = raw.toUpperCase();
  if (s === "ACTIVE") return "active";
  if (s === "DELIVERED" || s === "COMPLETED") return "completed";
  if (s === "LOST") return "lost";
  if (s === "TRANSFERRED") return "referred";
  return "active";
}

function mapToMotherDTO(raw: Record<string, unknown>): MotherDTO {
  const nidaRaw = String(raw.nidaVerifiedStatus ?? raw.nidaStatus ?? "NOT_CHECKED");
  return {
    id: String(raw.id ?? raw.healthId ?? ""),
    name: String(raw.name ?? raw.firstName ?? (raw.healthId ?? raw.id ?? "Unknown")),
    phone: String(raw.phone ?? raw.phoneNumber ?? ""),
    dateOfBirth: String(raw.dateOfBirth ?? raw.date_of_birth ?? ""),
    nidaStatus: normalizeNidaStatus(nidaRaw),
    nidaNumber: raw.nationalId ? String(raw.nationalId) : undefined,
    location: {
      village: String(raw.village ?? ""),
      cell: String(raw.cell ?? ""),
      sector: String(raw.sector ?? ""),
      district: String(raw.district ?? raw.facilityName ?? ""),
      province: String(raw.province ?? ""),
    },
    chw: (raw.chw as CommunityHealthWorkerDTO) ?? { id: "", name: "", phone: "" },
  };
}

function mapToPregnancyDTO(raw: Record<string, unknown>): PregnancyDTO {
  const status = normalizePregnancyStatus(String(raw.status ?? "ACTIVE"));
  return {
    id: String(raw.id ?? ""),
    motherId: String(raw.motherId ?? raw.mother_id ?? ""),
    gravida: Number(raw.gravida ?? 1),
    para: Number(raw.para ?? 0),
    lmpDate: String(raw.lmpDate ?? raw.lmp_date ?? ""),
    eddDate: String(raw.edd ?? raw.eddDate ?? raw.edd_date ?? ""),
    status,
    isActive: status === "active",
  };
}

export async function getMothers(search?: string): Promise<MotherDTO[]> {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await apiClient.get<unknown>(`${MOTHERS_BASE_PATH}${query}`);

    let items: unknown[];
    if (Array.isArray(response)) {
      items = response;
    } else if (response && typeof response === "object") {
      const r = response as Record<string, unknown>;
      items = Array.isArray(r.content)
        ? r.content
        : Array.isArray(r.data)
          ? r.data
          : [];
    } else {
      items = [];
    }

    return items.map((m) => mapToMotherDTO(m as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getMotherProfile(motherId: string): Promise<MotherProfileDTO> {
  let motherRaw: Record<string, unknown>;
  try {
    motherRaw = await apiClient.get<Record<string, unknown>>(
      `${MOTHERS_BASE_PATH}/${encodeURIComponent(motherId)}`
    );
  } catch (err) {
    // Workaround for Backend Bug #3 (LazyInitializationException on GET /api/v1/mothers/{id})
    console.warn("Direct GET /api/v1/mothers/{id} failed, falling back to search", err);
    const searchRes = await apiClient.get<any>(`${MOTHERS_BASE_PATH}?search=${encodeURIComponent(motherId)}`).catch(() => null);
    const content = searchRes?.content || searchRes?.data || (Array.isArray(searchRes) ? searchRes : []);
    const found = content.find((m: any) => m.id === motherId || m.healthId === motherId);
    if (!found) {
      throw err;
    }
    motherRaw = found;
  }

  const facilityId = String(motherRaw.facilityId ?? "");
  const pregnanciesQs = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : "";
  const pregnanciesRaw = await apiClient
    .get<unknown>(`/api/v1/pregnancies/by-mother/${encodeURIComponent(motherId)}${pregnanciesQs}`)
    .catch(() => [] as unknown[]);

  const mother = mapToMotherDTO(motherRaw);

  let pregnancyItems: unknown[];
  if (Array.isArray(pregnanciesRaw)) {
    pregnancyItems = pregnanciesRaw;
  } else if (pregnanciesRaw && typeof pregnanciesRaw === "object") {
    const r = pregnanciesRaw as Record<string, unknown>;
    pregnancyItems = Array.isArray(r.content) ? r.content : [];
  } else {
    pregnancyItems = [];
  }

  const pregnancies = pregnancyItems.map((p) =>
    mapToPregnancyDTO(p as Record<string, unknown>),
  );
  const activePregnancy = pregnancies.find((p) => p.isActive) ?? null;

  return { mother, pregnancies, activePregnancy };
}

// Correct endpoint: POST /api/v1/pregnancies (not /mothers/{id}/pregnancies)
export function openPregnancy(
  motherId: string,
  facilityId: string,
  data: { lmpDate: string; gravida?: number; para?: number },
): Promise<PregnancyDTO> {
  const lmp = new Date(data.lmpDate);
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);
  return apiClient.post<PregnancyDTO>("/api/v1/pregnancies", {
    motherId,
    facilityId,
    lmpDate: data.lmpDate,
    edd: edd.toISOString().split("T")[0],
    gravida: data.gravida ?? 1,
    para: data.para ?? 0,
  });
}

export function closePregnancy(
  pregnancyId: string,
  facilityId: string,
): Promise<PregnancyDTO> {
  return apiClient.patch<PregnancyDTO>(
    `/api/v1/pregnancies/${encodeURIComponent(pregnancyId)}?facilityId=${encodeURIComponent(facilityId)}`,
    { status: "DELIVERED" },
  );
}
