"use client";

/**
 * useRole.ts — Client-side hook that returns the current user's role.
 *
 * Wraps NextAuth's useSession() so that calling code never has to reach into
 * the raw session object. Returns undefined while the session is loading or
 * when the user is unauthenticated.
 *
 * Usage:
 *   const role = useRole();
 *   if (role === ROLES.ADMIN) { ... }
 */

import { useSession } from "next-auth/react";
import { type Role } from "@/shared/types/auth";

/**
 * Returns the authenticated user's role, or `undefined` if the session has
 * not yet loaded or the user is not signed in.
 */
export function useRole(): Role | undefined {
  const { data: session } = useSession();
  return session?.user?.role;
}
