"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import "@/lib/i18n";
import { useAuth } from "@/shared/hooks/useAuth";

const signInSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+250\d{9}$/, "Phone number must be in format +250XXXXXXXXX"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = signInSchema
  .extend({
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type LoginForm = {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type LanguageCode = "rw" | "en" | "fr";
type AuthMode = "signin" | "signup";

const languageOptions: Array<{ code: LanguageCode; label: string }> = [
  { code: "rw", label: "Kinyarwanda" },
  { code: "en", label: "English" },
  { code: "fr", label: "Francais" },
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { currentUser, signIn, signUp, logout } = useAuth();
  const [mode, setMode] = useState<AuthMode>(() => {
    if (typeof window === "undefined") {
      return "signin";
    }

    const requestedMode = new URLSearchParams(window.location.search).get("mode");
    return requestedMode === "signup" || requestedMode === "signin" ? requestedMode : "signin";
  });
  const [formData, setFormData] = useState<LoginForm>({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    key: string;
  } | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const activeLanguage = useMemo<LanguageCode>(() => {
    const code = i18n.language?.slice(0, 2) as LanguageCode | undefined;
    return code === "rw" || code === "fr" ? code : "en";
  }, [i18n.language]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setHasSubmitError(false);
    setStatus(null);
  };

  const setRoleCookie = (role: string) => {
    document.cookie = `mh_role=${encodeURIComponent(role)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  };

  const onChangeField = (field: keyof LoginForm, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));

    if (errors[field]) {
      setErrors((previous) => {
        const copy = { ...previous };
        delete copy[field];
        return copy;
      });
    }

    if (hasSubmitError) {
      setHasSubmitError(false);
    }

    if (status) {
      setStatus(null);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = mode === "signup" ? signUpSchema : signInSchema;
    const payload =
      mode === "signup"
        ? formData
        : {
            fullName: formData.fullName,
            phone: formData.phone,
            password: formData.password,
          };
    const result = schema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginForm;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setHasSubmitError(true);
      setStatus(null);
      return;
    }

    const authResult =
      mode === "signup"
        ? signUp({ phone: formData.phone, password: formData.password })
        : signIn({ phone: formData.phone, password: formData.password });

    if (!authResult.ok) {
      setStatus({ tone: "error", key: authResult.errorKey });
      return;
    }

    const signedInRole = useAuth.getState().currentUser?.role;
    if (signedInRole) {
      setRoleCookie(signedInRole);
    }

    setErrors({});
    setHasSubmitError(false);
    setFormData({
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setStatus({ tone: "success", key: authResult.messageKey });
  };

  const onLogout = () => {
    const result = logout();
    document.cookie = "mh_role=; Path=/; Max-Age=0; SameSite=Lax";
    if (result.ok) {
      setStatus({ tone: "success", key: result.messageKey });
    }
  };

  const changeLanguage = (language: LanguageCode) => {
    void i18n.changeLanguage(language);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF5F3]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.9),transparent_18%),radial-gradient(circle_at_85%_20%,rgba(235,248,246,0.95),transparent_22%),radial-gradient(circle_at_25%_82%,rgba(187,220,215,0.6),transparent_24%),linear-gradient(135deg,#F7FBFA_0%,#EEF8F6_35%,#DCEDEB_100%)]">
        <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#BCE0DB]/35 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-[#7FB7B1]/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-[#2C6F73]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.55)_0%,transparent_38%,rgba(255,255,255,0.12)_100%)]" />
      </div>

      <aside className="absolute right-4 top-4 z-20 w-[min(90vw,18rem)] sm:right-6 sm:top-6">
        <div className="rounded-2xl border border-white/30 bg-white/12 p-3 text-sm text-[#1D5052] shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{t("login.languageNotice")}</p>
              <p className="text-xs text-[#4E7575]">{t("login.languageMenuHint")}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowLanguageMenu((previous) => !previous)}
              className="rounded-full bg-[#2C6F73] px-3 py-1 text-xs font-semibold text-white shadow-sm"
            >
              {activeLanguage.toUpperCase()}
            </button>
          </div>

          {showLanguageMenu && (
            <div
              className="mt-3 grid grid-cols-1 gap-2"
              role="group"
              aria-label="Language switcher"
            >
              {languageOptions.map((option) => {
                const isActive = activeLanguage === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      changeLanguage(option.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`rounded-xl px-3 py-2 text-left text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? "bg-[#2C6F73] text-white shadow"
                        : "bg-[#F5FBFA] text-[#2C6F73] hover:bg-[#D1ECE8]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="z-10 w-full max-w-md rounded-3xl border border-white/25 bg-white/12 p-7 shadow-[0_22px_60px_-28px_rgba(34,122,127,0.28)] backdrop-blur-md sm:p-9">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
              Secure Access
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1D5052]">
              {t("login.title")}
            </h1>
          </div>

          {status && (
            <p
              className={`mb-5 rounded-lg border px-3 py-2 text-sm ${
                status.tone === "success"
                  ? "border-[#B4DDD9] bg-[#E7F7F5] text-[#1F585B]"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {t(status.key, { phone: currentUser?.phone ?? formData.phone })}
            </p>
          )}

          {currentUser ? (
            <div className="space-y-4 rounded-2xl border border-white/25 bg-white/12 p-5 text-[#1D5052] backdrop-blur-sm">
              <p className="text-sm font-medium">
                {t("login.loggedInAs", { phone: currentUser.phone })}
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-[8px] bg-[#064F56] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_-12px_rgba(42,127,138,0.75)] transition hover:brightness-105"
              >
                {t("login.logout")}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    mode === "signin"
                      ? "bg-[#2C6F73] text-white shadow"
                      : "text-[#2C6F73] hover:bg-[#D1ECE8]"
                  }`}
                >
                  {t("login.signInTab")}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-[#2C6F73] text-white shadow"
                      : "text-[#2C6F73] hover:bg-[#D1ECE8]"
                  }`}
                >
                  {t("login.signUpTab")}
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-[#1D5052]"
                >
                  {t("login.fullName")}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => onChangeField("fullName", event.target.value)}
                  placeholder="Jane Doe"
                  className={`w-full rounded-xl border border-white/35 bg-white/12 px-3 py-2.5 text-[#124548] placeholder:text-[#5C7D7D] transition outline-none backdrop-blur-sm ${
                    errors.fullName
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-[#BBDCD7] focus:border-[#2A7F8A] focus:ring-2 focus:ring-[#B8E2DE]"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-[#1D5052]"
                >
                  {t("login.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => onChangeField("phone", event.target.value)}
                  placeholder="+250700000000"
                  className={`w-full rounded-xl border border-white/35 bg-white/12 px-3 py-2.5 text-[#124548] placeholder:text-[#5C7D7D] transition outline-none backdrop-blur-sm ${
                    errors.phone
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-[#BBDCD7] focus:border-[#2A7F8A] focus:ring-2 focus:ring-[#B8E2DE]"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#1D5052]"
                >
                  {t("login.password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => onChangeField("password", event.target.value)}
                  className={`w-full rounded-xl border border-white/35 bg-white/12 px-3 py-2.5 text-[#124548] placeholder:text-[#5C7D7D] transition outline-none backdrop-blur-sm ${
                    errors.password
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-[#BBDCD7] focus:border-[#2A7F8A] focus:ring-2 focus:ring-[#B8E2DE]"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-[#1D5052]"
                  >
                    {t("login.confirmPassword")}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      onChangeField("confirmPassword", event.target.value)
                    }
                    className={`w-full rounded-xl border border-white/35 bg-white/12 px-3 py-2.5 text-[#124548] placeholder:text-[#5C7D7D] transition outline-none backdrop-blur-sm ${
                      errors.confirmPassword
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-[#BBDCD7] focus:border-[#2A7F8A] focus:ring-2 focus:ring-[#B8E2DE]"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {hasSubmitError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {t("login.error")}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-[8px] bg-[#064F56] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_-12px_rgba(42,127,138,0.75)] transition hover:brightness-105"
              >
                {mode === "signup" ? t("login.submitSignUp") : t("login.submitSignIn")}
              </button>

              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "signin" ? "signup" : "signin")
                }
                className="w-full text-sm font-medium text-[#1D5052] underline underline-offset-2"
              >
                {mode === "signin"
                  ? t("login.switchToSignUp")
                  : t("login.switchToSignIn")}
              </button>
            </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
