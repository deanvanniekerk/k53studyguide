import af from "./locales/af.json";
import xh from "./locales/xh.json";
import zu from "./locales/zu.json";
import { translations as english } from "./translations";
import type { Translations } from "./types";

type LocaleResource = { locale: string; entries: Record<string, { text: string }> };
const resources: LocaleResource[] = [af, zu, xh];

export const translations: Translations = Object.fromEntries(
  Object.entries(english).map(([key, entry]) => [
    key,
    {
      ...entry,
      ...Object.fromEntries(
        resources.flatMap((resource) => {
          const text = resource.entries[key]?.text;
          return text ? [[resource.locale, text]] : [];
        }),
      ),
    },
  ]),
);
