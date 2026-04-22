export const USER_ROLES = [
	"patient",
	"health_worker",
	"facility_admin",
	"district_officer",
	"government",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

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
