import type { DisplayMode, SettingsActions, Theme } from "./actions";

export type SettingsState = {
  readonly language: string;
  readonly theme: Theme;
  // Chosen from the Study page's fit after persisted settings have loaded.
  readonly displayMode: DisplayMode | null;
  readonly quizHomePremiumDismissed: boolean;
};

export const defaultState: SettingsState = {
  language: "en",
  theme: "system",
  displayMode: null,
  quizHomePremiumDismissed: false,
};

export const reducer = (state: SettingsState = defaultState, action: SettingsActions): SettingsState => {
  switch (action.type) {
    case "SETTINGS_RECIEVE_LANGUAGE":
      return {
        ...state,
        language: action.payload,
      };
    case "SETTINGS_SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    case "SETTINGS_SET_DISPLAY_MODE":
      return {
        ...state,
        displayMode: action.payload,
      };
    case "SETTINGS_SET_INITIAL_DISPLAY_MODE":
      return state.displayMode ? state : { ...state, displayMode: action.payload };
    case "SETTINGS_DISMISS_QUIZ_HOME_PREMIUM":
      return { ...state, quizHomePremiumDismissed: true };
    default:
      return state;
  }
};
