import type { UserRole } from "@/shared/types/auth";

export const ROLE_ROUTE_MAP: Record<UserRole, string[]> = {
  patient:          ["/dashboard", "/pregnancies", "/children", "/appointments"],
  health_worker:    ["/dashboard", "/mothers", "/visits", "/diagnoses"],
  facility_admin:   ["/dashboard", "/staff", "/reports"],
  district_officer: ["/dashboard", "/analytics"],
  government:       ["/dashboard", "/sync", "/reports"],
};
