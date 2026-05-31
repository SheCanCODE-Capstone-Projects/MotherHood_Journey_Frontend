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
    <main className="relative min-h-screen overflow-hidden bg-[#F4F8F7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(93,202,165,0.18),transparent_36%),linear-gradient(180deg,#F9FCFB_0%,#EEF6F4_100%)]" />

      <aside className="absolute right-4 top-4 z-20 w-[min(90vw,18rem)] sm:right-6 sm:top-6">
        <div className="rounded-[8px] border border-[#D5E7E4] bg-white p-3 text-sm text-[#1D5052] shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{t("login.languageNotice")}</p>
              <p className="text-xs text-[#4E7575]">{t("login.languageMenuHint")}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowLanguageMenu((previous) => !previous)}
              className="rounded-[8px] bg-[#EAF4F2] px-3 py-1 text-xs font-semibold text-[#2C6F73]"
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
                        : "bg-[#F7FBFA] text-[#2C6F73] hover:bg-[#D1ECE8]"
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

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden rounded-[8px] border border-[#D5E7E4] bg-white p-7 shadow-sm lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
            Government gateway
          </p>
          <h1 className="mt-4 max-w-sm text-4xl font-semibold tracking-tight text-[#153F42]">
            National Infrastructure Overview
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#54797C]">
            Secure maternal health access for government teams, facilities, health workers, and patient care journeys.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["30", "98%", "Tier 1"].map((value, index) => (
              <div key={value} className="rounded-[8px] border border-[#E4EFED] bg-[#F7FBFA] p-4">
                <p className="text-2xl font-semibold text-[#153F42]">{value}</p>
                <p className="mt-1 text-xs text-[#6D8587]">{["Districts", "Sync", "Security"][index]}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[8px] bg-[#064F56] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">Command center</p>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Review national reports, sync health records, and audit consent activity from one controlled access point.
            </p>
          </div>
        </section>

        <section className="w-full max-w-md justify-self-center rounded-[8px] border border-[#D5E7E4] bg-white p-7 shadow-[0_20px_55px_-35px_rgba(34,122,127,0.45)] sm:p-9">
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
            <div className="space-y-4 rounded-[8px] border border-[#B4DDD9] bg-[#E7F7F5] p-5 text-[#1D5052]">
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
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-[8px] bg-[#E4F4F1] p-1">
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
