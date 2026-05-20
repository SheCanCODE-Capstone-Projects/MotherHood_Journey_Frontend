import type { UserRole } from "@/shared/types/auth";

export const ROLE_ROUTE_MAP: Record<UserRole, string[]> = {
  patient:          ["/dashboard", "/pregnancies", "/children", "/appointments", "/patient"],
  health_worker:    ["/dashboard", "/mothers", "/visits", "/diagnoses"],
  facility_admin:   ["/dashboard", "/service-requests", "/staff", "/reports"],
  district_officer: ["/dashboard", "/analytics"],
  government:       ["/dashboard", "/sync", "/sync-log", "/reports"],
};

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
    { href: "/patient/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/patient/pregnancies", label: "Pregnancies", shortLabel: "Pregnancy" },
    { href: "/patient/children", label: "Children", shortLabel: "Children" },
    { href: "/patient/appointments", label: "Appointments", shortLabel: "Visits" },
    { href: "/patient/chat", label: "Chat", shortLabel: "Chat" },
  ],
  health_worker: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/mothers", label: "Mothers", shortLabel: "Mothers" },
    { href: "/children", label: "Children", shortLabel: "Children" },
    { href: "/visits", label: "Visits", shortLabel: "Visits" },
    { href: "/diagnoses", label: "Diagnoses", shortLabel: "Cases" },
  ],
  facility_admin: [
    { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
    { href: "/service-requests", label: "Service Requests", shortLabel: "Requests" },
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
    { href: "/sync-log", label: "Sync Log", shortLabel: "Logs" },
    { href: "/reports", label: "Reports", shortLabel: "Reports" },
  ],
};
