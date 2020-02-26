import * as actions from "./actions";

describe("state > dojo > navigation > actions", () => {
    it("recieveTargetNavigationKey", () => {
        const expectedAction = {
            type: "DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY",
            payload: "99",
        };

        expect(actions.recieveTargetNavigationKey("99")).toEqual(expectedAction);
    });
});
