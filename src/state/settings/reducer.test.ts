import { reducer, SettingsState } from "./reducer";

describe("state > settings > reducer", () => {
    const defaultState: SettingsState = {
        language: "en",
    };

    it("should handle SETTINGS_RECIEVE_LANGUAGE", () => {
        const state: SettingsState = {
            ...defaultState,
            language: "en",
        };

        const actualState = reducer(state, {
            type: "SETTINGS_RECIEVE_LANGUAGE",
            payload: "zu",
        });

        const expectedState = {
            ...defaultState,
            language: "zu",
        };

        expect(actualState).toEqual(expectedState);
    });
});
