import { SettingsActions } from "./";

export type SettingsState = {
    readonly language: string;
};

export const defaultState: SettingsState = {
    language: "en",
};

export const reducer = (
    state: SettingsState = defaultState,
    action: SettingsActions
): SettingsState => {
    switch (action.type) {
        case "SETTINGS_RECIEVE_LANGUAGE":
            return {
                ...state,
                language: action.payload,
            };
        default:
            return state;
    }
};
