import { type Translations, translations } from "@/data";
import type { TranslationsAction } from "./actions";

export type TranslationsState = {
  readonly translations: Translations;
};

export const defaultState: TranslationsState = {
  translations: translations,
};

export const reducer = (state: TranslationsState = defaultState, action: TranslationsAction): TranslationsState => {
  if (action.type !== "TRANSLATIONS_RECEIVE_LOCALE") return state;
  return {
    translations: Object.fromEntries(
      Object.entries(action.payload.translation).map(([key, entry]) => [
        key,
        {
          ...state.translations[key],
          ...(entry[action.payload.language] ? { [action.payload.language]: entry[action.payload.language] } : {}),
        },
      ]),
    ),
  };
};
