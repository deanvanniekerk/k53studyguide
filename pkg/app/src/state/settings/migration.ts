import type { PersistedState } from "redux-persist";
import type { SettingsState } from "./reducer";

export async function migrateSettings(state: PersistedState): Promise<PersistedState> {
  if (!state) return state;
  const settings = state as unknown as SettingsState;
  const migrated = {
    ...state,
    // Legacy installations already have a saved language, including English.
    hasSavedLanguage: settings.hasSavedLanguage ?? typeof settings.language === "string",
  };
  return migrated;
}
