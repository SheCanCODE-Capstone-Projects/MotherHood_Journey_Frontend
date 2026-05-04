import type { Mother, MotherPageResponse } from "@/features/maternal/types";

type MotherSeed = Mother & {
  nidaNumber: string;
};

const mothers: MotherSeed[] = [
  {
    id: "mother-001",
    healthId: "MH-2026-0001",
    nidaNumber: "1199000012345678",
    nidaVerifiedStatus: "VERIFIED",
    dateOfBirth: "1994-04-16",
    educationLevel: "Secondary",
    registeredAt: "2026-04-02T10:15:00.000Z",
    currentPregnancyStatus: "ACTIVE",
    user: { id: "user-001", name: "Aline Uwase", phone: "+250788111111" },
    facility: { id: "facility-001", name: "Nyamata Health Center" },
    geoLocation: { id: "geo-001", sector: "Nyamata", district: "Bugesera", province: "Eastern" },
  },
  {
    id: "mother-002",
    healthId: "MH-2026-0002",
    nidaNumber: "1199000012345679",
    nidaVerifiedStatus: "PENDING",
    dateOfBirth: "1998-09-08",
    educationLevel: "Primary",
    registeredAt: "2026-04-06T14:30:00.000Z",
    currentPregnancyStatus: "ACTIVE",
    user: { id: "user-002", name: "Mukamugema Beatrice", phone: "+250788222222" },
    facility: { id: "facility-002", name: "Kacyiru Health Post" },
    geoLocation: { id: "geo-002", sector: "Kacyiru", district: "Gasabo", province: "Kigali" },
  },
  {
    id: "mother-003",
    healthId: "MH-2026-0003",
    nidaNumber: "1199000012345680",
    nidaVerifiedStatus: "FAILED",
    dateOfBirth: "1991-11-21",
    educationLevel: "College",
    registeredAt: "2026-03-18T09:05:00.000Z",
    currentPregnancyStatus: "DELIVERED",
    user: { id: "user-003", name: "Nyirahabineza Claudine", phone: "+250788333333" },
    facility: { id: "facility-001", name: "Nyamata Health Center" },
    geoLocation: { id: "geo-003", sector: "Nyamata", district: "Bugesera", province: "Eastern" },
  },
  {
    id: "mother-004",
    healthId: "MH-2026-0004",
    nidaNumber: "1199000012345681",
    nidaVerifiedStatus: "MANUAL",
    dateOfBirth: "1989-06-03",
    educationLevel: "Secondary",
    registeredAt: "2026-02-27T08:40:00.000Z",
    currentPregnancyStatus: "TRANSFERRED",
    user: { id: "user-004", name: "Uwimanimpaye Esperance", phone: "+250788444444" },
    facility: { id: "facility-003", name: "Remera Health Center" },
    geoLocation: { id: "geo-004", sector: "Remera", district: "Gasabo", province: "Kigali" },
  },
  {
    id: "mother-005",
    healthId: "MH-2026-0005",
    nidaNumber: "1199000012345682",
    nidaVerifiedStatus: "VERIFIED",
    dateOfBirth: "1996-01-14",
    educationLevel: "Vocational",
    registeredAt: "2026-04-14T11:55:00.000Z",
    currentPregnancyStatus: "ACTIVE",
    user: { id: "user-005", name: "Ineza Diane", phone: "+250788555555" },
    facility: { id: "facility-002", name: "Kacyiru Health Post" },
    geoLocation: { id: "geo-005", sector: "Kacyiru", district: "Gasabo", province: "Kigali" },
  },
];

function includesTerm(mother: MotherSeed, term: string) {
  const normalized = term.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    mother.healthId,
    mother.nidaNumber,
    mother.user?.name,
    mother.facility?.name,
    mother.geoLocation?.district,
    mother.geoLocation?.sector,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
}

function paginate(content: Mother[], page: number, pageSize: number): MotherPageResponse {
  const totalElements = content.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  const start = safePage * pageSize;
  const pageContent = content.slice(start, start + pageSize);

  return {
    content: pageContent,
    pageNumber: safePage,
    pageSize,
    totalElements,
    totalPages,
    last: safePage >= totalPages - 1,
  };
}

export function listMothers(page: number, pageSize: number) {
  return paginate(mothers, page, pageSize);
}

export function searchMothers(term: string | null, page: number, pageSize: number) {
  const filtered = term ? mothers.filter((mother) => includesTerm(mother, term)) : mothers;

  return paginate(filtered, page, pageSize);
}

export function getMotherById(id: string) {
  return mothers.find((mother) => mother.id === id) ?? null;
}

export function getMotherByHealthId(healthId: string) {
  return mothers.find((mother) => mother.healthId === healthId) ?? null;
}
