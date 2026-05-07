"use client";

import { useMemo } from "react";

import {
  ROLE_LABELS,
  ROLE_NAV_ITEMS,
  ROLE_ORGANIZATION_LABELS,
  ROLE_ORGANIZATION_NAMES,
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

  const role =
    options?.previewRole ??
    currentUser?.role ??
    options?.fallbackRole ??
    "patient";

  return useMemo(() => {
    const roleLabel = ROLE_LABELS[role];
    const roleTheme = ROLE_THEMES[role];
    const phoneSuffix = currentUser?.phone?.slice(-4) ?? "0000";
    const displayName = currentUser?.phone
      ? `${roleLabel} ${phoneSuffix}`
      : `${roleLabel} User`;

    return {
      role,
      roleLabel,
      roleTheme,
      navItems: ROLE_NAV_ITEMS[role],
      displayName,
      organizationLabel: ROLE_ORGANIZATION_LABELS[role],
      organizationName: ROLE_ORGANIZATION_NAMES[role],
      currentUser,
      logout,
    };
  }, [currentUser, logout, role]);
}
