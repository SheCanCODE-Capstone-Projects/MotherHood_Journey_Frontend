/**
 * features/auth/types.ts — Auth feature-level types.
 *
 * Re-exports the shared auth types so that feature code imports from
 * its own domain (clean architecture boundary), and adds any auth-feature-
 * specific shapes (API request/response payloads).
 */

// Re-export role constants and the Resource type.
export { PERMISSIONS, RESOURCES } from "@/shared/config/rbac";
export type { Resource } from "@/shared/config/rbac";

// Re-export user/session types from shared types.
export { ROLES } from "@/shared/types/auth";
export type { Role, MvpRole, AppUser } from "@/shared/types/auth";

// ---------------------------------------------------------------------------
// API payload types — match the backend REST contract
// ---------------------------------------------------------------------------

import type { Role } from "@/shared/types/auth";

/** POST /api/auth/login — request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /api/auth/login — success response body */
export interface LoginResponse {
  accessToken: string;
  expiresIn: number; // seconds (default: 86400 = 24 h, SRD FR-AUTH-02)
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    facilityId: string | null;
  };
}

/** POST /api/auth/register — MOTHER self-registration (SRD FR-AUTH-04) */
export interface MotherRegisterRequest {
  birthCode: string;   // unique code issued by NURSE at child registration
  phoneNumber: string; // Rwandan format e.g. +2507XXXXXXXX
  password: string;
}

/** POST /api/auth/password-reset/request */
export interface PasswordResetRequest {
  email: string;
}

/** POST /api/auth/password-reset/confirm */
export interface PasswordResetConfirm {
  token: string;  // 30-minute expiry (SRD FR-AUTH-09)
  newPassword: string;
}
