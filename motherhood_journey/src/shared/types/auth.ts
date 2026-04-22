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

export type SignInPayload = {
	phone: string;
	password: string;
};

export type SignUpPayload = SignInPayload;

export type RegisteredAccount = {
	phone: string;
	password: string;
	createdAt: string;
};

export type AuthenticatedUser = {
	phone: string;
	loggedInAt: string;
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
