export const SETTINGS_RECIEVE_LANGUAGE = "SETTINGS_RECIEVE_LANGUAGE";

export interface RecieveLanguageAction {
  type: typeof SETTINGS_RECIEVE_LANGUAGE;
  payload: string;
}

export const recieveLanguage = (key: string): RecieveLanguageAction => ({
  type: SETTINGS_RECIEVE_LANGUAGE,
  payload: key,
});

export const SETTINGS_SET_THEME = "SETTINGS_SET_THEME";

export type Theme = "light" | "dark" | "system";

export interface SetThemeAction {
  type: typeof SETTINGS_SET_THEME;
  payload: Theme;
}

export type SettingsActions = RecieveLanguageAction | SetThemeAction;

export const setTheme = (theme: Theme): SetThemeAction => ({
  type: SETTINGS_SET_THEME,
  payload: theme,
});
