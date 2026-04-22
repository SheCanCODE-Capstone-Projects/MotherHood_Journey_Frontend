import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { ROLE_ROUTE_MAP } from "@/shared/config/rbac";
import type { UserRole } from "@/shared/types/auth";

type ProtectedRouteMatch = {
  path: string;
  roles: UserRole[];
};

const PROTECTED_ROUTES = Object.entries(ROLE_ROUTE_MAP).reduce<
  Record<string, UserRole[]>
>((accumulator, [role, paths]) => {
  for (const path of paths) {
    const currentRoles = accumulator[path] ?? [];
    currentRoles.push(role as UserRole);
    accumulator[path] = currentRoles;
  }

  return accumulator;
}, {});

const PROTECTED_ROUTE_MATCHES: ProtectedRouteMatch[] = Object.entries(PROTECTED_ROUTES)
  .map(([path, roles]) => ({ path, roles }))
  .sort((left, right) => right.path.length - left.path.length);

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const match = getProtectedRoute(pathname);

  if (!match) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as UserRole | undefined;

  if (!userRole || !match.roles.includes(userRole)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

function getProtectedRoute(pathname: string): ProtectedRouteMatch | null {
  for (const route of PROTECTED_ROUTE_MATCHES) {
    if (matchesPath(pathname, route.path)) {
      return route;
    }
  }

  return null;
}

function matchesPath(pathname: string, protectedPath: string) {
  return pathname === protectedPath || pathname.startsWith(`${protectedPath}/`);
}

export const config = {
  // Next.js route groups like `(patient)` are filesystem-only and do not
  // appear in the request pathname, so the matcher must target the real URL paths.
  matcher: [
    "/dashboard/:path*",
    "/pregnancies/:path*",
    "/children/:path*",
    "/appointments/:path*",
    "/mothers/:path*",
    "/visits/:path*",
    "/diagnoses/:path*",
    "/staff/:path*",
    "/reports/:path*",
    "/analytics/:path*",
    "/sync/:path*",
  ],
};
