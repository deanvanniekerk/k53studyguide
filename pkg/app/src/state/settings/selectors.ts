import { createSelector, type Selector } from "reselect";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { SettingsState } from "./reducer";

const rootSelector: Selector<RootState, SettingsState> = (state: RootState): SettingsState => state.settings;

export const languageSelector: OutputSelector<RootState, string, (state: SettingsState) => string> = createSelector(
  rootSelector,
  (root) => resolveLocale(root.language),
);

export const welcomeCompletedSelector = createSelector(rootSelector, (root) => root.welcomeCompleted === true);
export const hasSavedLanguageSelector = createSelector(rootSelector, (root) => root.hasSavedLanguage === true);

export const themeSelector: OutputSelector<
  RootState,
  SettingsState["theme"],
  (state: SettingsState) => SettingsState["theme"]
> = createSelector(rootSelector, (root) => root.theme);

export const displayModeSelector = createSelector(rootSelector, (root) => root.displayMode ?? null);

export const quizHomePremiumDismissedSelector = createSelector(
  rootSelector,
  (root) => root.quizHomePremiumDismissed ?? false,
);

import { resolveLocale } from "@k53studyguide/shared/data";
