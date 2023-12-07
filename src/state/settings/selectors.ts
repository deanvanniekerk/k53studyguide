import { RootState } from '@/state/rootReducer';
import { createSelector, OutputSelector, Selector } from 'reselect';
import { SettingsState } from './reducer';

const rootSelector: Selector<RootState, SettingsState> = (state: RootState): SettingsState => state.settings;

export const languageSelector: OutputSelector<RootState, string, (state: SettingsState) => string> = createSelector(
  rootSelector,
  (root) => root.language,
);
