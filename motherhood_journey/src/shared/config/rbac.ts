/**
 * rbac.ts — Access Control List (ACL) configuration for MotherHood Journey.
 *
 * This is the single source of truth for what each role is allowed to do.
 * It is derived directly from the SRD §2.3 Role-to-Feature Access Matrix.
 *
 * HOW TO USE:
 *   - Add a new resource string to `Resource` when a new feature is built.
 *   - Update `PERMISSIONS` to grant that resource to the appropriate roles.
 *   - Update `ROUTE_ROLE_MAP` when a new protected route group is added.
 *   - Never scatter permission checks across components — always import from here.
 */

import { type Role } from "@/shared/types/auth";

// ---------------------------------------------------------------------------
// 1. Resource identifiers — every gateable action in the system.
//    Naming convention: VERB_NOUN or DOMAIN_ACTION (all caps).
// ---------------------------------------------------------------------------

export const RESOURCES = {
  // --- Vaccination schedule ---
  VIEW_OWN_SCHEDULE: "VIEW_OWN_SCHEDULE",
  RECORD_VACCINATION: "RECORD_VACCINATION",

  // --- Registration ---
  SELF_REGISTER: "SELF_REGISTER",
  REGISTER_MOTHER_CHILD: "REGISTER_MOTHER_CHILD",

  // --- CHW village view ---
  VIEW_VILLAGE_LIST: "VIEW_VILLAGE_LIST",

  // --- Admin account management ---
  CREATE_NURSE_ACCOUNT: "CREATE_NURSE_ACCOUNT",
  CREATE_CHW_ACCOUNT: "CREATE_CHW_ACCOUNT",
  MANAGE_USERS: "MANAGE_USERS",

  // --- System-wide data ---
  VIEW_ALL_FACILITIES: "VIEW_ALL_FACILITIES",
  VIEW_SYSTEM_STATS: "VIEW_SYSTEM_STATS",

  // --- SMS ---
  TRIGGER_SMS: "TRIGGER_SMS",

  // --- Documents (SRD §3.9) ---
  VIEW_BIRTH_CERT: "VIEW_BIRTH_CERT",
  DOWNLOAD_BIRTH_CERT: "DOWNLOAD_BIRTH_CERT",
  VIEW_VAX_CARD: "VIEW_VAX_CARD",
  DOWNLOAD_VAX_CARD: "DOWNLOAD_VAX_CARD",

  // --- Future / reserved for v2 ---
  HMIS_PUSH: "HMIS_PUSH",
  VIEW_REPORTS: "VIEW_REPORTS",
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];

// ---------------------------------------------------------------------------
// 2. PERMISSIONS — maps every Role to the Resources it may access.
//    Source: SRD §2.3 Role-to-Feature Access Matrix.
// ---------------------------------------------------------------------------

export const PERMISSIONS: Record<Role, Resource[]> = {
  // ── MOTHER ────────────────────────────────────────────────────────────────
  // Can only see her own child's data and documents. Read-only.
  MOTHER: [
    RESOURCES.VIEW_OWN_SCHEDULE,
    RESOURCES.SELF_REGISTER,
    RESOURCES.VIEW_BIRTH_CERT,
    RESOURCES.DOWNLOAD_BIRTH_CERT,
    RESOURCES.VIEW_VAX_CARD,
    RESOURCES.DOWNLOAD_VAX_CARD,
  ],

  // ── NURSE ─────────────────────────────────────────────────────────────────
  // Registers mothers/children, records vaccinations, generates documents.
  // Scoped to their assigned facility (enforced server-side).
  NURSE: [
    RESOURCES.VIEW_OWN_SCHEDULE,
    RESOURCES.REGISTER_MOTHER_CHILD,
    RESOURCES.RECORD_VACCINATION,
    RESOURCES.TRIGGER_SMS,
    RESOURCES.VIEW_BIRTH_CERT,
    RESOURCES.DOWNLOAD_BIRTH_CERT,
    RESOURCES.VIEW_VAX_CARD,
    RESOURCES.DOWNLOAD_VAX_CARD,
  ],

  // ── CHW (Community Health Worker) ─────────────────────────────────────────
  // Read-only view of their village's vaccination status; can trigger SMS.
  // May NOT create, edit, or delete records (SRD FR-CHW-05).
  CHW: [
    RESOURCES.VIEW_VILLAGE_LIST,
    RESOURCES.TRIGGER_SMS,
  ],

  // ── ADMIN (Super Admin) ───────────────────────────────────────────────────
  // Full system access — all facilities, all children, all stats.
  ADMIN: [
    RESOURCES.VIEW_OWN_SCHEDULE,
    RESOURCES.REGISTER_MOTHER_CHILD,
    RESOURCES.RECORD_VACCINATION,
    RESOURCES.VIEW_VILLAGE_LIST,
    RESOURCES.CREATE_NURSE_ACCOUNT,
    RESOURCES.CREATE_CHW_ACCOUNT,
    RESOURCES.MANAGE_USERS,
    RESOURCES.VIEW_ALL_FACILITIES,
    RESOURCES.VIEW_SYSTEM_STATS,
    RESOURCES.TRIGGER_SMS,
    RESOURCES.VIEW_BIRTH_CERT,
    RESOURCES.DOWNLOAD_BIRTH_CERT,
    RESOURCES.VIEW_VAX_CARD,
    RESOURCES.DOWNLOAD_VAX_CARD,
  ],

  // ── v2 roles (reserved — no permissions assigned yet) ─────────────────────
  FAC_ADMIN: [],
  DIST_OFFICER: [],
  GOV_ANALYST: [],
  MOH_ADMIN: [
    RESOURCES.HMIS_PUSH,
    RESOURCES.VIEW_REPORTS,
  ],
};

// ---------------------------------------------------------------------------
// 3. ROUTE_ROLE_MAP — maps URL path prefixes to the roles that may access them.
//    Used by middleware.ts to make route-level access decisions.
//    More specific paths should be listed first (longest-match wins).
// ---------------------------------------------------------------------------

export const ROUTE_ROLE_MAP: Array<{ pattern: RegExp; allowedRoles: Role[] }> = [
  // Admin-only routes (as per snippet requirements)
  {
    pattern: /^\/admin(\/.*)?$/,
    allowedRoles: ["ADMIN"],
  },
  // Nurse-only routes (Nurse + Admin register patients)
  {
    pattern: /^\/register(\/.*)?$/,
    allowedRoles: ["NURSE", "ADMIN"],
  },
  // Admin dashboard — ADMIN only
  {
    pattern: /^\/dashboard\/admin(\/.*)?$/,
    allowedRoles: ["ADMIN"],
  },
  // Nurse dashboard — NURSE and ADMIN
  {
    pattern: /^\/dashboard\/nurse(\/.*)?$/,
    allowedRoles: ["NURSE", "ADMIN"],
  },
  // CHW dashboard — CHW and ADMIN
  {
    pattern: /^\/dashboard\/chw(\/.*)?$/,
    allowedRoles: ["CHW", "ADMIN"],
  },
  // Mother dashboard — MOTHER only (ADMIN can view via admin panel)
  {
    pattern: /^\/dashboard\/mother(\/.*)?$/,
    allowedRoles: ["MOTHER", "ADMIN"],
  },
  // Generic /dashboard catch-all — any authenticated user
  {
    pattern: /^\/dashboard(\/.*)?$/,
    allowedRoles: ["MOTHER", "NURSE", "CHW", "ADMIN"],
  },
];
