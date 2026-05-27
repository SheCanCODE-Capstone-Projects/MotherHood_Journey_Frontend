import { apiClient } from "@/lib/api/client";
import type { UserRole } from "@/shared/types/auth";

export type GovUserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface GovUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  organizationName: string;
  status: GovUserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

const MOCK_USERS: GovUser[] = [
  {
    id: "usr-001",
    name: "Dr. Claudine Mukamana",
    phone: "+250788001001",
    role: "facility_admin",
    organizationName: "Nyamata District Hospital",
    status: "ACTIVE",
    createdAt: "2024-01-15T08:00:00Z",
    lastLoginAt: "2026-05-25T14:32:00Z",
  },
  {
    id: "usr-002",
    name: "Jean-Pierre Habimana",
    phone: "+250788002002",
    role: "health_worker",
    organizationName: "Gashora Health Center",
    status: "ACTIVE",
    createdAt: "2024-02-20T09:00:00Z",
    lastLoginAt: "2026-05-26T07:15:00Z",
  },
  {
    id: "usr-003",
    name: "Chantal Uwimana",
    phone: "+250788003003",
    role: "district_officer",
    organizationName: "Bugesera District Health Office",
    status: "ACTIVE",
    createdAt: "2024-01-10T10:00:00Z",
    lastLoginAt: "2026-05-24T16:45:00Z",
  },
  {
    id: "usr-004",
    name: "Patrick Niyonkuru",
    phone: "+250788004004",
    role: "health_worker",
    organizationName: "Rweru Health Center",
    status: "SUSPENDED",
    createdAt: "2024-03-05T11:00:00Z",
    lastLoginAt: "2026-04-10T09:00:00Z",
  },
  {
    id: "usr-005",
    name: "Alice Mukamurenzi",
    phone: "+250788005005",
    role: "facility_admin",
    organizationName: "Kicukiro District Hospital",
    status: "ACTIVE",
    createdAt: "2024-04-12T08:30:00Z",
    lastLoginAt: "2026-05-26T08:00:00Z",
  },
  {
    id: "usr-006",
    name: "Emmanuel Nsengimana",
    phone: "+250788006006",
    role: "health_worker",
    organizationName: "Nyamata District Hospital",
    status: "PENDING",
    createdAt: "2026-05-20T14:00:00Z",
    lastLoginAt: null,
  },
  {
    id: "usr-007",
    name: "Solange Ingabire",
    phone: "+250788007007",
    role: "district_officer",
    organizationName: "Gasabo District Health Office",
    status: "ACTIVE",
    createdAt: "2024-06-01T09:00:00Z",
    lastLoginAt: "2026-05-25T11:20:00Z",
  },
  {
    id: "usr-008",
    name: "Thierry Hakizimana",
    phone: "+250788008008",
    role: "patient",
    organizationName: "Nyamata Health Center",
    status: "ACTIVE",
    createdAt: "2025-01-08T10:00:00Z",
    lastLoginAt: "2026-05-22T13:00:00Z",
  },
];

export async function getGovUsers(roleFilter?: UserRole): Promise<GovUser[]> {
  try {
    const query = roleFilter ? `?role=${roleFilter}` : "";
    const response = await apiClient.get<unknown>(`/api/v1/government/users${query}`);
    if (Array.isArray(response) && (response as GovUser[]).length > 0) {
      return response as GovUser[];
    }
  } catch {
    // fall through to mock
  }
  return roleFilter ? MOCK_USERS.filter((u) => u.role === roleFilter) : [...MOCK_USERS];
}

export async function updateGovUserStatus(
  userId: string,
  status: GovUserStatus,
): Promise<GovUser> {
  try {
    const response = await apiClient.patch<unknown>(
      `/api/v1/government/users/${userId}/status`,
      { status },
    );
    return response as GovUser;
  } catch {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    return { ...user, status };
  }
}
