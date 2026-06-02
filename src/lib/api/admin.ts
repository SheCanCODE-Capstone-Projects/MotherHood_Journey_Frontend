import { apiClient } from "./client";
import type {
  AdminDashboardResponse,
  UserResponse,
  BackendPage,
} from "@/shared/types/backend";

/** Platform-wide counters (MOH_ADMIN only) */
export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return apiClient.get<AdminDashboardResponse>("/api/v1/admin/dashboard");
}

/** Paginated list of all users */
export async function getAllUsers(page = 0, size = 20): Promise<BackendPage<UserResponse>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiClient.get<BackendPage<UserResponse>>(`/api/v1/admin/users?${params.toString()}`);
}

/** Activate a user account */
export async function activateUser(id: string): Promise<UserResponse> {
  return apiClient.patch<UserResponse>(`/api/v1/admin/users/${encodeURIComponent(id)}/activate`);
}

/** Deactivate a user account */
export async function deactivateUser(id: string): Promise<UserResponse> {
  return apiClient.patch<UserResponse>(`/api/v1/admin/users/${encodeURIComponent(id)}/deactivate`);
}
