import type {Metadata} from "next";
import {routing} from "./routing";

export function getLocalizedAlternates(pathname = ""): Metadata["alternates"] {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `/${locale}${pathname}`]),
    ),
  };
}
