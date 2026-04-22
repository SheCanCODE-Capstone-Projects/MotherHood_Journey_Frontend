/**
 * auth.ts — Core authentication and session types for MotherHood Journey.
 *
 * NextAuth v5 (Auth.js) module augmentation: extends the built-in Session
 * and JWT types so that `session.user.role` is fully typed across the
 * codebase (middleware, server components, client hooks).
 */

import "next-auth";
import "next-auth/jwt";

// ---------------------------------------------------------------------------
// 1. Role definitions — mirrors the database enum defined in the SRD.
//    MVP ships with 4 roles; v2 adds FAC_ADMIN, DIST_OFFICER, GOV_ANALYST,
//    MOH_ADMIN. Adding them here requires zero schema migration on existing
//    tables (enum-based design decision from SRD §4.5).
// ---------------------------------------------------------------------------

export const ROLES = {
  MOTHER: "MOTHER",
  NURSE: "NURSE",
  CHW: "CHW",
  ADMIN: "ADMIN",
  // --- v2 roles (reserved, not yet active) ---
  FAC_ADMIN: "FAC_ADMIN",
  DIST_OFFICER: "DIST_OFFICER",
  GOV_ANALYST: "GOV_ANALYST",
  MOH_ADMIN: "MOH_ADMIN",
} as const;

/** Union type of every valid role string. */
export type Role = (typeof ROLES)[keyof typeof ROLES];

/** MVP-active roles only. */
export type MvpRole = "MOTHER" | "NURSE" | "CHW" | "ADMIN";

// ---------------------------------------------------------------------------
// 2. Extended user shape that lives inside the NextAuth session.
// ---------------------------------------------------------------------------

export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  /** Assigned facility ID — relevant for NURSE and CHW; null for MOTHER/ADMIN. */
  facilityId?: string | null;
}

// ---------------------------------------------------------------------------
// 3. NextAuth v5 module augmentation — adds `role` and `facilityId` to the
//    built-in Session["user"] and JWT types so they're typed everywhere.
// ---------------------------------------------------------------------------

declare module "next-auth" {
  interface Session {
    user: AppUser;
  }

  interface User {
    role: Role;
    facilityId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    facilityId?: string | null;
  }
}
