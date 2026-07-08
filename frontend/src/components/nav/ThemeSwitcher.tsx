"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "niwo-theme";
const THEME_OPTIONS: ThemePreference[] = ["system", "light", "dark"];

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  const resolvedTheme = preference === "system" ? getSystemTheme() : preference;
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
}

export default function ThemeSwitcher() {
  const t = useTranslations("ThemeSwitcher");
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(STORAGE_KEY);
    const nextPreference = isThemePreference(savedPreference) ? savedPreference : "system";

    applyTheme(nextPreference);
    const animationFrame = window.requestAnimationFrame(() => {
      setPreference(nextPreference);
    });

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if ((document.documentElement.dataset.themePreference ?? "system") === "system") {
        applyTheme("system");
      }
    };

    systemTheme.addEventListener("change", handleSystemThemeChange);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      systemTheme.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const setThemePreference = (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    applyTheme(nextPreference);

    if (nextPreference === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    }
  };

  return (
    <div
      aria-label={t("label")}
      className="theme-control inline-flex items-center rounded-full border p-1 font-mono text-xs font-medium tracking-wide"
    >
      {THEME_OPTIONS.map((option) => {
        const isActive = preference === option;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => setThemePreference(option)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              isActive ? "theme-control-active" : "theme-control-idle"
            }`}
          >
            {t(option)}
          </button>
        );
      })}
    </div>
  );
}
