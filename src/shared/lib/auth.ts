import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/shared/types/auth";

/* ── Normalize backend uppercase role → frontend lowercase role ── */
function normalizeRole(backendRole: string | undefined): UserRole {
  const map: Record<string, UserRole> = {
    HEALTH_WORKER:      "health_worker",
    FACILITY_ADMIN:     "facility_admin",
    DISTRICT_OFFICER:   "district_officer",
    GOVERNMENT_ANALYST: "government",
    MOH_ADMIN:          "government",
    PATIENT:            "patient",
  };
  return (backendRole && map[backendRole]) ? map[backendRole] : "patient";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://motherhoodjourneybackend-production.up.railway.app";

export const authOptions: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET ?? "motherhood-journey-secret-2026",

  providers: [
    CredentialsProvider({
      name: "Phone & Password",
      credentials: {
        phoneNumber: { label: "Phone", type: "tel" },
        password:    { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.password) return null;

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12_000);

          const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: credentials.phoneNumber,
              password:    credentials.password,
            }),
          });

          clearTimeout(timeout);

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.warn("[auth] login failed", res.status, body?.message);
            return null;
          }

          const body = await res.json();

          // Backend wraps in ApiResponse: { success, message, data: TokenResponse }
          const data = body?.data ?? body;

          if (!data?.accessToken) {
            console.warn("[auth] missing accessToken in response", body);
            return null;
          }

          return {
            id:           data.userId  ?? data.id  ?? "unknown",
            accessToken:  data.accessToken,
            refreshToken: data.refreshToken ?? null,
            role:         normalizeRole(data.role),
            facilityId:   data.facilityId   ?? null,
            geoScopeIds:  data.geoScopeIds  ?? [],
            canExport:    data.canExport    ?? false,
            canPushHmis:  data.canPushHmis  ?? false,
          };
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            console.error("[auth] login request timed out");
          } else {
            console.error("[auth] login error:", err);
          }
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken  = (user as Record<string,unknown>).accessToken  as string;
        token.refreshToken = (user as Record<string,unknown>).refreshToken as string | null;
        token.role         = (user as Record<string,unknown>).role         as string;
        token.facilityId   = (user as Record<string,unknown>).facilityId   as number | null;
        token.geoScopeIds  = (user as Record<string,unknown>).geoScopeIds  as number[];
        token.canExport    = (user as Record<string,unknown>).canExport    as boolean;
        token.canPushHmis  = (user as Record<string,unknown>).canPushHmis  as boolean;
        token.tokenIssuedAt = Date.now();
      }
      return token;
    },

    async session({ session, token }) {
      session.user.accessToken  = token.accessToken  as string | undefined;
      session.user.role         = token.role         as string | undefined;
      session.user.facilityId   = token.facilityId   as number | undefined;
      session.user.geoScopeIds  = token.geoScopeIds  as number[] | undefined;
      session.user.canExport    = token.canExport    as boolean | undefined;
      session.user.canPushHmis  = token.canPushHmis  as boolean | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
};
