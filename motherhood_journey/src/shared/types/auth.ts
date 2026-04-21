import "next-auth";

declare module "next-auth" {
  interface User {
    token?: string;
    role?: string;
    facilityId?: number;
    geoScopeIds?: number[];
    canExport?: boolean;
    canPushHmis?: boolean;
  }
}