import { SettingsState } from "./reducer";
import * as selectors from "./selectors";

describe("state > settings > selectors", () => {
    //Setup Data --------------------------------------------
    const defaultState: SettingsState = {
        language: "af",
    };
    //-----------------------------------------------------------

    it("languageSelector", () => {
        const actual = selectors.languageSelector.resultFunc(defaultState);

        expect(actual).toEqual("af");
    });
});
