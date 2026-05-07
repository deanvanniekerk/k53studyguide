import type { SettingsState } from "./reducer";
import * as selectors from "./selectors";

describe("state > settings > selectors", () => {
  //Setup Data --------------------------------------------
  const defaultState: SettingsState = {
    language: "af",
    theme: "system",
  };
  //-----------------------------------------------------------

  it("languageSelector", () => {
    const actual = selectors.languageSelector.resultFunc(defaultState);

    expect(actual).toEqual("af");
  });

  it("themeSelector", () => {
    const actual = selectors.themeSelector.resultFunc(defaultState);

    expect(actual).toEqual("system");
  });
});
