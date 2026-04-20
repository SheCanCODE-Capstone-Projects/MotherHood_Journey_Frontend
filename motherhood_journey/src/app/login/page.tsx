"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import "@/lib/i18n";

const signInSchema = z.object({
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
  const [mode, setMode] = useState<AuthMode>("signin");
  const [formData, setFormData] = useState<LoginForm>({
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [showLanguageNotice, setShowLanguageNotice] = useState(true);

  const activeLanguage = useMemo<LanguageCode>(() => {
    const code = i18n.language?.slice(0, 2) as LanguageCode | undefined;
    return code === "rw" || code === "fr" ? code : "en";
  }, [i18n.language]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setHasSubmitError(false);
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
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = mode === "signup" ? signUpSchema : signInSchema;
    const payload =
      mode === "signup"
        ? formData
        : { phone: formData.phone, password: formData.password };
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
      return;
    }

    setErrors({});
    setHasSubmitError(false);
  };

  const changeLanguage = (language: LanguageCode) => {
    void i18n.changeLanguage(language);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(58,143,133,0.22),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(42,127,138,0.24),transparent_45%),linear-gradient(140deg,#2F7F7A_0%,#2A7F8A_45%,#3A8F85_100%)] opacity-95" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-md rounded-3xl border border-white/60 bg-white/92 p-7 shadow-[0_20px_55px_-25px_rgba(34,122,127,0.7)] backdrop-blur-sm sm:p-9">
          {showLanguageNotice && (
            <div className="mb-5 rounded-2xl border border-[#A9D6D3] bg-[#E7F7F5] p-3 text-sm text-[#1D5052]">
              <div className="flex items-start justify-between gap-3">
                <p>
                  <span className="font-semibold">{t("login.languageNotice")}</span>{" "}
                  {languageOptions.map((option) => option.label).join(", ")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowLanguageNotice(false)}
                  className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#2C6F73]"
                >
                  x
                </button>
              </div>
            </div>
          )}

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-[#1D5052]">
              {t("login.title")}
            </h1>
            <div
              className="inline-flex rounded-full bg-[#E4F4F1] p-1"
              role="group"
              aria-label="Language switcher"
            >
              {languageOptions.map((option) => {
                const isActive = activeLanguage === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => changeLanguage(option.code)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? "bg-[#2C6F73] text-white shadow"
                        : "text-[#2C6F73] hover:bg-[#D1ECE8]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#E4F4F1] p-1">
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
                className={`w-full rounded-xl border px-3 py-2.5 text-[#124548] transition outline-none ${
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
                className={`w-full rounded-xl border px-3 py-2.5 text-[#124548] transition outline-none ${
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
                  className={`w-full rounded-xl border px-3 py-2.5 text-[#124548] transition outline-none ${
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
              className="w-full rounded-xl bg-linear-to-r from-[#2F7F7A] via-[#2C6F73] to-[#2A7F8A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_-12px_rgba(42,127,138,0.95)] transition hover:brightness-105"
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
              {mode === "signin" ? t("login.switchToSignUp") : t("login.switchToSignIn")}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
