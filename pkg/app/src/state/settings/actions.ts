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

export const SETTINGS_SET_DISPLAY_MODE = "SETTINGS_SET_DISPLAY_MODE";

export type DisplayMode = "compact" | "comfortable";

export interface SetDisplayModeAction {
  type: typeof SETTINGS_SET_DISPLAY_MODE;
  payload: DisplayMode;
}

export const SETTINGS_SET_INITIAL_DISPLAY_MODE = "SETTINGS_SET_INITIAL_DISPLAY_MODE";

export interface SetInitialDisplayModeAction {
  type: typeof SETTINGS_SET_INITIAL_DISPLAY_MODE;
  payload: DisplayMode;
}

export const SETTINGS_DISMISS_QUIZ_HOME_PREMIUM = "SETTINGS_DISMISS_QUIZ_HOME_PREMIUM";

export interface DismissQuizHomePremiumAction {
  type: typeof SETTINGS_DISMISS_QUIZ_HOME_PREMIUM;
}

export type SettingsActions =
  | RecieveLanguageAction
  | SetThemeAction
  | SetDisplayModeAction
  | SetInitialDisplayModeAction
  | DismissQuizHomePremiumAction;

export const setTheme = (theme: Theme): SetThemeAction => ({
  type: SETTINGS_SET_THEME,
  payload: theme,
});

export const setDisplayMode = (displayMode: DisplayMode): SetDisplayModeAction => ({
  type: SETTINGS_SET_DISPLAY_MODE,
  payload: displayMode,
});

export const setInitialDisplayMode = (displayMode: DisplayMode): SetInitialDisplayModeAction => ({
  type: SETTINGS_SET_INITIAL_DISPLAY_MODE,
  payload: displayMode,
});

export const dismissQuizHomePremium = (): DismissQuizHomePremiumAction => ({
  type: SETTINGS_DISMISS_QUIZ_HOME_PREMIUM,
});
