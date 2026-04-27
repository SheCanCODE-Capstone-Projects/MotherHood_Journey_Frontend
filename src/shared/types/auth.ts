import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    token?: string;
    role?: string;
    facilityId?: number;
    geoScopeIds?: number[];
    canExport?: boolean;
    canPushHmis?: boolean;
  }

  interface Session {
    user: {
      accessToken?: string;
      role?: string;
      facilityId?: number;
      geoScopeIds?: number[];
      canExport?: boolean;
      canPushHmis?: boolean;
    } & DefaultSession["user"];
  }

  interface UserRole {
    role : string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    facilityId?: number;
    geoScopeIds?: number[];
    canExport?: boolean;
    canPushHmis?: boolean;
  }
}

export type UserRole = "patient" | "health_worker" | "facility_admin" | "district_officer" | "government";
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
