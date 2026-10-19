import { resolveLocale } from "./locales";
import { translations as english } from "./translations";
import type { Translations } from "./types";

/** English and the small welcome vocabulary are available before any network load. */
export const translations: Translations = english;
type LocaleResource = { locale: string; entries: Record<string, { text: string }> };
const loaders = {
  af: () => import("./locales/af.json"),
  zu: () => import("./locales/zu.json"),
  xh: () => import("./locales/xh.json"),
};
const pending = new Map<string, Promise<Translations>>();

export function loadLocale(code: string): Promise<Translations> {
  const locale = resolveLocale(code);
  if (locale === "en") return Promise.resolve(translations);
  const cached = pending.get(locale);
  if (cached) return cached;
  const loading = loaders[locale]()
    .then(({ default: resource }: { default: LocaleResource }) =>
      Object.fromEntries(
        Object.entries(english).map(([key, entry]) => [
          key,
          {
            ...entry,
            ...(resource.entries[key]?.text ? { [locale]: resource.entries[key].text } : {}),
          },
        ]),
      ),
    )
    .catch((error) => {
      pending.delete(locale);
      throw error;
    });
  pending.set(locale, loading);
  return loading;
}
