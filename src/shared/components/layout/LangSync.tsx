"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function LangSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language?.slice(0, 2) ?? "en";
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return null;
}
