/**
 * src/auth.ts — NextAuth v5 (Auth.js) configuration for MotherHood Journey.
 *
 * Placed in src/ so the `@/auth` alias (which maps @/ → src/) resolves it
 * correctly in middleware.ts, API routes, and server components.
 *
 * Strategy: CredentialsProvider — users authenticate with email + password
 * against the MHJ backend API. The backend returns a user object; we embed
 * the role and facilityId into the NextAuth JWT token so they are available
 * in every session without an extra DB round-trip.
 *
 * See SRD §3.1 (FR-AUTH-01 → FR-AUTH-09) for auth requirements.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@/shared/types/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ── Session strategy ──────────────────────────────────────────────────────
  // JWT sessions embed the role in the token — no extra DB query per request.
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (SRD FR-AUTH-02)
  },

  // ── Pages ─────────────────────────────────────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/login", // auth errors redirect here with ?error=...
  },

  // ── Providers ─────────────────────────────────────────────────────────────
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Delegates credential verification to the MHJ backend REST API.
       * Returns a typed user object on success, or null on failure.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) return null; // 401 from backend → wrong credentials

          const data = await res.json();

          return {
            id: data.user.id as string,
            name: data.user.name as string,
            email: data.user.email as string,
            role: data.user.role as Role,
            facilityId: (data.user.facilityId as string | null) ?? null,
          };
        } catch {
          return null; // network error or unexpected backend response
        }
      },
    }),
  ],

  // ── Callbacks ─────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * `jwt` — runs whenever a JWT is created or updated.
     * Copies role + facilityId from the user object into the token so they
     * survive across requests without another DB lookup.
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.facilityId =
          (user as { facilityId?: string | null }).facilityId ?? null;
      }
      return token;
    },

    /**
     * `session` — runs whenever session data is requested.
     * Exposes role + facilityId on session.user for RBAC helpers and hooks.
     */
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as Role;
        session.user.facilityId = (token.facilityId as string | null) ?? null;
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});
