"use client";

import { useSession } from "next-auth/react";
import type { UserRole } from "@/shared/types/auth";

const BACKEND_TO_FRONTEND_ROLE: Record<string, UserRole> = {
  MOH_ADMIN:          "government",
  DISTRICT_OFFICER:   "district_officer",
  FACILITY_ADMIN:     "facility_admin",
  HEALTH_WORKER:      "health_worker",
  MOTHER:             "patient",
  PATIENT:            "patient",
  // lowercase variants
  moh_admin:          "government",
  district_officer:   "district_officer",
  facility_admin:     "facility_admin",
  health_worker:      "health_worker",
  mother:             "patient",
  patient:            "patient",
};

export function useSessionRole(): UserRole | null {
  const { data: session } = useSession();
  if (!session?.user?.role) return null;
  return BACKEND_TO_FRONTEND_ROLE[session.user.role as string] ?? "patient";
}

export function useSessionUser() {
  const { data: session, status } = useSession();
  const frontendRole = useSessionRole();

  return {
    isAuthenticated: status === "authenticated" && !!session?.user,
    isLoading: status === "loading",
    role: frontendRole,
    backendRole: (session?.user?.role as string) ?? null,
    displayName: session?.user?.name ?? session?.user?.email ?? null,
    facilityId: (session?.user as Record<string, unknown>)?.facilityId as string | null ?? null,
    userId: (session?.user as Record<string, unknown>)?.id as string | null ?? null,
    session,
  };
}
