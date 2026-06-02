import { apiClient } from "./client";
import type { MeResponse, UpdateUserRequest, UserResponse } from "@/shared/types/backend";

/** Get the authenticated user's own profile */
export async function getMyProfile(): Promise<MeResponse> {
  return apiClient.get<MeResponse>("/api/v1/me");
}

/** Get any user by ID (FACILITY_ADMIN+) */
export async function getUserById(id: string): Promise<UserResponse> {
  return apiClient.get<UserResponse>(`/api/v1/users/${encodeURIComponent(id)}`);
}

/** Update user profile (name, language preference) */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
  return apiClient.patch<UserResponse>(`/api/v1/users/${encodeURIComponent(id)}`, data);
}
