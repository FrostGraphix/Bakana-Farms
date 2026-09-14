"use client";

import * as React from "react";
import {
  type SupportedLanguage,
  LANGUAGES,
  TRANSLATIONS,
  type LanguageInfo,
} from "./translations";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

function readLanguageCookie(): SupportedLanguage {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)bakana_lang=(en|fr|es|ha|yo)/);
  if (m?.[1]) return m[1] as SupportedLanguage;

  try {
    const saved = localStorage.getItem("bakana_lang");
    if (saved && ["en", "fr", "es", "ha", "yo"].includes(saved)) {
      return saved as SupportedLanguage;
    }
  } catch {
    // Ignore localStorage access restrictions
  }

  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<SupportedLanguage>("en");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const initial = readLanguageCookie();
    setLanguageState(initial);
    setMounted(true);
    document.documentElement.lang = initial;
  }, []);

  const setLanguage = React.useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.cookie = `bakana_lang=${lang};path=/;max-age=31536000;samesite=lax`;
      try {
        localStorage.setItem("bakana_lang", lang);
      } catch {
        // Ignore localStorage error
      }
    }
  }, []);

  const t = React.useCallback(
    (key: string, fallback?: string): string => {
      const activeTranslations = TRANSLATIONS[language] ?? TRANSLATIONS.en;
      return (
        activeTranslations[key] ??
        TRANSLATIONS.en[key] ??
        fallback ??
        key
      );
    },
    [language]
  );

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: LANGUAGES,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      language: "en",
      setLanguage: () => {},
      t: (key: string, fallback?: string) =>
        TRANSLATIONS.en[key] ?? fallback ?? key,
      languages: LANGUAGES,
    };
  }
  return ctx;
}
