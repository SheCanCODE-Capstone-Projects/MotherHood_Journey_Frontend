import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { ROLE_ROUTE_MAP } from "@/shared/config/rbac";
import type { UserRole } from "@/shared/types/auth";

type ProtectedRouteMatch = {
  path: string;
  roles: UserRole[];
};

/* Build a path → allowed-roles lookup from ROLE_ROUTE_MAP */
const PROTECTED_ROUTES = Object.entries(ROLE_ROUTE_MAP).reduce<
  Record<string, UserRole[]>
>((acc, [role, paths]) => {
  for (const path of paths) {
    const current = acc[path] ?? [];
    current.push(role as UserRole);
    acc[path] = current;
  }
  return acc;
}, {});

/* Sort longest path first so more-specific routes win */
const PROTECTED_ROUTE_MATCHES: ProtectedRouteMatch[] = Object.entries(
  PROTECTED_ROUTES,
)
  .map(([path, roles]) => ({ path, roles }))
  .sort((a, b) => b.path.length - a.path.length);

/* Public paths that NEVER require auth */
const PUBLIC_PATHS = ["/", "/login", "/signup", "/unauthorized", "/api"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip middleware for public paths and Next.js internals
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const match = getProtectedRoute(pathname);

  // Route not in the protected list → allow
  if (!match) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? "motherhood-journey-secret-2026",
  });

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as UserRole | undefined;

  // Authenticated but wrong role → unauthorized
  if (!userRole || !match.roles.includes(userRole)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

function getProtectedRoute(pathname: string): ProtectedRouteMatch | null {
  for (const route of PROTECTED_ROUTE_MATCHES) {
    if (
      pathname === route.path ||
      pathname.startsWith(`${route.path}/`)
    ) {
      return route;
    }
  }
  return null;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static, _next/image, favicon.ico, public files
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
