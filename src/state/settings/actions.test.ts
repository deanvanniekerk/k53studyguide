import * as actions from "./actions";

describe("state > settings > actions", () => {
    it("recieveTargetNavigationKey", () => {
        const expectedAction = {
            type: "SETTINGS_RECIEVE_LANGUAGE",
            payload: "zu",
        };

        expect(actions.recieveLanguage("zu")).toEqual(expectedAction);
    });
});
