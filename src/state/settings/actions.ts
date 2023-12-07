export const SETTINGS_RECIEVE_LANGUAGE = 'SETTINGS_RECIEVE_LANGUAGE';

export interface RecieveLanguageAction {
  type: typeof SETTINGS_RECIEVE_LANGUAGE;
  payload: string;
}

export type SettingsActions = RecieveLanguageAction;

export const recieveLanguage = (key: string): RecieveLanguageAction => ({
  type: SETTINGS_RECIEVE_LANGUAGE,
  payload: key,
});
