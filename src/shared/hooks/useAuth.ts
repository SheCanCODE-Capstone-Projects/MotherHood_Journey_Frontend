"use client";

/**
 * useAuth.ts - Client-side auth convenience hooks for MotherHood Journey.
 *
 * These hooks are for UI gating only. Real authorization is enforced by
 * middleware and server-side handlers.
 */

import { useSession } from "next-auth/react";
import { canAccess } from "@/shared/lib/rbac";
import { type Resource } from "@/shared/config/rbac";
import { type AppUser } from "@/shared/types/auth";

/**
 * Returns true if the current session can access the given resource.
 * Returns false while loading or when unauthenticated.
 */
export function useCanAccess(resource: Resource): boolean {
  const { data: session } = useSession();
  return canAccess(session, resource);
}

/** Returns true when there is a valid authenticated session. */
export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession();
  return status === "authenticated" && !!session?.user;
}

<<<<<<< HEAD:src/shared/hooks/useAuth.ts
export const useAuth = create<AuthState>()(
	persist(
		(set, get) => ({
			accounts: [],
			currentUser: null,
			signUp: ({ phone, password, role = "patient" }) => {
				const normalizedPhone = normalizePhone(phone);
				const accountExists = get().accounts.some(
					(account) => account.phone === normalizedPhone,
				);

				if (accountExists) {
					return { ok: false, errorKey: "login.accountExists" };
				}

				const nowIso = new Date().toISOString();

				set((state) => ({
					accounts: [
						...state.accounts,
						{
							phone: normalizedPhone,
							password,
							role,
							createdAt: nowIso,
						},
					],
					currentUser: {
						phone: normalizedPhone,
						role,
						loggedInAt: nowIso,
					},
				}));

				return { ok: true, messageKey: "login.accountCreated" };
			},
			signIn: ({ phone, password }) => {
				const normalizedPhone = normalizePhone(phone);
				const matchingAccount = get().accounts.find(
					(account) =>
						account.phone === normalizedPhone && account.password === password,
				);

				if (!matchingAccount) {
					return { ok: false, errorKey: "login.invalidCredentials" };
				}

				set({
					currentUser: {
						phone: normalizedPhone,
						role: matchingAccount.role,
						loggedInAt: new Date().toISOString(),
					},
				});

				return { ok: true, messageKey: "login.loggedInSuccess" };
			},
			logout: () => {
				set({ currentUser: null });
				return { ok: true, messageKey: "login.loggedOutSuccess" };
			},
		}),
		{
			name: "motherhood-auth-store",
		},
	),
);
=======
/** Returns the full typed user object from the session when signed in. */
export function useAuthUser(): AppUser | undefined {
  const { data: session } = useSession();
  return session?.user ?? undefined;
}
>>>>>>> roles:motherhood_journey/src/shared/hooks/useAuth.ts
