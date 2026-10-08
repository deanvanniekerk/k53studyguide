import type { SettingsState } from "./reducer";
import * as selectors from "./selectors";

describe("state > settings > selectors", () => {
  //Setup Data --------------------------------------------
  const defaultState: SettingsState = {
    language: "af",
    theme: "system",
    displayMode: null,
    quizHomePremiumDismissed: false,
  };
  //-----------------------------------------------------------

  it("treats settings saved before Display mode existed as needing a default", () => {
    const { displayMode: _displayMode, ...legacyState } = defaultState;
    expect(selectors.displayModeSelector.resultFunc(legacyState as SettingsState)).toBeNull();
  });

  it("languageSelector", () => {
    const actual = selectors.languageSelector.resultFunc(defaultState);

    expect(actual).toEqual("af");
  });

  it("shows the quiz homepage invitation for settings saved before dismissal existed", () => {
    const { quizHomePremiumDismissed: _dismissed, ...legacyState } = defaultState;
    expect(selectors.quizHomePremiumDismissedSelector.resultFunc(legacyState as SettingsState)).toBe(false);
  });

  it("themeSelector", () => {
    const actual = selectors.themeSelector.resultFunc(defaultState);

    expect(actual).toEqual("system");
  });
});
