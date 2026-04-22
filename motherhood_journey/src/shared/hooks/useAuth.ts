"use client";

/**
 * useAuth.ts — Client-side auth convenience hooks for MotherHood Journey.
 *
 * Exports:
 *   useCanAccess(resource) → boolean
 *     Gate for conditional rendering. Returns true only when the current user's
 *     role has access to the given resource, false while loading or unauthenticated.
 *
 *   useIsAuthenticated() → boolean
 *     Quick check for whether a valid session is active.
 *
 *   useAuthUser() → AppUser | undefined
 *     Returns the full typed user object from the session.
 *
 * NOTE: These hooks control what the user SEES. The real security enforcement
 * is in middleware.ts which runs server-side on every protected request.
 *
 * Example — show the HMIS push button only for MOH_ADMIN (future v2 role):
 *   const canPush = useCanAccess(RESOURCES.HMIS_PUSH);
 *   if (!canPush) return null;
 *   return <button>Push to HMIS</button>;
 */

import { useSession } from "next-auth/react";
import { canAccess } from "@/shared/lib/rbac";
import { type Resource } from "@/shared/config/rbac";
import { type AppUser } from "@/shared/types/auth";

// ---------------------------------------------------------------------------
// useCanAccess
// ---------------------------------------------------------------------------

/**
 * Returns true if the currently signed-in user has access to `resource`.
 * Returns false while the session is loading, or when the user is unauthenticated.
 *
 * @param resource - A resource identifier from the RESOURCES constant.
 *
 * @example
 *   const canDownload = useCanAccess(RESOURCES.DOWNLOAD_BIRTH_CERT);
 *   return canDownload ? <DownloadButton /> : null;
 */
export function useCanAccess(resource: Resource): boolean {
  const { data: session } = useSession();
  return canAccess(session, resource);
}

// ---------------------------------------------------------------------------
// useIsAuthenticated
// ---------------------------------------------------------------------------

/**
 * Returns true when a valid, loaded session exists.
 * Returns false while loading or unauthenticated.
 */
export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession();
  return status === "authenticated" && !!session?.user;
}

// ---------------------------------------------------------------------------
// useAuthUser
// ---------------------------------------------------------------------------

/**
 * Returns the full typed AppUser from the session, or undefined if not signed in.
 * Prefer `useRole()` or `useCanAccess()` for specific checks; use this hook
 * only when you need multiple fields (e.g. id, facilityId) from the user object.
 */
export function useAuthUser(): AppUser | undefined {
  const { data: session } = useSession();
  return session?.user ?? undefined;
}
