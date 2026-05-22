/**
 * auth.ts - Core authentication and session types for MotherHood Journey.
 *
 * NextAuth v5 module augmentation keeps role information typed across the
 * app for middleware, hooks, and server-side guards.
 */

import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

export const ROLES = {
  MOTHER: "MOTHER",
  NURSE: "NURSE",
  CHW: "CHW",
  ADMIN: "ADMIN",
  FAC_ADMIN: "FAC_ADMIN",
  DIST_OFFICER: "DIST_OFFICER",
  GOV_ANALYST: "GOV_ANALYST",
  MOH_ADMIN: "MOH_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type MvpRole = "MOTHER" | "NURSE" | "CHW" | "ADMIN";

export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  facilityId?: string | null;
}

// Avoid module augmentation here to keep types consistent with the root
// workspace-level NextAuth declarations. Use the exported `Role` and
// `AppUser` types from this file where needed instead of re-augmenting
// the `next-auth` module in this nested package.
