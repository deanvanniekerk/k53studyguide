import * as actions from "@/state/study/log/actions";

describe("state > study > log > actions", () => {
    it("recieveSeenContentKey", () => {
        const expectedAction = {
            type: "STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY",
            payload: "99",
        };

        expect(actions.recieveSeenContentKey("99")).toEqual(expectedAction);
    });
});
