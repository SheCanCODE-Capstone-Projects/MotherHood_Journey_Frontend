import { apiClient } from "@/lib/api/client";

export type StaffAccountStatus = "ACTIVE" | "INACTIVE";

export type FacilityStaffMember = {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  nationalId: string;
  role: "HEALTH_WORKER";
  active: boolean;
  lastLogin: string | null;
  facilityName?: string;
};

export type StaffMutationResult = {
  id: string;
  active: boolean;
  source: "api" | "demo";
};

const DEMO_STORAGE_KEY = "motherhood:facility-staff-demo";

function addDays(base: Date, days: number, time: string) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);

  const [hours, minutes] = time.split(":").map((value) => Number(value));
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatIso(date: Date) {
  return date.toISOString();
}

export function createDemoFacilityStaffMembers(): FacilityStaffMember[] {
  const now = new Date();

  return [
    {
      id: "staff-demo-001",
      firstName: "Aline",
      lastName: "Uwizeye",
      fullName: "Aline Uwizeye",
      phoneNumber: "+250788000111",
      nationalId: "1199887766554433",
      role: "HEALTH_WORKER",
      active: true,
      lastLogin: formatIso(addDays(now, -1, "07:30")),
      facilityName: "Nyamata District Hospital",
    },
    {
      id: "staff-demo-002",
      firstName: "Jean",
      lastName: "Bikorimana",
      fullName: "Jean Bikorimana",
      phoneNumber: "+250788000112",
      nationalId: "1199887766554434",
      role: "HEALTH_WORKER",
      active: true,
      lastLogin: formatIso(addDays(now, -3, "09:15")),
      facilityName: "Nyamata District Hospital",
    },
    {
      id: "staff-demo-003",
      firstName: "Diane",
      lastName: "Mukamana",
      fullName: "Diane Mukamana",
      phoneNumber: "+250788000113",
      nationalId: "1199887766554435",
      role: "HEALTH_WORKER",
      active: true,
      lastLogin: formatIso(addDays(now, -5, "13:05")),
      facilityName: "Nyamata District Hospital",
    },
    {
      id: "staff-demo-004",
      firstName: "Eric",
      lastName: "Nshimiyimana",
      fullName: "Eric Nshimiyimana",
      phoneNumber: "+250788000114",
      nationalId: "1199887766554436",
      role: "HEALTH_WORKER",
      active: true,
      lastLogin: formatIso(addDays(now, -8, "11:45")),
      facilityName: "Nyamata District Hospital",
    },
    {
      id: "staff-demo-005",
      firstName: "Vestine",
      lastName: "Nyirababyeyi",
      fullName: "Vestine Nyirababyeyi",
      phoneNumber: "+250788000115",
      nationalId: "1199887766554437",
      role: "HEALTH_WORKER",
      active: false,
      lastLogin: formatIso(addDays(now, -19, "10:20")),
      facilityName: "Nyamata District Hospital",
    },
    {
      id: "staff-demo-006",
      firstName: "Theoneste",
      lastName: "Habimana",
      fullName: "Theoneste Habimana",
      phoneNumber: "+250788000116",
      nationalId: "1199887766554438",
      role: "HEALTH_WORKER",
      active: false,
      lastLogin: formatIso(addDays(now, -27, "15:40")),
      facilityName: "Nyamata District Hospital",
    },
  ];
}

function getStoredDemoFacilityStaffMembers(): FacilityStaffMember[] {
  if (typeof window === "undefined") {
    return createDemoFacilityStaffMembers();
  }

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);

    if (!raw) {
      const demo = createDemoFacilityStaffMembers();
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }

    const parsed = JSON.parse(raw) as FacilityStaffMember[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const demo = createDemoFacilityStaffMembers();
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }

    return parsed;
  } catch {
    const demo = createDemoFacilityStaffMembers();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demo));
    }
    return demo;
  }
}

function setStoredDemoFacilityStaffMembers(members: FacilityStaffMember[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(members));
}

function normalizeStaffMember(record: unknown): FacilityStaffMember | null {
  if (!record || typeof record !== "object") {
    return null;
  }

  const candidate = record as Record<string, unknown>;
  const facility = candidate.facility && typeof candidate.facility === "object"
    ? (candidate.facility as Record<string, unknown>)
    : undefined;
  const firstName = typeof candidate.firstName === "string" ? candidate.firstName : "";
  const lastName = typeof candidate.lastName === "string" ? candidate.lastName : "";
  const fullNameValue = typeof candidate.fullName === "string" ? candidate.fullName : "";
  const combinedName = `${firstName} ${lastName}`.trim();

  return {
    id: String(candidate.id ?? ""),
    fullName: fullNameValue || combinedName || String(candidate.name ?? "Health Worker"),
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    phoneNumber: String(candidate.phoneNumber ?? candidate.phone ?? ""),
    nationalId: String(candidate.nationalId ?? candidate.national_id ?? ""),
    role: "HEALTH_WORKER",
    active: Boolean(candidate.active ?? candidate.isActive ?? true),
    lastLogin:
      typeof candidate.lastLogin === "string"
        ? candidate.lastLogin
        : typeof candidate.last_login === "string"
          ? candidate.last_login
          : null,
    facilityName:
      typeof candidate.facilityName === "string"
        ? candidate.facilityName
        : typeof facility?.name === "string"
          ? String(facility.name)
          : undefined,
  };
}

function normalizeStaffListResponse(response: unknown): FacilityStaffMember[] {
  if (Array.isArray(response)) {
    return response.map(normalizeStaffMember).filter(Boolean) as FacilityStaffMember[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const candidate = response as Record<string, unknown>;

  if (Array.isArray(candidate.content)) {
    return candidate.content
      .map(normalizeStaffMember)
      .filter(Boolean) as FacilityStaffMember[];
  }

  if (Array.isArray(candidate.data)) {
    return candidate.data.map(normalizeStaffMember).filter(Boolean) as FacilityStaffMember[];
  }

  if (Array.isArray(candidate.items)) {
    return candidate.items.map(normalizeStaffMember).filter(Boolean) as FacilityStaffMember[];
  }

  return [];
}

export async function getFacilityStaffMembers(): Promise<FacilityStaffMember[]> {
  try {
    const response = await apiClient.get<unknown>("/api/v1/users?role=HEALTH_WORKER");
    const members = normalizeStaffListResponse(response);

    if (members.length > 0) {
      return members;
    }
  } catch {
    // Fall through to demo data.
  }

  return getStoredDemoFacilityStaffMembers();
}

function updateStoredDemoStaffMember(
  id: string,
  active: boolean,
): FacilityStaffMember[] {
  const updated = getStoredDemoFacilityStaffMembers().map((member) =>
    member.id === id
      ? {
          ...member,
          active,
          lastLogin: member.lastLogin ?? formatIso(new Date()),
        }
      : member,
  );

  setStoredDemoFacilityStaffMembers(updated);
  return updated;
}

export async function activateStaffAccount(id: string): Promise<StaffMutationResult> {
  try {
    await apiClient.patch(`/api/v1/users/${id}/activate`);
    return { id, active: true, source: "api" };
  } catch {
    updateStoredDemoStaffMember(id, true);
    return { id, active: true, source: "demo" };
  }
}

export async function deactivateStaffAccount(id: string): Promise<StaffMutationResult> {
  try {
    await apiClient.patch(`/api/v1/users/${id}/deactivate`);
    return { id, active: false, source: "api" };
  } catch {
    updateStoredDemoStaffMember(id, false);
    return { id, active: false, source: "demo" };
  }
}

export function seedDemoFacilityStaffMembers() {
  const demo = createDemoFacilityStaffMembers();
  setStoredDemoFacilityStaffMembers(demo);
  return demo;
}

export function readStoredFacilityStaffMembers() {
  return getStoredDemoFacilityStaffMembers();
}