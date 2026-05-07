import type { SettingsActions, Theme } from "./";

export type SettingsState = {
  readonly language: string;
  readonly theme: Theme;
};

export const defaultState: SettingsState = {
  language: "en",
  theme: "system",
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
    default:
      return state;
  }
};
