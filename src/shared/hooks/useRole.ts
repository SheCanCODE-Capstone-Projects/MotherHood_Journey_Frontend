"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

import {
  ROLE_LABELS,
  ROLE_NAV_ITEMS,
  ROLE_ORGANIZATION_LABELS,
  ROLE_THEMES,
} from "@/shared/config/rbac";
import { useAuth } from "@/shared/hooks/useAuth";
import type { UserRole } from "@/shared/types/auth";

type UseRoleOptions = {
  fallbackRole?: UserRole;
  previewRole?: UserRole;
};

export function useRole(options?: UseRoleOptions) {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const { data: session } = useSession();

  // Priority: previewRole > session role (already normalized) > zustand role > fallbackRole
  const sessionRole = session?.user?.role as UserRole | undefined;

  const role = (
    options?.previewRole ??
    sessionRole ??
    (currentUser?.role as UserRole | undefined) ??
    options?.fallbackRole ??
    "patient"
  ) as UserRole;

  return useMemo(() => {
    const roleLabel = ROLE_LABELS[role];
    const roleTheme = ROLE_THEMES[role];

    // Display name: prefer session name/phone, fallback to role label
    const sessionUser = session?.user as Record<string, unknown> | undefined;
    const firstName = sessionUser?.firstName as string | undefined;
    const lastName  = sessionUser?.lastName  as string | undefined;
    const phone     = sessionUser?.phone     as string | undefined;

    let displayName: string;
    if (firstName && lastName) {
      displayName = `${firstName} ${lastName}`;
    } else if (firstName) {
      displayName = firstName;
    } else if (phone) {
      displayName = `${roleLabel} ${phone.slice(-4)}`;
    } else if (currentUser?.phone) {
      displayName = `${roleLabel} ${currentUser.phone.slice(-4)}`;
    } else {
      displayName = `${roleLabel} User`;
    }

    // Organization: prefer session facility name, fall back to generic label
    const facilityName = sessionUser?.facilityName as string | undefined;
    const organizationName = facilityName ?? "Motherhood Journey";
    const organizationLabel = ROLE_ORGANIZATION_LABELS[role];

    return {
      role,
      roleLabel,
      roleTheme,
      navItems: ROLE_NAV_ITEMS[role],
      displayName,
      organizationLabel,
      organizationName,
      currentUser,
      logout,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, logout, role, session]);
}
