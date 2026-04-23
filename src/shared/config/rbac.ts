import type { UserRole } from "@/shared/types/auth";

export const ROLE_ROUTE_MAP: Record<UserRole, string[]> = {
  patient:          ["/dashboard", "/pregnancies", "/children", "/appointments"],
  health_worker:    ["/dashboard", "/mothers", "/visits", "/diagnoses"],
  facility_admin:   ["/dashboard", "/staff", "/reports"],
  district_officer: ["/dashboard", "/analytics"],
  government:       ["/dashboard", "/sync", "/reports"],
};

export type RoleNavItem = {
  href: string;
  label: string;
  shortLabel: string;
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

export const ROLE_NAV_ITEMS: Record<UserRole, RoleNavItem[]> = {
  patient: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/pregnancies", label: "Pregnancies", shortLabel: "Pregnancy" },
    { href: "/children", label: "Children", shortLabel: "Children" },
    { href: "/appointments", label: "Appointments", shortLabel: "Visits" },
  ],
  health_worker: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/mothers", label: "Mothers", shortLabel: "Mothers" },
    { href: "/visits", label: "Visits", shortLabel: "Visits" },
    { href: "/diagnoses", label: "Diagnoses", shortLabel: "Cases" },
  ],
  facility_admin: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/staff", label: "Staff", shortLabel: "Staff" },
    { href: "/reports", label: "Reports", shortLabel: "Reports" },
  ],
  district_officer: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/analytics", label: "Analytics", shortLabel: "Stats" },
  ],
  government: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/sync", label: "Sync", shortLabel: "Sync" },
    { href: "/reports", label: "Reports", shortLabel: "Reports" },
  ],
};
