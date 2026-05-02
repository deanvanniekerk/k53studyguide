import { createSelector, type Selector } from "reselect";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { SettingsState } from "./reducer";

const rootSelector: Selector<RootState, SettingsState> = (state: RootState): SettingsState => state.settings;

export const languageSelector: OutputSelector<RootState, string, (state: SettingsState) => string> = createSelector(
  rootSelector,
  (root) => root.language,
);
