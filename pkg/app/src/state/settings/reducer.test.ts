import { setDisplayMode, setInitialDisplayMode } from "./actions";
import { reducer, type SettingsState } from "./reducer";

describe("state > settings > reducer", () => {
  const defaultState: SettingsState = {
    language: "en",
    theme: "system",
    displayMode: null,
    quizHomePremiumDismissed: false,
  };

  it("does not overwrite a user choice with a late default measurement", () => {
    const state = reducer(defaultState, setDisplayMode("comfortable"));
    expect(reducer(state, setInitialDisplayMode("compact"))).toBe(state);
  });

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
