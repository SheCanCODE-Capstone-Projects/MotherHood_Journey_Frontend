"use client";

/**
 * useAuth.ts - Client-side auth convenience hooks for MotherHood Journey.
 *
 * These hooks are for UI gating only. Real authorization is enforced by
 * middleware and server-side handlers.
 */

import { useSession } from "next-auth/react";
import { canAccess } from "@/shared/lib/rbac";
import { type Resource } from "@/shared/config/rbac";
import { type AppUser } from "@/shared/types/auth";

/**
 * Returns true if the current session can access the given resource.
 * Returns false while loading or when unauthenticated.
 */
export function useCanAccess(resource: Resource): boolean {
  const { data: session } = useSession();
  return canAccess(session, resource);
}

/** Returns true when there is a valid authenticated session. */
export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession();
  return status === "authenticated" && !!session?.user;
}

/** Returns the full typed user object from the session when signed in. */
export function useAuthUser(): AppUser | undefined {
  const { data: session } = useSession();
  return session?.user ?? undefined;
}
