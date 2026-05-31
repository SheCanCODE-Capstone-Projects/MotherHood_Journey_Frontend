import type { UserRole } from "@/shared/types/auth";

export type Resource = 
  | "HMIS_PUSH" 
  | "DOWNLOAD_BIRTH_CERT" 
  | "MANAGE_USERS" 
  | "VIEW_REPORTS"
  | "EDIT_PATIENT";

export const PERMISSIONS: Record<UserRole, Resource[]> = {
  patient: ["DOWNLOAD_BIRTH_CERT"],
  health_worker: ["EDIT_PATIENT"],
  facility_admin: ["MANAGE_USERS", "VIEW_REPORTS"],
  district_officer: ["VIEW_REPORTS"],
  government: ["HMIS_PUSH", "VIEW_REPORTS"],
};

export const ROLE_ROUTE_MAP: Record<UserRole, string[]> = {
<<<<<<< HEAD
  patient:          ["/dashboard", "/pregnancies", "/my-children", "/appointments", "/consent", "/documents"],
  health_worker:    ["/hw-dashboard", "/mothers", "/children", "/visits", "/diagnoses", "/vaccinations"],
  facility_admin:   ["/facility-dashboard", "/schedule", "/service-requests", "/staff", "/reports"],
  district_officer: ["/district-dashboard", "/facilities", "/analytics"],
  government:       ["/national-dashboard", "/national-reports", "/sync-log", "/users"],
=======
  patient:          ["/dashboard", "/pregnancies", "/children", "/appointments", "/patient"],
  health_worker:    ["/dashboard", "/mothers", "/visits", "/diagnoses"],
  facility_admin:   ["/dashboard", "/service-requests", "/staff", "/reports"],
  district_officer: ["/dashboard", "/analytics"],
  government:       ["/dashboard", "/sync", "/sync-log", "/reports"],
>>>>>>> main
};

// Backwards-compatible ROUTE_ROLE_MAP used by the middleware. The middleware
// expects an array of `{ pattern: RegExp, allowedRoles: Role[] }` entries.
// Build a simple map from the `ROLE_ROUTE_MAP` record so existing middleware
// that iterates `for (const { pattern, allowedRoles } of ROUTE_ROLE_MAP)`
// continues to work.
export const ROUTE_ROLE_MAP: { pattern: RegExp; allowedRoles: UserRole[] }[] =
  Object.entries(ROLE_ROUTE_MAP).flatMap(([role, paths]) =>
    paths.map((p) => ({ pattern: new RegExp(`^${p}(\\/.*)?$`), allowedRoles: [role as UserRole] }))
  );

export type RoleNavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export type RoleTheme = {
  accent: string;
  accentSoft: string;
  border: string;
  text: string;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  patient: "Patient",
  health_worker: "Health Worker",
  facility_admin: "Facility Admin",
  district_officer: "District Officer",
  government: "Government",
};

export const ROLE_ORGANIZATION_LABELS: Record<UserRole, string> = {
  patient: "Assigned Facility",
  health_worker: "Health Facility",
  facility_admin: "Facility",
  district_officer: "District Office",
  government: "Ministry",
};

export const ROLE_ORGANIZATION_NAMES: Record<UserRole, string> = {
  patient: "Nyamata Health Center",
  health_worker: "Nyamata Health Center",
  facility_admin: "Nyamata District Hospital",
  district_officer: "Bugesera District Health Office",
  government: "Ministry of Health",
};

export const ROLE_THEMES: Record<UserRole, RoleTheme> = {
  patient: {
    accent: "#2C6F73",
    accentSoft: "#E1F2EF",
    border: "#D0E8E4",
    text: "#1C4F53",
  },
  health_worker: {
    accent: "#2A7F8A",
    accentSoft: "#E1F3F6",
    border: "#CCE6EB",
    text: "#1B5360",
  },
  facility_admin: {
    accent: "#2F7F7A",
    accentSoft: "#E4F4F1",
    border: "#CEE6E1",
    text: "#1D5551",
  },
  district_officer: {
    accent: "#3A8F85",
    accentSoft: "#E8F6F3",
    border: "#CFE8E3",
    text: "#215C57",
  },
  government: {
    accent: "#1F7280",
    accentSoft: "#E2F2F5",
    border: "#CFE3E9",
    text: "#194D56",
  },
};

export const ROLE_NAV_ITEMS: Record<UserRole, RoleNavItem[]> = {
  patient: [
<<<<<<< HEAD
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/pregnancies", label: "Pregnancies", shortLabel: "Pregnancy" },
    { href: "/my-children", label: "Children", shortLabel: "Children" },
    { href: "/appointments", label: "Appointments", shortLabel: "Visits" },
    { href: "/consent", label: "Consent", shortLabel: "Consent" },
    { href: "/documents", label: "Documents", shortLabel: "Docs" },
  ],
  health_worker: [
    { href: "/hw-dashboard", label: "Dashboard", shortLabel: "Home" },
=======
    { href: "/patient/dashboard", label: "Home", shortLabel: "Home" },
    { href: "/patient/pregnancies", label: "My Records", shortLabel: "Records" },
    { href: "/patient/children", label: "Team Care", shortLabel: "Care" },
    { href: "/patient/appointments", label: "Appointments", shortLabel: "Visits" },
    { href: "/patient/chat", label: "Chat", shortLabel: "Chat" },
    { href: "/tips", label: "Tips", shortLabel: "Tips" },
  ],
  health_worker: [
>>>>>>> main
    { href: "/mothers", label: "Mothers", shortLabel: "Mothers" },
    { href: "/children", label: "Children", shortLabel: "Children" },
    { href: "/visits", label: "Visits", shortLabel: "Visits" },
    { href: "/diagnoses", label: "Diagnoses", shortLabel: "Cases" },
    { href: "/vaccinations", label: "Vaccinations", shortLabel: "Vaccines" },
  ],
  facility_admin: [
<<<<<<< HEAD
    { href: "/facility-dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/schedule", label: "Schedule", shortLabel: "Calendar" },
=======
>>>>>>> main
    { href: "/service-requests", label: "Service Requests", shortLabel: "Requests" },
    { href: "/staff", label: "Staff", shortLabel: "Staff" },
    { href: "/reports", label: "Reports", shortLabel: "Reports" },
  ],
  district_officer: [
<<<<<<< HEAD
    { href: "/district-dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/facilities", label: "Facilities", shortLabel: "Sites" },
    { href: "/analytics", label: "Analytics", shortLabel: "Stats" },
  ],
  government: [
    { href: "/national-dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/national-reports", label: "Reports", shortLabel: "Reports" },
=======
    { href: "/analytics", label: "Analytics", shortLabel: "Stats" },
  ],
  government: [
    { href: "/sync", label: "Sync", shortLabel: "Sync" },
>>>>>>> main
    { href: "/sync-log", label: "Sync Log", shortLabel: "Logs" },
    { href: "/users", label: "Users", shortLabel: "Users" },
  ],
};

