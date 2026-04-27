"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
	AuthActionResult,
	AuthenticatedUser,
	RegisteredAccount,
	SignInPayload,
	SignUpPayload,
} from "@/shared/types/auth";

type AuthState = {
	accounts: RegisteredAccount[];
	currentUser: AuthenticatedUser | null;
	signUp: (payload: SignUpPayload) => AuthActionResult;
	signIn: (payload: SignInPayload) => AuthActionResult;
	logout: () => AuthActionResult;
};

const normalizePhone = (phone: string) => phone.trim();

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
