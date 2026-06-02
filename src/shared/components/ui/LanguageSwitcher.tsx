"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

const LANGUAGES = [
  { code: "en", label: "EN", full: "English" },
  { code: "fr", label: "FR", full: "Français" },
  { code: "rw", label: "RW", full: "Kinyarwanda" },
] as const;

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pills" | "minimal";
}

export default function LanguageSwitcher({ className, variant = "pills" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) ?? "en";

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Select language">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            aria-pressed={current === lang.code}
            aria-label={lang.full}
            title={lang.full}
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded transition-colors",
              current === lang.code
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5 gap-0.5",
        className
      )}
      role="group"
      aria-label="Select language"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          aria-pressed={current === lang.code}
          aria-label={lang.full}
          title={lang.full}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-150",
            current === lang.code
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
