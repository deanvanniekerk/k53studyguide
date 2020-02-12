import * as actions from "@/state/study/navigation/actions";

describe("state > study > navigation > actions", () => {
    it("recieveCurrentNavigationKey", () => {
        const expectedAction = {
            type: "STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY",
            payload: "99",
        };

        expect(actions.recieveCurrentNavigationKey("99")).toEqual(expectedAction);
    });
});
