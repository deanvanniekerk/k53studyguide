import { createSelector } from "reselect";
import type { Translations } from "@/data";
import type { RootState } from "@/state/rootReducer";
import type { TranslationsState } from "./reducer";

const rootSelector = (state: RootState): TranslationsState => state.translations;

export const translationsSelector: (state: RootState) => Translations = createSelector(
  rootSelector,
  (root) => root.translations,
);
