/**
 * middleware.ts — Server-side RBAC enforcement for MotherHood Journey.
 *
 * This is the REAL security layer. Client-side hooks (useRole, useCanAccess)
 * only control what the user SEES — this middleware controls what they can
 * actually REACH. It runs on the Edge Runtime before every matched request.
 *
 * Logic:
 *   1. Public routes (login, register, password-reset) → always allow.
 *   2. No session → redirect to /login with a `callbackUrl` query param.
 *   3. Session exists but role is not permitted for this route → redirect to
 *      /403 (or /dashboard as a safe fallback).
 *   4. Session + permitted role → allow the request through.
 *
 * Route matching is driven by ROUTE_ROLE_MAP in shared/config/rbac.ts,
 * keeping the permission logic in one place (SRD §4.5 maintainability rule).
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./src/auth";
import { ROUTE_ROLE_MAP } from "@/shared/config/rbac";
import type { Role } from "@/shared/types/auth";

// ---------------------------------------------------------------------------
// Public paths — never require authentication
// ---------------------------------------------------------------------------

const PUBLIC_PATHS: RegExp[] = [
  /^\/login(\/.*)?$/,
  /^\/register(\/.*)?$/,
  /^\/password-reset(\/.*)?$/,
  /^\/api\/auth(\/.*)?$/, // NextAuth internal endpoints
  /^\/_next(\/.*)?$/,     // Next.js static assets
  /^\/favicon\.ico$/,
  /^\/public(\/.*)?$/,
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((pattern) => pattern.test(pathname));
}

// ---------------------------------------------------------------------------
// Role-to-route check
// ---------------------------------------------------------------------------

/**
 * Returns the set of allowed roles for a given pathname by testing it against
 * ROUTE_ROLE_MAP in order (first match wins — more specific patterns listed
 * first in the config array).
 *
 * Returns null when the path is not governed by the role map (open to all
 * authenticated users).
 */
function getAllowedRoles(pathname: string): Role[] | null {
  for (const { pattern, allowedRoles } of ROUTE_ROLE_MAP) {
    if (pattern.test(pathname)) {
      return allowedRoles;
    }
  }
  return null; // no restriction found — any authenticated user is fine
}

// ---------------------------------------------------------------------------
// Middleware handler
// ---------------------------------------------------------------------------

export default auth(function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;

  // ── 1. Always allow public paths ─────────────────────────────────────────
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ── 2. Check for active session ──────────────────────────────────────────
  // `req.auth` is injected by the NextAuth `auth()` wrapper.
  const session = (req as unknown as { auth: { user?: { role?: Role } } | null }).auth;

  if (!session?.user) {
    // Not authenticated → redirect to login, preserve intended destination.
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Check role authorisation ──────────────────────────────────────────
  const allowedRoles = getAllowedRoles(pathname);

  if (allowedRoles !== null) {
    const userRole = session.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // Authenticated but wrong role → send to 403 page.
      const forbiddenUrl = new URL("/403", req.url);
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // ── 4. All checks passed → proceed ───────────────────────────────────────
  return NextResponse.next();
});

// ---------------------------------------------------------------------------
// Matcher — tells Next.js which paths to run this middleware on.
// Excludes static files, images, and the NextAuth API route itself
// (already covered by PUBLIC_PATHS guard above as a safety belt).
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - Files in the /public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
