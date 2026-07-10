import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];
