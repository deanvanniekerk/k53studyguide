export const releasedLocales = [
  { code: "en", name: "English" },
  { code: "af", name: "Afrikaans" },
  { code: "zu", name: "isiZulu" },
  { code: "xh", name: "isiXhosa" },
] as const;

export type ReleasedLocale = (typeof releasedLocales)[number]["code"];

export function isReleasedLocale(language: unknown): language is ReleasedLocale {
  return releasedLocales.some(({ code }) => code === language);
}

export function resolveLocale(language: unknown): ReleasedLocale {
  return isReleasedLocale(language) ? language : "en";
}

export function matchDeviceLocale(tags: readonly string[]): ReleasedLocale {
  for (const tag of tags) {
    const language = tag.toLowerCase().split(/[-_]/)[0];
    if (isReleasedLocale(language)) return language;
  }
  return "en";
}
