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