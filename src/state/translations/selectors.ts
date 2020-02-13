import { createSelector } from "reselect";
import { Translations } from "src/data";
import { RootState } from "src/state/rootReducer";

import { TranslationsState } from "./reducer";

const rootSelector = (state: RootState): TranslationsState => state.translations;

export const translationsSelector: (state: RootState) => Translations = createSelector(
    rootSelector,
    root => root.translations
);
