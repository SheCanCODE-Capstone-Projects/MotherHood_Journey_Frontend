import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** JWT access token returned by the backend */
    accessToken?: string;
    /** JWT refresh token */
    refreshToken?: string | null;
    /** Backend role: HEALTH_WORKER, FACILITY_ADMIN, DISTRICT_OFFICER, GOVERNMENT_ANALYST, MOH_ADMIN */
    role?: string;
    facilityId?: number | null;
    geoScopeIds?: number[];
    canExport?: boolean;
    canPushHmis?: boolean;
    /** Timestamp when token was issued (ms) */
    tokenIssuedAt?: number;
  }

  interface Session {
    user: {
      accessToken?: string;
      role?: string;
      facilityId?: number | null;
      geoScopeIds?: number[];
      canExport?: boolean;
      canPushHmis?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string | null;
    role?: string;
    facilityId?: number | null;
    geoScopeIds?: number[];
    canExport?: boolean;
    canPushHmis?: boolean;
    tokenIssuedAt?: number;
  }
}

export type UserRole = "patient" | "health_worker" | "facility_admin" | "district_officer" | "government";
export type Role = UserRole;
export type SignInPayload = {
	phone: string;
	password: string;
};

export type SignUpPayload = SignInPayload & {
	role?: UserRole;
};

export type RegisteredAccount = {
	phone: string;
	password: string;
	role: UserRole;
	createdAt: string;
};

export type AuthenticatedUser = {
	phone: string;
	role: UserRole;
	loggedInAt: string;
};

export type AuthTokenClaims = {
	role?: UserRole;
	phone?: string;
};

export type AuthSessionUser = {
	phone: string;
	role: UserRole;
};

export type AuthSuccessResult = {
	ok: true;
	messageKey: string;
};

export type AuthErrorResult = {
	ok: false;
	errorKey: string;
};

export type AuthActionResult = AuthSuccessResult | AuthErrorResult;
