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
