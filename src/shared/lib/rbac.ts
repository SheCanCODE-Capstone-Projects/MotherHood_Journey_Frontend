/**
 * lib/rbac.ts — Pure RBAC helper functions for MotherHood Journey.
 *
 * These are framework-agnostic, side-effect-free functions that can be called
 * from anywhere: server components, API route handlers, middleware, or tests.
 *
 * NOTE: Client-side hooks (useRole, useCanAccess) live in shared/hooks/ and
 * wrap these helpers with the NextAuth useSession() hook. The actual security
 * enforcement lives in middleware.ts — these helpers are a convenience layer.
 *
 * Exports:
 *   hasRole(session, role): boolean
 *   canAccess(session, resource): boolean
 *   requireRole(session, role): void   — throws on failure (for API routes)
 *   requireAccess(session, resource): void
 */

import { type Session } from "next-auth";
import { PERMISSIONS, type Resource } from "@/shared/config/rbac";
import { type Role } from "@/shared/types/auth";

// ---------------------------------------------------------------------------
// hasRole
// ---------------------------------------------------------------------------

/**
 * Returns true if the session contains a user whose role matches the given role.
 *
 * @param session  - The NextAuth Session object (or null/undefined when
 *                   unauthenticated).
 * @param role     - The role string to test against (use the ROLES constant).
 *
 * @example
 *   // Server component
 *   const session = await auth();
 *   if (hasRole(session, ROLES.ADMIN)) { ... }
 */
export function hasRole(session: Session | null | undefined, role: Role): boolean {
  return session?.user?.role === role;
}

// ---------------------------------------------------------------------------
// canAccess
// ---------------------------------------------------------------------------

/**
 * Returns true if the session user's role grants access to the given resource.
 * Looks up the user's role in the PERMISSIONS ACL defined in config/rbac.ts.
 *
 * @param session  - The NextAuth Session object (or null/undefined).
 * @param resource - A resource identifier from the RESOURCES constant.
 *
 * @example
 *   // Conditional rendering in a server component
 *   const session = await auth();
 *   const canPush = canAccess(session, RESOURCES.HMIS_PUSH);
 */
export function canAccess(
  session: Session | null | undefined,
  resource: Resource
): boolean {
  const role = session?.user?.role;
  if (!role) return false;
  return PERMISSIONS[role]?.includes(resource) ?? false;
}

// ---------------------------------------------------------------------------
// requireRole  — use in API route handlers / server actions
// ---------------------------------------------------------------------------

/**
 * Throws a descriptive error if the session user does NOT have the required
 * role. Use this at the top of API route handlers to guard endpoints.
 *
 * @throws {Error} with status hint when role check fails.
 *
 * @example
 *   // app/api/admin/users/route.ts
 *   const session = await auth();
 *   requireRole(session, ROLES.ADMIN); // throws → caught by Next.js error boundary
 */
export function requireRole(
  session: Session | null | undefined,
  role: Role
): void {
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED: No active session.");
  }
  if (!hasRole(session, role)) {
    throw new Error(
      `FORBIDDEN: Role '${session.user.role}' does not satisfy required role '${role}'.`
    );
  }
}

// ---------------------------------------------------------------------------
// requireAccess  — use in API route handlers / server actions
// ---------------------------------------------------------------------------

/**
 * Throws a descriptive error if the session user does NOT have access to the
 * requested resource. Use alongside `requireRole` for fine-grained API guards.
 *
 * @throws {Error} with status hint when permission check fails.
 *
 * @example
 *   // app/api/documents/birth-cert/route.ts
 *   const session = await auth();
 *   requireAccess(session, RESOURCES.DOWNLOAD_BIRTH_CERT);
 */
export function requireAccess(
  session: Session | null | undefined,
  resource: Resource
): void {
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED: No active session.");
  }
  if (!canAccess(session, resource)) {
    throw new Error(
      `FORBIDDEN: Role '${session.user.role}' does not have access to resource '${resource}'.`
    );
  }
}
