import type { Dispatch } from "redux";
import { loadLocale, type ReleasedLocale, resolveLocale, type Translations } from "@/data";

export const receiveLocale = (language: ReleasedLocale, translation: Translations) => ({
  type: "TRANSLATIONS_RECEIVE_LOCALE" as const,
  payload: { language, translation },
});
export type TranslationsAction = ReturnType<typeof receiveLocale>;

export const ensureLocale = (language: string) => async (dispatch: Dispatch<TranslationsAction>) => {
  try {
    const locale = resolveLocale(language);
    dispatch(receiveLocale(locale, await loadLocale(locale)));
  } catch {
    console.warn("Unable to load the selected language. English remains available; reconnect and reload to retry.");
  }
};
